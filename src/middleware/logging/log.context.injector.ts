import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

export interface LogContext {
  traceId: string;
  userId?: string;
  [key: string]: any;
}

export const logContextStorage = new AsyncLocalStorage<LogContext>();

export function logContextInjectorMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
  res.setHeader('X-Trace-ID', traceId);

  const context: LogContext = {
    traceId,
    userId: (req as any).user?.id,
  };

  logContextStorage.run(context, () => {
    next();
  });
}