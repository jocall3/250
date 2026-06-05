import { Request, Response, NextFunction } from 'express';

export class GeoIpBlocker {
  private static readonly BLOCKED_COUNTRIES = new Set([
    'KP',
    'IR',
    'SY',
    'CU',
    'RU',
    'BY'
  ]);

  public static handle(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const countryCode = GeoIpBlocker.lookupCountry(ip, req.headers);

    if (GeoIpBlocker.BLOCKED_COUNTRIES.has(countryCode)) {
      res.status(403).json({
        error: 'Access denied: This service is unavailable in your region due to compliance restrictions.'
      });
      return;
    }

    next();
  }

  private static lookupCountry(ip: string, headers: Record<string, any>): string {
    if (headers['cf-ipcountry']) {
      return String(headers['cf-ipcountry']).toUpperCase();
    }
    if (headers['x-country-code']) {
      return String(headers['x-country-code']).toUpperCase();
    }

    if (ip.startsWith('175.45.176.')) return 'KP';
    if (ip.startsWith('5.134.128.')) return 'RU';
    if (ip.startsWith('190.6.64.')) return 'CU';

    return 'US';
  }
}