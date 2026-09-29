import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testEmailRoutes from './routes/testEmailRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.resolve(__dirname, '../uploads');

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  }),
);
app.use(express.json());
app.use('/uploads', express.static(uploadsRoot));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
/** TEMPORARY Resend SMTP check — remove after verification */
app.use('/api/test-email', testEmailRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`[server] Listening on http://localhost:${env.port}`);
      if (env.isDev) {
        console.log(`[server] Environment: ${env.nodeEnv}`);
        console.log(`[server] Health check: http://localhost:${env.port}/api/health`);
        console.log(
          `[server] Ollama: ${env.ollamaBaseUrl} (model: ${env.ollamaModel})`,
        );
      }
    });
  } catch (error) {
    console.error('[server] Startup aborted:', error.message);
    process.exit(1);
  }
}

startServer();
