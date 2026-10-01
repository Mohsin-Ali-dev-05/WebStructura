/** Shared client-side form validation — mirrors backend rules. */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

/**
 * Prefer backend JSON message (fetch payload or axios-style response).
 */
export function getApiErrorMessage(err, fallback = 'Something went wrong.') {
  if (!err) {
    return fallback;
  }

  const fromAxios = err.response?.data?.message;
  if (typeof fromAxios === 'string' && fromAxios.trim()) {
    return fromAxios.trim();
  }

  const fromPayload = err.payload?.message;
  if (typeof fromPayload === 'string' && fromPayload.trim()) {
    return fromPayload.trim();
  }

  if (typeof err.message === 'string' && err.message.trim()) {
    return err.message.trim();
  }

  return fallback;
}

export function validateLoginFields({ email, password }) {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Work email required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password required';
  }

  return errors;
}

export function validateRegisterFields({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name?.trim()) {
    errors.name = 'Full name required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email?.trim()) {
    errors.email = 'Work email required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password required';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateForgotPasswordFields({ email }) {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function validateResetPasswordFields({ password, confirmPassword }) {
  const errors = {};

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateSettingsFields({ name, email }) {
  const errors = {};

  if (!name?.trim() || name.trim().length < 2) {
    errors.name = 'Display name must be at least 2 characters.';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function validateContactFields({ name, email, message }) {
  const errors = {};

  if (!name?.trim() || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!message?.trim() || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export function fieldClass(base, hasError) {
  if (!hasError) {
    return base;
  }
  return `${base} field-input--error border-red-500 focus:ring-red-500 focus:border-red-500 focus-within:ring-red-500 focus-within:border-red-500`;
}
