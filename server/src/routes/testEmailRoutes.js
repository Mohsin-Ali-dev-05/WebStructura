import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { sendTestEmail } from '../services/emailService.js';

const router = Router();

/**
 * TEMPORARY — delete after verifying Resend SMTP.
 * Replace TEST_RECIPIENT with the inbox on your Resend account
 * (onboarding@resend.dev can only deliver to that address).
 */
const TEST_RECIPIENT = 'YOUR_PERSONAL_EMAIL@example.com';

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    if (
      !TEST_RECIPIENT ||
      TEST_RECIPIENT.includes('example.com') ||
      !TEST_RECIPIENT.includes('@')
    ) {
      throw new AppError(
        'Set TEST_RECIPIENT in server/src/routes/testEmailRoutes.js to your personal email before testing.',
        400,
      );
    }

    const info = await sendTestEmail(TEST_RECIPIENT);

    res.status(200).json({
      success: true,
      message: 'Hello from WebStructura — test email sent.',
      data: {
        to: TEST_RECIPIENT,
        messageId: info.messageId,
      },
    });
  }),
);

export default router;
