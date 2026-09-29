import multer from 'multer';
import { AppError } from '../utils/AppError.js';
import { isAllowedImageMime } from '../services/avatarStorage.js';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!isAllowedImageMime(file.mimetype)) {
    cb(
      new AppError(
        'Invalid image type. Use JPEG, PNG, WebP, or GIF under 2MB.',
        400,
      ),
    );
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_AVATAR_BYTES, files: 1 },
  fileFilter,
});

/**
 * Expects multipart field name `avatar`.
 */
export const uploadAvatarMiddleware = upload.single('avatar');

export function handleAvatarUploadError(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('Image must be 2MB or smaller.', 400));
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new AppError('Unexpected file field. Use field name "avatar".', 400));
      return;
    }
    next(new AppError(err.message || 'Invalid upload.', 400));
    return;
  }

  next(err);
}
