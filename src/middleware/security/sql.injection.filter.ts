import { Request, Response, NextFunction } from 'express';

const sqlRegex = new RegExp(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)|(--)/i);

const checkPayload = (payload: any): boolean => {
  if (typeof payload === 'string') return sqlRegex.test(payload);
  if (typeof payload === 'object' && payload !== null) {
    return Object.values(payload).some(checkPayload);
  }
  return false;
};

export const sqlInjectionFilter = (req: Request, res: Response, next: NextFunction) => {
  if (checkPayload(req.body) || checkPayload(req.query)) {
    return res.status(400).json({ error: 'Potential SQL Injection detected' });
  }
  next();
};
