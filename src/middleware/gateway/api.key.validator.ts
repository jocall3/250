import { Request, Response, NextFunction } from 'express';

export interface ApiKeyDetails {
  clientId: string;
  tier: 'free' | 'premium' | 'enterprise';
  expiresAt: Date;
}

const VALID_KEYS: Record<string, ApiKeyDetails> = {
  'trump_250_gold_key_prod_abc123': {
    clientId: 'trump-financial-corp',
    tier: 'enterprise',
    expiresAt: new Date('2030-12-31T23:59:59Z')
  },
  'b2b_partner_key_xyz789': {
    clientId: 'legacy-partner-inc',
    tier: 'premium',
    expiresAt: new Date('2027-01-01T00:00:00Z')
  }
};

const REVOKED_KEYS = new Set<string>([
  'revoked_key_999',
  'compromised_key_456'
]);

export interface AuthenticatedRequest extends Request {
  apiKeyDetails?: ApiKeyDetails;
}

export function apiKeyValidator(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] || req.query['api_key'];

  if (!apiKey || typeof apiKey !== 'string') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is missing. Please provide a valid x-api-key header or api_key query parameter.'
    });
    return;
  }

  if (REVOKED_KEYS.has(apiKey)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'The provided API key has been revoked due to security policies.'
    });
    return;
  }

  const details = VALID_KEYS[apiKey];
  if (!details) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key.'
    });
    return;
  }

  if (new Date() > details.expiresAt) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'The provided API key has expired.'
    });
    return;
  }

  req.apiKeyDetails = details;
  next();
}