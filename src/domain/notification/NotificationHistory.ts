import { DeliveryChannel } from './DeliveryChannel';

export interface HistoryEntry {
  alertId: string;
  channel: DeliveryChannel;
  title: string;
  sentAt: Date;
  status: 'SENT' | 'FAILED';
  error?: string;
}

export class NotificationHistory {
  private entries: HistoryEntry[] = [];

  constructor(
    public readonly id: string,
    public readonly subscriberId: string
  ) {}

  public recordDelivery(
    alertId: string,
    channel: DeliveryChannel,
    title: string,
    status: 'SENT' | 'FAILED',
    error?: string
  ): void {
    this.entries.push({
      alertId,
      channel,
      title,
      sentAt: new Date(),
      status,
      error
    });
  }

  public getEntries(): HistoryEntry[] {
    return [...this.entries].sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  public getSentCount(): number {
    return this.entries.filter(e => e.status === 'SENT').length;
  }

  public getFailedCount(): number {
    return this.entries.filter(e => e.status === 'FAILED').length;
  }
}