import cors from 'cors';
import { Request } from 'express';
import { redisClient } from '../../utils/redis';

const corsOptionsDelegate = async (req: Request, callback: (err: Error | null, options?: cors.CorsOptions) => void) => {
  const origin = req.header('Origin');
  let corsOptions: cors.CorsOptions = { origin: false };
  if (origin) {
    try {
      const isWhitelisted = await redisClient.sIsMember('cors_whitelist', origin);
      if (isWhitelisted) {
        corsOptions = { origin: true, credentials: true };
      }
    } catch (err) {
      corsOptions = { origin: false };
    }
  }
  callback(null, corsOptions);
};

export const corsConfig = cors(corsOptionsDelegate);
