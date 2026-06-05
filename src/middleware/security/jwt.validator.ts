import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const publicKeyPath = path.resolve(__dirname, '../../../keys/public.pem');
const publicKey = fs.existsSync(publicKeyPath) ? fs.readFileSync(publicKeyPath, 'utf8') : 'mock-key';

export const jwtValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req as any).token;
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://api.trump250.com',
      audience: 'https://app.trump250.com'
    });
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
