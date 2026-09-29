import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Redacts credentials from a MongoDB URI for safe logging.
 * Example: mongodb://user:pass@host:27017/db → mongodb://***@host:27017/db
 */
export function redactMongoUri(uri) {
  return uri.replace(/\/\/([^@/]+)@/, '//***@');
}

function registerConnectionEvents() {
  const { connection } = mongoose;

  connection.on('connected', () => {
    if (env.isDev) {
      console.log(
        `[db] Connected to MongoDB database "${connection.name}" at ${connection.host}:${connection.port}`,
      );
    } else {
      console.log('[db] MongoDB connected');
    }
  });

  connection.on('error', (error) => {
    console.error('[db] MongoDB connection error:', error.message);
  });

  connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  connection.on('reconnected', () => {
    console.log('[db] MongoDB reconnected');
  });
}

/**
 * Establishes the Mongoose connection using DB_URI (or MONGO_URI) from the environment.
 * Call once when the Express server starts. Throws on failure.
 */
export async function connectDB() {
  if (env.isDev) {
    console.log(`[db] Connecting to ${redactMongoUri(env.mongoUri)} ...`);
  }

  registerConnectionEvents();

  try {
    await mongoose.connect(env.mongoUri);
    return mongoose.connection;
  } catch (error) {
    console.error('[db] Failed to connect to MongoDB:', error.message);
    console.error(
      '[db] Ensure MongoDB is running and DB_URI in server/.env is correct.',
    );
    throw error;
  }
}

export function getDbStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const { connection } = mongoose;

  return {
    state: states[connection.readyState] || 'unknown',
    readyState: connection.readyState,
    name: connection.name || null,
    host: connection.host || null,
  };
}
