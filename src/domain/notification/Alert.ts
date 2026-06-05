import { UrgencyLevel } from './UrgencyLevel';
import { DeliveryChannel } from './DeliveryChannel';

export class Alert {
  private sentAt?: Date;
  private status: 'PENDING' | 'SENT' | 'FAILED' = 'PENDING';
  private failureReason?: string;

  constructor(
    public readonly id: string,
    public readonly subscriberId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly urgency: UrgencyLevel,
    public readonly channel: DeliveryChannel,
    public readonly category: string,
    public readonly createdAt: Date = new Date()
  ) {}

  public markAsSent(): void {
    if (this.status === 'SENT') {
      throw new Error('Alert has already been sent.');
    }
    this.status = 'SENT';
    this.sentAt = new Date();
  }

  public markAsFailed(reason: string): void {
    this.status = 'FAILED';
    this.failureReason = reason;
  }

  public getStatus(): 'PENDING' | 'SENT' | 'FAILED' {
    return this.status;
  }

  public getSentAt(): Date | undefined {
    return this.sentAt;
  }

  public getFailureReason(): string | undefined {
    return this.failureReason;
  }
}