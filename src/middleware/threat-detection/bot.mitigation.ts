import { Request, Response, NextFunction } from 'express';
import { IpBlacklistService } from '../../services/threat-detection/ip.blacklist.service';

export class BotMitigationMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.headers['user-agent'] || '';
    const secChUa = req.headers['sec-ch-ua'] as string || '';
    const acceptLanguage = req.headers['accept-language'];
    const connection = req.headers['connection'];

    const isHeadless = 
      userAgent.includes('HeadlessChrome') ||
      userAgent.includes('Puppeteer') ||
      userAgent.includes('Playwright') ||
      userAgent.includes('Selenium') ||
      userAgent.includes('WebDriver');

    if (isHeadless) {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      IpBlacklistService.getInstance().blacklistIp(ip, 'Headless browser bot detected', 3600);
      res.status(403).json({ error: 'Access denied: Automated bot detected.' });
      return;
    }

    if (!acceptLanguage || !connection) {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      IpBlacklistService.getInstance().blacklistIp(ip, 'Missing standard browser headers', 1800);
      res.status(400).json({ error: 'Bad Request: Missing required browser headers.' });
      return;
    }

    if (secChUa && userAgent) {
      const hasChromeHint = secChUa.includes('Google Chrome') || secChUa.includes('Chromium');
      const claimsChromeUA = userAgent.includes('Chrome') || userAgent.includes('Chromium');
      
      if (hasChromeHint && !claimsChromeUA) {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        IpBlacklistService.getInstance().blacklistIp(ip, 'Client hint and User-Agent mismatch', 3600);
        res.status(403).json({ error: 'Access denied: Client fingerprint mismatch.' });
        return;
      }
    }

    next();
  }
}