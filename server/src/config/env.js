import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy server/.env.example to server/.env and set ${name}.`,
    );
  }

  return value.trim();
}

function optional(name, fallback = '') {
  const value = process.env[name];
  if (!value || !value.trim()) {
    return fallback;
  }
  return value.trim();
}

/** Prefer DB_URI (local Mongo); fall back to MONGO_URI for older .env files. */
function resolveMongoUri() {
  const dbUri = optional('DB_URI');
  if (dbUri) {
    return dbUri;
  }
  return required('MONGO_URI');
}

/** Always allow local Vite + production Netlify; CLIENT_ORIGIN may add more (comma-separated). */
const DEFAULT_CLIENT_ORIGINS = [
  'http://localhost:5173',
  'https://webstructura.netlify.app',
];

function resolveClientOrigins() {
  const fromEnv = optional('CLIENT_ORIGIN')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_CLIENT_ORIGINS, ...fromEnv])];
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: resolveMongoUri(),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
  /** @deprecated Prefer clientOrigins — kept for any single-origin callers */
  clientOrigin: optional('CLIENT_ORIGIN', 'http://localhost:5173').split(',')[0].trim(),
  clientOrigins: resolveClientOrigins(),
  isDev: (process.env.NODE_ENV || 'development') !== 'production',
  /** Local Ollama HTTP API — never expose these to the frontend */
  ollamaBaseUrl: optional('OLLAMA_BASE_URL', 'http://localhost:11434').replace(
    /\/$/,
    '',
  ),
  ollamaModel: optional('OLLAMA_MODEL', 'qwen2.5:3b'),
  /** Resend (or other) SMTP — always loaded from process.env, never hardcoded */
  smtpHost: optional('SMTP_HOST'),
  smtpPort: Number(optional('SMTP_PORT', '465')) || 465,
  smtpUser: optional('SMTP_USER'),
  smtpPass: optional('SMTP_PASS'),
  emailFrom: optional('EMAIL_FROM', 'onboarding@resend.dev'),
  /** Cloudinary (profile avatars). When unset in development, local /uploads is used. */
  cloudinaryCloudName: optional('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: optional('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: optional('CLOUDINARY_API_SECRET'),
  /** Public base URL for locally stored avatars (dev fallback). */
  publicApiUrl: optional(
    'PUBLIC_API_URL',
    `http://localhost:${Number(process.env.PORT) || 5000}`,
  ),
};
