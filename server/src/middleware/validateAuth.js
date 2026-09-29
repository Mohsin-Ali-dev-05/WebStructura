import { AppError } from '../utils/AppError.js';
import { EMAIL_REGEX } from '../models/User.js';
import {
  MIN_PASSWORD_LENGTH,
  isNonEmptyString,
  isValidEmail,
  normalizeEmail,
  requireBody,
} from '../utils/validateRequest.js';

export function validateRegister(req, res, next) {
  try {
    const body = requireBody(req);
    const errors = [];
    const { name, email, password } = body;

    if (!isNonEmptyString(name) || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }

    if (!isValidEmail(email)) {
      errors.push('A valid email address is required.');
    }

    if (!isNonEmptyString(password) || password.length < MIN_PASSWORD_LENGTH) {
      errors.push(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    req.body.name = name.trim();
    req.body.email = normalizeEmail(email);
    req.body.password = password;
    next();
  } catch (error) {
    next(error);
  }
}

export function validateLogin(req, res, next) {
  try {
    const body = requireBody(req);
    const errors = [];
    const { email, password } = body;

    if (!isValidEmail(email)) {
      errors.push('A valid email address is required.');
    }

    if (!isNonEmptyString(password)) {
      errors.push('Password is required.');
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    req.body.email = normalizeEmail(email);
    req.body.password = password;
    next();
  } catch (error) {
    next(error);
  }
}

export function validateForgotPassword(req, res, next) {
  try {
    const body = requireBody(req);
    const { email } = body;

    if (!isValidEmail(email)) {
      return next(new AppError('A valid email address is required.', 400));
    }

    req.body.email = normalizeEmail(email);
    next();
  } catch (error) {
    next(error);
  }
}

export function validateResetPassword(req, res, next) {
  try {
    const body = requireBody(req);
    const { password } = body;

    if (!isNonEmptyString(password) || password.length < MIN_PASSWORD_LENGTH) {
      return next(
        new AppError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
          400,
        ),
      );
    }

    req.body.password = password;
    next();
  } catch (error) {
    next(error);
  }
}

export function validateUpdateProfile(req, res, next) {
  try {
    const body = requireBody(req);
    const errors = [];
    const { name, email } = body;

    if (!isNonEmptyString(name) || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }

    if (!isValidEmail(email)) {
      errors.push('A valid email address is required.');
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    req.body.name = name.trim();
    req.body.email = normalizeEmail(email);
    next();
  } catch (error) {
    next(error);
  }
}

export { EMAIL_REGEX, MIN_PASSWORD_LENGTH };
