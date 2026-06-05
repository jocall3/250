import { Request, Response, NextFunction } from 'express';

const GATEWAY_TIMEOUT_MS = 10000;

export function gatewayTimeoutManager(req: Request, res: Response, next: NextFunction): void {
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'The upstream microservice failed to respond within the strict 10-second timeout limit.'
      });
      req.destroy();
    }
  }, GATEWAY_TIMEOUT_MS);

  res.on('finish', () => {
    clearTimeout(timer);
  });

  res.on('close', () => {
    clearTimeout(timer);
  });

  next();
}

export async function executeWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = GATEWAY_TIMEOUT_MS
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Gateway Timeout: Downstream call exceeded ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}