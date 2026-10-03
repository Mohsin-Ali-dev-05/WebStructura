import User from '../models/User.js';
import {
  deleteAvatarImage,
  uploadAvatarImage,
} from '../services/avatarStorage.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatUser } from '../utils/formatUser.js';
import {
  assertPasswordStrength,
  isValidEmail,
  normalizeEmail,
  requireBody,
} from '../utils/validateRequest.js';

/**
 * PUT /api/users/me
 * Protected — update the authenticated user's display name and email.
 */
export const updateCurrentUser = asyncHandler(async (req, res) => {
  const body = requireBody(req);
  const { displayName, email } = body;

  if (
    !displayName ||
    typeof displayName !== 'string' ||
    displayName.trim().length < 2
  ) {
    throw new AppError(
      'displayName is required (at least 2 characters).',
      400,
    );
  }

  if (!isValidEmail(email)) {
    throw new AppError('A valid email address is required.', 400);
  }

  const normalizedEmail = normalizeEmail(email);
  const nextName = displayName.trim();

  if (!req.user?._id) {
    throw new AppError('Authentication required.', 401);
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (String(user._id) !== String(req.user._id)) {
    throw new AppError('You do not have permission to update this user.', 403);
  }

  if (normalizedEmail !== user.email) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }
  }

  user.name = nextName;
  user.email = normalizedEmail;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      user: formatUser(user),
    },
  });
});

/**
 * PUT /api/users/me/password
 * Protected — change password for local accounts (no cloud dependency).
 */
export const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new AppError('Authentication required.', 401);
  }

  const body = requireBody(req);
  const { currentPassword, newPassword } = body;

  if (!currentPassword || typeof currentPassword !== 'string') {
    throw new AppError('Current password is required.', 400);
  }

  assertPasswordStrength(newPassword, 'New password');

  if (currentPassword === newPassword) {
    throw new AppError(
      'New password must be different from your current password.',
      400,
    );
  }

  const user = await User.findById(req.user._id).select('+passwordHash');

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (!user.passwordHash) {
    throw new AppError(
      'This account signs in with Google and has no password to change.',
      400,
    );
  }

  const matches = await user.comparePassword(currentPassword);
  if (!matches) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.',
  });
});

/**
 * POST /api/users/me/avatar
 * Protected — multipart upload field `avatar` (image, max 2MB).
 */
export const uploadCurrentUserAvatar = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new AppError('Authentication required.', 401);
  }

  if (!req.file) {
    throw new AppError('Please choose an image file to upload.', 400);
  }

  const user = await User.findById(req.user._id).select('+avatarPublicId');

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const previousPublicId = user.avatarPublicId;

  const uploaded = await uploadAvatarImage({
    buffer: req.file.buffer,
    mimeType: req.file.mimetype,
    userId: String(user._id),
  });

  user.avatarUrl = uploaded.url;
  user.avatarPublicId = uploaded.publicId;
  await user.save();

  if (previousPublicId && previousPublicId !== uploaded.publicId) {
    await deleteAvatarImage(previousPublicId);
  }

  res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully.',
    data: {
      user: formatUser(user),
    },
  });
});

/**
 * DELETE /api/users/me/avatar
 * Protected — remove avatar from storage and clear user fields.
 */
export const deleteCurrentUserAvatar = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new AppError('Authentication required.', 401);
  }

  const user = await User.findById(req.user._id).select('+avatarPublicId');

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const previousPublicId = user.avatarPublicId;

  user.avatarUrl = null;
  user.avatarPublicId = null;
  await user.save();

  if (previousPublicId) {
    await deleteAvatarImage(previousPublicId);
  }

  res.status(200).json({
    success: true,
    message: 'Profile photo removed.',
    data: {
      user: formatUser(user),
    },
  });
});
