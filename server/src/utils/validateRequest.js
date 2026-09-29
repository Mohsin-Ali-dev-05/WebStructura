import { AppError } from './AppError.js';
import { EMAIL_REGEX } from '../models/User.js';

export const MIN_PASSWORD_LENGTH = 8;

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

export function isValidEmail(email) {
  return isNonEmptyString(email) && EMAIL_REGEX.test(email.trim());
}

/**
 * Ensure req.body is a plain object before reading fields.
 */
export function requireBody(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new AppError('Request body is required.', 400);
  }
  return req.body;
}

export function assertPasswordStrength(password, label = 'Password') {
  if (!isNonEmptyString(password)) {
    throw new AppError(`${label} is required.`, 400);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      `${label} must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      400,
    );
  }
}
