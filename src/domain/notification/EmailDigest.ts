import { Alert } from './Alert';

export class EmailDigest {
  private alerts: Alert[] = [];
  private generatedAt?: Date;

  constructor(
    public readonly id: string,
    public readonly subscriberId: string,
    public readonly recipientEmail: string,
    public readonly digestPeriod: 'DAILY' | 'WEEKLY'
  ) {}

  public addAlert(alert: Alert): void {
    if (alert.subscriberId !== this.subscriberId) {
      throw new Error('Cannot add alert belonging to another subscriber to this digest.');
    }
    if (alert.channel.getValue() !== 'EMAIL') {
      throw new Error('Only EMAIL alerts can be added to an EmailDigest.');
    }
    this.alerts.push(alert);
  }

  public generateDigestContent(): { subject: string; htmlBody: string } {
    this.generatedAt = new Date();
    const subject = `Your ${this.digestPeriod} Trump $250 Bill Commemorative Digest`;
    
    let htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
        <h1 style="color: #d4af37; text-align: center;">The Golden $250 Bill Digest</h1>
        <p style="font-size: 16px; color: #333;">Here is your summary of updates regarding the exclusive Trump $250 Commemorative Bill:</p>
        <hr style="border: 0; border-top: 1px solid #d4af37; margin: 20px 0;" />
    `;

    if (this.alerts.length === 0) {
      htmlBody += `<p style="color: #777; text-align: center;">No new updates for this period.</p>`;
    } else {
      this.alerts.forEach(alert => {
        htmlBody += `
          <div style="margin-bottom: 20px; padding: 10px; border-left: 4px solid #d4af37; background-color: #fcfbf7;">
            <h3 style="margin: 0 0 5px 0; color: #111;">${alert.title}</h3>
            <p style="margin: 0; color: #555; font-size: 14px;">${alert.content}</p>
            <span style="font-size: 11px; color: #999;">Priority: ${alert.urgency.getValue()} | Received: ${alert.createdAt.toLocaleDateString()}</span>
          </div>
        `;
      });
    }

    htmlBody += `
        <hr style="border: 0; border-top: 1px solid #d4af37; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          You are receiving this because you subscribed to updates for the Trump $250 Commemorative Bill.
        </p>
      </div>
    `;

    return { subject, htmlBody };
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getGeneratedAt(): Date | undefined {
    return this.generatedAt;
  }
}