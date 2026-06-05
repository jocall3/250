import { Alert } from './Alert';

export class SMSAlert {
  constructor(
    public readonly id: string,
    public readonly alertId: string,
    public readonly recipientPhoneNumber: string,
    public readonly message: string,
    public readonly isShortened: boolean = false
  ) {}

  public static fromAlert(alert: Alert, phoneNumber: string): SMSAlert {
    if (alert.channel.getValue() !== 'SMS') {
      throw new Error('Cannot create SMSAlert from a non-SMS alert.');
    }
    
    let message = alert.content;
    let isShortened = false;
    
    if (message.length > 160) {
      message = message.substring(0, 157) + '...';
      isShortened = true;
    }

    return new SMSAlert(
      `sms_${alert.id}`,
      alert.id,
      phoneNumber,
      message,
      isShortened
    );
  }
}