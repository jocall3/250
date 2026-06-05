import { Request, Response, NextFunction } from 'express';

const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH'];

export function contentTypeStrictChecker(req: Request, res: Response, next: NextFunction): void {
  if (METHODS_WITH_BODY.includes(req.method)) {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type header is missing. This endpoint strictly requires application/json.'
      });
      return;
    }

    const normalizedType = contentType.split(';')[0].trim().toLowerCase();

    if (normalizedType !== 'application/json') {
      res.status(415).json({
        error: 'Unsupported Media Type',
        message: `Unsupported Content-Type: '${contentType}'. Only 'application/json' is accepted for this request.`
      });
      return;
    }
  }

  next();
}