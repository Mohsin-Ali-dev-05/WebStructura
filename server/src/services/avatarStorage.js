import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LOCAL_UPLOADS_DIR = path.resolve(__dirname, '../../uploads/avatars');

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

let cloudinaryConfigured = false;

function ensureCloudinary() {
  if (cloudinaryConfigured) {
    return true;
  }

  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
  cloudinaryConfigured = true;
  return true;
}

export function isAllowedImageMime(mime) {
  return ALLOWED_MIME.has(String(mime || '').toLowerCase());
}

function extensionForMime(mime) {
  switch (String(mime || '').toLowerCase()) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return 'jpg';
  }
}

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'webstructura/avatars',
        resource_type: 'image',
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

async function uploadLocally(buffer, mimeType, userId) {
  await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  const ext = extensionForMime(mimeType);
  const filename = `${userId}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const filePath = path.join(LOCAL_UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);

  const base = env.publicApiUrl.replace(/\/$/, '');
  // Prefer a same-origin relative path so the Vite `/uploads` proxy works in dev.
  const url =
    env.isDev && (!base || /localhost|127\.0\.0\.1/.test(base))
      ? `/uploads/avatars/${filename}`
      : `${base}/uploads/avatars/${filename}`;

  return {
    url,
    publicId: `local:${filename}`,
  };
}

/**
 * Upload an avatar buffer to Cloudinary when configured; otherwise store locally.
 */
export async function uploadAvatarImage({ buffer, mimeType, userId }) {
  if (!buffer?.length) {
    throw new AppError('Empty image file.', 400);
  }

  if (!isAllowedImageMime(mimeType)) {
    throw new AppError(
      'Invalid image type. Use JPEG, PNG, WebP, or GIF under 2MB.',
      400,
    );
  }

  if (ensureCloudinary()) {
    try {
      return await uploadToCloudinary(buffer);
    } catch (error) {
      console.error('[avatar] Cloudinary upload failed:', error.message);
      throw new AppError('Could not upload profile photo. Try again.', 502);
    }
  }

  if (!env.isDev) {
    throw new AppError(
      'Cloud storage is not configured. Set CLOUDINARY_* env vars.',
      503,
    );
  }

  return uploadLocally(buffer, mimeType, userId);
}

/**
 * Delete a previously stored avatar. Local ids use the `local:` prefix.
 */
export async function deleteAvatarImage(publicId) {
  if (!publicId || typeof publicId !== 'string') {
    return;
  }

  if (publicId.startsWith('local:')) {
    const filename = publicId.slice('local:'.length);
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return;
    }
    try {
      await fs.unlink(path.join(LOCAL_UPLOADS_DIR, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('[avatar] Local delete failed:', error.message);
      }
    }
    return;
  }

  if (!ensureCloudinary()) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    console.warn('[avatar] Cloudinary delete failed:', error.message);
  }
}
