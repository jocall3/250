import { Request, Response, NextFunction } from 'express';
import { IpBlacklistService } from '../../services/threat-detection/ip.blacklist.service';

export class UserAgentAnalyzer {
  private static readonly MALICIOUS_AGENTS = [
    /sqlmap/i,
    /nikto/i,
    /dirbuster/i,
    /gobuster/i,
    /nmap/i,
    /censys/i,
    /shodan/i,
    /mj12bot/i,
    /ahrefsbot/i,
    /semrushbot/i,
    /python-requests/i,
    /curl/i,
    /wget/i,
    /libwww-perl/i
  ];

  public static handle(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!userAgent || userAgent.trim() === '') {
      IpBlacklistService.getInstance().blacklistIp(ip, 'Empty User-Agent header', 1800);
      res.status(403).json({ error: 'Access denied: User-Agent header is required.' });
      return;
    }

    for (const pattern of UserAgentAnalyzer.MALICIOUS_AGENTS) {
      if (pattern.test(userAgent)) {
        IpBlacklistService.getInstance().blacklistIp(ip, 'Malicious User-Agent detected', 86400);
        res.status(403).json({ error: 'Access denied: Malicious user agent blocked.' });
        return;
      }
    }

    if (userAgent.includes('MSIE 6.0') || userAgent.includes('MSIE 7.0') || userAgent.includes('MSIE 8.0')) {
      res.status(403).json({ error: 'Access denied: Outdated browser version is not supported.' });
      return;
    }

    next();
  }
}