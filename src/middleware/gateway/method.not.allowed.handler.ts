import { Request, Response, NextFunction } from 'express';

const ROUTE_ALLOWED_METHODS: Record<string, string[]> = {
  '/api/v3-trump-bill/generate': ['POST'],
  '/api/v3-trump-bill/status': ['GET'],
  '/api/v2/auth/token': ['POST'],
  '/api/v2/user/profile': ['GET', 'PUT']
};

export function methodNotAllowedHandler(req: Request, res: Response, next: NextFunction): void {
  const path = req.path;
  const allowedMethods = ROUTE_ALLOWED_METHODS[path];

  if (allowedMethods) {
    const method = req.method.toUpperCase();
    if (!allowedMethods.includes(method)) {
      res.setHeader('Allow', allowedMethods.join(', '));
      res.status(405).json({
        error: 'Method Not Allowed',
        message: `The ${method} method is not allowed for the requested URL '${path}'.`,
        allowedMethods
      });
      return;
    }
  }

  next();
}