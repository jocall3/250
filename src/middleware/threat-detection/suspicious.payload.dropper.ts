import { Request, Response, NextFunction } from 'express';

export class SuspiciousPayloadDropper {
  private static readonly MAX_DEPTH = 8;
  private static readonly MAX_ARRAY_SIZE = 500;
  private static readonly MAX_KEY_LENGTH = 128;

  public static handle(req: Request, res: Response, next: NextFunction): void {
    if (req.body && typeof req.body === 'object') {
      try {
        SuspiciousPayloadDropper.validatePayload(req.body, 1);
      } catch (error: any) {
        res.status(400).json({
          error: `Request dropped: Suspicious payload structure. Reason: ${error.message}`
        });
        return;
      }
    }
    next();
  }

  private static validatePayload(obj: any, currentDepth: number): void {
    if (currentDepth > SuspiciousPayloadDropper.MAX_DEPTH) {
      throw new Error(`Payload depth exceeds maximum limit of ${SuspiciousPayloadDropper.MAX_DEPTH}`);
    }

    if (Array.isArray(obj)) {
      if (obj.length > SuspiciousPayloadDropper.MAX_ARRAY_SIZE) {
        throw new Error(`Array size of ${obj.length} exceeds maximum limit of ${SuspiciousPayloadDropper.MAX_ARRAY_SIZE}`);
      }
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          SuspiciousPayloadDropper.validatePayload(item, currentDepth + 1);
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        if (key.length > SuspiciousPayloadDropper.MAX_KEY_LENGTH) {
          throw new Error(`Object key length of ${key.length} exceeds maximum limit of ${SuspiciousPayloadDropper.MAX_KEY_LENGTH}`);
        }
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          SuspiciousPayloadDropper.validatePayload(value, currentDepth + 1);
        }
      }
    }
  }
}