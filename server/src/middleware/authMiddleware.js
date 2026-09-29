import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Provide a Bearer token.', 401);
  }

  const token = header.slice(7).trim();

  if (!token) {
    throw new AppError('Authentication required. Provide a Bearer token.', 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Invalid or expired token.', 401);
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new AppError('User no longer exists.', 401);
  }

  req.user = user;
  next();
});
