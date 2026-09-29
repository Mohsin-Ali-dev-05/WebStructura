import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError.js';

/**
 * Nodemailer transport — Gmail SMTP via process.env credentials.
 * SMTP_PASS must be a Google App Password (not the account login password).
 */
export function createTransport() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    throw new AppError(
      'SMTP is not configured. Set SMTP_USER and SMTP_PASS in server/.env.',
      503,
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

function getFromAddress() {
  const user = process.env.SMTP_USER?.trim();
  if (!user) {
    throw new AppError(
      'SMTP is not configured. Set SMTP_USER in server/.env.',
      503,
    );
  }
  return user;
}

/**
 * Temporary connectivity check for Gmail SMTP.
 */
export async function sendTestEmail(to) {
  const transporter = createTransport();
  const from = getFromAddress();

  return transporter.sendMail({
    from: `"WebStructura" <${from}>`,
    to,
    subject: 'Hello from WebStructura',
    text: 'Hello from WebStructura',
    html: '<p><strong>Hello from WebStructura</strong></p><p>Your Gmail SMTP connection is working.</p>',
  });
}

/**
 * Professional password-reset email with a one-time frontend link.
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const transporter = createTransport();
  const from = getFromAddress();

  const mailOptions = {
    from: `"WebStructura" <${from}>`,
    to,
    subject: 'Reset your WebStructura password',
    text:
      `You requested a password reset for your WebStructura account.\n\n` +
      `Open this link within 15 minutes to choose a new password:\n${resetUrl}\n\n` +
      `If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <h1 style="font-size: 20px; margin: 0 0 12px;">Reset your password</h1>
        <p style="margin: 0 0 16px; color: #475569; line-height: 1.5;">
          We received a request to reset the password for your WebStructura account.
          Click the button below to choose a new password. This link expires in
          <strong>15 minutes</strong>.
        </p>
        <p style="margin: 0 0 24px;">
          <a href="${resetUrl}"
             style="display: inline-block; background: #059669; color: #fff; text-decoration: none; font-weight: 600; padding: 12px 20px; border-radius: 8px;">
            Reset password
          </a>
        </p>
        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; line-height: 1.5;">
          Or paste this URL into your browser:<br />
          <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
        </p>
        <p style="margin: 16px 0 0; font-size: 13px; color: #94a3b8;">
          If you did not request a reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  console.log('Sending email via Gmail SMTP...');
  return transporter.sendMail(mailOptions).catch((err) => {
    console.error('Nodemailer Error:', err);
    throw err;
  });
}

/**
 * Forward a public contact-form submission to support (reply-to = sender).
 */
export async function sendContactEmail({ name, email, message }) {
  const transporter = createTransport();
  const from = getFromAddress();
  const supportTo =
    process.env.SUPPORT_EMAIL?.trim() || 'mohsinali2k21@gmail.com';

  const safeName = String(name).trim();
  const safeEmail = String(email).trim();
  const safeMessage = String(message).trim();

  const mailOptions = {
    from: `"WebStructura Contact" <${from}>`,
    to: supportTo,
    replyTo: `"${safeName}" <${safeEmail}>`,
    subject: `Contact form: ${safeName}`,
    text:
      `New contact message from WebStructura\n\n` +
      `Name: ${safeName}\n` +
      `Email: ${safeEmail}\n\n` +
      `Message:\n${safeMessage}\n\n` +
      `— Reply to this email to respond directly to the sender.`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <h1 style="font-size: 18px; margin: 0 0 16px;">New contact form message</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 88px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(safeName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${escapeHtml(safeEmail)}" style="color: #059669;">${escapeHtml(safeEmail)}</a>
            </td>
          </tr>
        </table>
        <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; white-space: pre-wrap; line-height: 1.55;">
${escapeHtml(safeMessage)}
        </div>
        <p style="margin: 16px 0 0; font-size: 13px; color: #94a3b8;">
          Hit Reply in your mail client to respond to ${escapeHtml(safeName)}.
        </p>
      </div>
    `,
  };

  console.log('Sending contact email via Gmail SMTP to', supportTo);
  return transporter.sendMail(mailOptions).catch((err) => {
    console.error('Nodemailer Error:', err);
    throw err;
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
