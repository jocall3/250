import { IpBlacklistService } from './ip.blacklist.service';

export interface StixIndicator {
  id: string;
  type: string;
  pattern: string;
  valid_from: string;
  description: string;
}

export class ThreatIntelFeed {
  private static instance: ThreatIntelFeed;
  private isRunning = false;

  private constructor() {}

  public static getInstance(): ThreatIntelFeed {
    if (!ThreatIntelFeed.instance) {
      ThreatIntelFeed.instance = new ThreatIntelFeed();
    }
    return ThreatIntelFeed.instance;
  }

  public startSync(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.syncFeeds();
    setInterval(() => this.syncFeeds(), 3600000);
  }

  private async syncFeeds(): Promise<void> {
    try {
      const mockStixIndicators: StixIndicator[] = [
        {
          id: 'indicator--1',
          type: 'indicator',
          pattern: "[ipv4-addr:value = '198.51.100.42']",
          valid_from: new Date().toISOString(),
          description: 'Known command and control server'
        },
        {
          id: 'indicator--2',
          type: 'indicator',
          pattern: "[ipv4-addr:value = '203.0.113.110']",
          valid_from: new Date().toISOString(),
          description: 'Active brute-force botnet node'
        }
      ];

      const blacklistService = IpBlacklistService.getInstance();

      for (const indicator of mockStixIndicators) {
        const ipMatch = indicator.pattern.match(/'([^']+)'/);
        if (ipMatch && ipMatch[1]) {
          const ip = ipMatch[1];
          blacklistService.blacklistIp(
            ip,
            `STIX Threat Intel Feed: ${indicator.description}`,
            86400
          );
        }
      }
    } catch (error) {
      
    }
  }
}