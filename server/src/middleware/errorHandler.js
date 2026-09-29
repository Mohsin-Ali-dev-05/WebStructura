import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Global Express error handler — always returns JSON, never HTML stacks.
 */
export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to Express default
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(' ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'An account with this email already exists.';
  } else if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    status = 401;
    message = 'Invalid or expired token.';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path || 'ID'}.`;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = 'Image must be 2MB or smaller.';
  } else if (status >= 500 && err.name !== 'AppError') {
    // Unexpected crashes: do not leak internals to the client
    message = 'Internal server error';
  }

  if (status >= 500) {
    console.error('[api]', err);
  } else {
    console.warn(`[api] ${status}: ${message}`);
  }

  const payload = {
    success: false,
    message,
  };

  // Optional diagnostic detail only in development for AppError 4xx/known cases
  if (env.isDev && status < 500 && Array.isArray(err.details)) {
    payload.details = err.details;
  }

  res.status(status).json(payload);
}
