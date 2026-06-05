import { Request, Response, NextFunction } from 'express';

interface DeprecationPolicy {
  deprecatedAt: string;
  sunsetAt: string;
  alternativeEndpoint: string;
}

const DEPRECATED_ENDPOINTS: Record<string, DeprecationPolicy> = {
  '/api/v1/legacy-bill': {
    deprecatedAt: '2025-01-01T00:00:00Z',
    sunsetAt: '2026-12-31T23:59:59Z',
    alternativeEndpoint: '/api/v3-trump-bill/generate'
  },
  '/api/v1/old-auth': {
    deprecatedAt: '2024-06-01T00:00:00Z',
    sunsetAt: '2026-06-30T23:59:59Z',
    alternativeEndpoint: '/api/v2/auth/token'
  }
};

export function endpointDeprecationWarner(req: Request, res: Response, next: NextFunction): void {
  const path = req.path;
  const policy = DEPRECATED_ENDPOINTS[path];

  if (policy) {
    res.setHeader('Deprecation', `true; date="${policy.deprecatedAt}"`);
    res.setHeader('Sunset', policy.sunsetAt);
    res.setHeader('Link', `<${policy.alternativeEndpoint}>; rel="successor-version"`);
    res.setHeader('Warning', `299 - "The endpoint ${path} is deprecated and will be sunset on ${policy.sunsetAt}. Please migrate to ${policy.alternativeEndpoint}."`);
  }

  next();
}