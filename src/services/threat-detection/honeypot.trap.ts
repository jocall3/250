import { Request, Response } from 'express';
import { IpBlacklistService } from './ip.blacklist.service';

export class HoneypotTrap {
  private static readonly HONEYPOT_ROUTES = [
    '/wp-admin',
    '/wp-login.php',
    '/.env',
    '/config.json',
    '/admin/config.php',
    '/.git/config',
    '/phpmyadmin'
  ];

  public static isHoneypotRoute(path: string): boolean {
    return HoneypotTrap.HONEYPOT_ROUTES.some(route => path.toLowerCase().includes(route));
  }

  public static handleTrap(req: Request, res: Response): void {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const path = req.path;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    IpBlacklistService.getInstance().blacklistIp(
      ip,
      `Honeypot trap triggered: ${path} by ${userAgent}`,
      thirtyDaysInSeconds
    );

    setTimeout(() => {
      res.status(500).send('Internal Server Error');
    }, 2000);
  }
}