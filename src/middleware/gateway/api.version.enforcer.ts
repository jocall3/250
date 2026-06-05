import { Request, Response, NextFunction } from 'express';

export interface VersionedRequest extends Request {
  apiVersion?: string;
  targetServiceUrl?: string;
}

const MICROSERVICE_ROUTING_MAP: Record<string, string> = {
  'v1': 'http://microservice-v1.internal.local',
  'v2': 'http://microservice-v2.internal.local',
  'v3-trump-bill': 'http://trump-bill-service.internal.local'
};

const DEFAULT_VERSION = 'v2';

export function apiVersionEnforcer(req: VersionedRequest, res: Response, next: NextFunction): void {
  const acceptVersion = req.headers['accept-version'];

  let selectedVersion = DEFAULT_VERSION;

  if (acceptVersion) {
    if (typeof acceptVersion !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid Accept-Version header format.'
      });
      return;
    }
    selectedVersion = acceptVersion.trim().toLowerCase();
  }

  const targetUrl = MICROSERVICE_ROUTING_MAP[selectedVersion];

  if (!targetUrl) {
    res.status(400).json({
      error: 'Bad Request',
      message: `Unsupported API version requested: '${selectedVersion}'. Supported versions are: ${Object.keys(MICROSERVICE_ROUTING_MAP).join(', ')}`
    });
    return;
  }

  req.apiVersion = selectedVersion;
  req.targetServiceUrl = targetUrl;

  res.setHeader('X-API-Version', selectedVersion);

  next();
}