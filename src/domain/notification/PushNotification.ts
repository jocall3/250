import { Alert } from './Alert';

export class PushNotification {
  constructor(
    public readonly id: string,
    public readonly alertId: string,
    public readonly deviceToken: string,
    public readonly title: string,
    public readonly body: string,
    public readonly badgeCount: number = 0,
    public readonly customPayload: Record<string, any> = {}
  ) {}

  public static fromAlert(alert: Alert, deviceToken: string, customPayload: Record<string, any> = {}): PushNotification {
    if (alert.channel.getValue() !== 'PUSH') {
      throw new Error('Cannot create PushNotification from a non-PUSH alert.');
    }
    const truncatedBody = alert.content.length > 150 ? alert.content.substring(0, 147) + '...' : alert.content;
    return new PushNotification(
      `push_${alert.id}`,
      alert.id,
      deviceToken,
      alert.title,
      truncatedBody,
      1,
      customPayload
    );
  }
}