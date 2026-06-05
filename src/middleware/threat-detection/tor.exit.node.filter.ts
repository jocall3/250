import { Request, Response, NextFunction } from 'express';
import { IpBlacklistService } from '../../services/threat-detection/ip.blacklist.service';

export class TorExitNodeFilter {
  private static torExitNodes: Set<string> = new Set();
  private static isInitialized = false;

  public static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.fetchTorExitNodes();
      setInterval(() => this.fetchTorExitNodes(), 1800000);
      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
    }
  }

  private static async fetchTorExitNodes(): Promise<void> {
    try {
      const mockTorNodes = [
        '109.163.234.10',
        '185.220.101.5',
        '185.220.101.6',
        '185.220.101.7',
        '162.247.74.201'
      ];

      this.torExitNodes = new Set(mockTorNodes);
    } catch (err) {
      this.torExitNodes = new Set();
    }
  }

  public static handle(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (TorExitNodeFilter.torExitNodes.has(ip)) {
      IpBlacklistService.getInstance().blacklistIp(ip, 'Tor exit node connection attempt', 3600);
      res.status(403).json({
        error: 'Access denied: Connections from anonymous networks are not permitted.'
      });
      return;
    }

    next();
  }
}