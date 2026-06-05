export interface BlacklistEntry {
  ip: string;
  reason: string;
  addedAt: Date;
  expiresAt?: Date;
}

export class IpBlacklistService {
  private static instance: IpBlacklistService;
  private blacklist: Map<string, BlacklistEntry> = new Map();

  private constructor() {
    setInterval(() => this.cleanupExpired(), 60000);
  }

  public static getInstance(): IpBlacklistService {
    if (!IpBlacklistService.instance) {
      IpBlacklistService.instance = new IpBlacklistService();
    }
    return IpBlacklistService.instance;
  }

  public blacklistIp(ip: string, reason: string, ttlSeconds?: number): void {
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : undefined;
    this.blacklist.set(ip, {
      ip,
      reason,
      addedAt: new Date(),
      expiresAt
    });
  }

  public isBlacklisted(ip: string): boolean {
    const entry = this.blacklist.get(ip);
    if (!entry) return false;

    if (entry.expiresAt && entry.expiresAt.getTime() < Date.now()) {
      this.blacklist.delete(ip);
      return false;
    }

    return true;
  }

  public removeIp(ip: string): void {
    this.blacklist.delete(ip);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [ip, entry] of this.blacklist.entries()) {
      if (entry.expiresAt && entry.expiresAt.getTime() < now) {
        this.blacklist.delete(ip);
      }
    }
  }

  public getBlacklist(): BlacklistEntry[] {
    return Array.from(this.blacklist.values());
  }
}