import User from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatUser } from '../utils/formatUser.js';
import {
  assertPasswordStrength,
  isValidEmail,
  requireBody,
} from '../utils/validateRequest.js';


export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = requireBody(req);

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400);
  }

  assertPasswordStrength(password);

  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: formatUser(user),
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = requireBody(req);

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const matches = await user.comparePassword(password);

  if (!matches) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: formatUser(user),
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: formatUser(req.user),
    },
  });
});

/**
 * PUT /api/auth/me
 * Update the authenticated user's display name and email.
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = requireBody(req);

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new AppError('Name must be at least 2 characters.', 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError('A valid email address is required.', 400);
  }

  if (email !== req.user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }
  }

  req.user.name = name;
  req.user.email = email;
  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      user: formatUser(req.user),
    },
  });
});

/**
 * POST /api/auth/forgotpassword
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = requireBody(req);

  if (!isValidEmail(email)) {
    throw new AppError('A valid email address is required.', 400);
  }

  console.log('Hitting forgotPassword route for:', email);

  const user = await User.findOne({ email });
  console.log(
    'User lookup for forgotPassword:',
    user ? `FOUND (${user._id})` : 'NOT FOUND — skipping email send',
  );

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'There is no user with that email.',
    });
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log('Reset token generated; calling sendPasswordResetEmail…');

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      success: false,
      message: 'Email could not be sent',
    });
    return;
  }

  res.status(200).json({
    success: true,
    message:
      'If an account exists for that email, a password reset link has been sent.',
  });
});

/**
 * PUT /api/auth/resetpassword/:token
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = requireBody(req);

  if (!token || typeof token !== 'string' || token.trim().length < 20) {
    throw new AppError('Invalid or expired password reset token.', 400);
  }

  assertPasswordStrength(password);

  const hashedToken = User.hashResetToken(token.trim());

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+passwordHash +resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new AppError('Invalid or expired password reset token.', 400);
  }

  user.passwordHash = await User.hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const authToken = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.',
    data: {
      user: formatUser(user),
      token: authToken,
    },
  });
});
