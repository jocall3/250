import session from 'express-session';
import RedisStore from 'connect-redis';
import { redisClient } from '../../utils/redis';

export const sessionManager = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'super-secret-fallback-key',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24
  }
});
