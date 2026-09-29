import { sendContactEmail } from '../services/emailService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  isValidEmail,
  normalizeEmail,
  requireBody,
} from '../utils/validateRequest.js';

/**
 * POST /api/contact
 * Public contact form — emails support via Gmail SMTP.
 */
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = requireBody(req);

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new AppError('Name is required (at least 2 characters).', 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError('A valid email address is required.', 400);
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    throw new AppError('Message is required (at least 10 characters).', 400);
  }

  try {
    await sendContactEmail({
      name: name.trim(),
      email: normalizeEmail(email),
      message: message.trim(),
    });
  } catch (error) {
    console.error('[contact] Failed to send message:', error);
    throw new AppError(
      'Unable to send your message. Please try again later.',
      500,
    );
  }

  res.status(200).json({
    success: true,
    message: 'Your message has been sent. We will get back to you soon.',
  });
});
