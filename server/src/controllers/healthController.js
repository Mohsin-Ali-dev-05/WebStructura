import { asyncHandler } from '../utils/asyncHandler.js';
import { getDbStatus } from '../config/db.js';

export const getHealth = asyncHandler(async (req, res) => {
  const database = getDbStatus();
  const isConnected = database.state === 'connected';

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected
      ? 'AI-Powered Website Builder API is running'
      : 'API is up but MongoDB is not connected',
    data: {
      service: 'server',
      timestamp: new Date().toISOString(),
      database,
    },
  });
});
