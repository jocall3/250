import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../utils/redis';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 15;

export const bruteForcePreventer = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const key = `login_attempts:${ip}`;
  
  try {
    const attempts = await redisClient.get(key);
    if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Account temporarily locked due to too many failed attempts.' });
    }
    
    res.on('finish', async () => {
      if (res.statusCode === 401) {
        const current = await redisClient.incr(key);
        if (current === 1) {
          await redisClient.expire(key, LOCKOUT_DURATION);
        }
      }
    });
    
    next();
  } catch (err) {
    next();
  }
};
