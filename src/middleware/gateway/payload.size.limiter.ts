import { Request, Response, NextFunction } from 'express';

const MAX_PAYLOAD_SIZE_BYTES = 1 * 1024 * 1024;

export function payloadSizeLimiter(req: Request, res: Response, next: NextFunction): void {
  const contentLengthHeader = req.headers['content-length'];

  if (contentLengthHeader) {
    const contentLength = parseInt(contentLengthHeader, 10);
    if (isNaN(contentLength)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid Content-Length header.'
      });
      return;
    }

    if (contentLength > MAX_PAYLOAD_SIZE_BYTES) {
      res.status(413).json({
        error: 'Payload Too Large',
        message: `Request payload exceeds the maximum limit of 1MB (${MAX_PAYLOAD_SIZE_BYTES} bytes).`
      });
      return;
    }
  }

  let receivedBytes = 0;
  let limitExceeded = false;

  req.on('data', (chunk: Buffer) => {
    receivedBytes += chunk.length;
    if (receivedBytes > MAX_PAYLOAD_SIZE_BYTES && !limitExceeded) {
      limitExceeded = true;
      req.destroy();
    }
  });

  req.on('end', () => {
    if (limitExceeded) {
      if (!res.headersSent) {
        res.status(413).json({
          error: 'Payload Too Large',
          message: 'Payload size limit of 1MB exceeded during stream transmission.'
        });
      }
    } else {
      next();
    }
  });
}