import { Request, Response, NextFunction } from 'express';
import { logger } from '../../services/logging/logger.core';

export function requestResponseLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || 'unknown';

  logger.info(`Incoming Request: ${method} ${originalUrl}`, {
    http: {
      method,
      url: originalUrl,
      ip,
      userAgent,
    },
  });

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const statusCode = res.statusCode;

    logger.info(`Outgoing Response: ${method} ${originalUrl} - Status: ${statusCode} (${durationMs}ms)`, {
      http: {
        method,
        url: originalUrl,
        statusCode,
        durationMs: parseFloat(durationMs),
      },
    });
  });

  next();
}