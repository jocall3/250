import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') return xss(obj);
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      obj[key] = sanitizeObject(obj[key]);
    }
  }
  return obj;
};

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};
