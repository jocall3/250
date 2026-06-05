export enum DeliveryChannelValue {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH'
}

export class DeliveryChannel {
  private constructor(private readonly value: DeliveryChannelValue) {}

  public static email(): DeliveryChannel {
    return new DeliveryChannel(DeliveryChannelValue.EMAIL);
  }

  public static sms(): DeliveryChannel {
    return new DeliveryChannel(DeliveryChannelValue.SMS);
  }

  public static push(): DeliveryChannel {
    return new DeliveryChannel(DeliveryChannelValue.PUSH);
  }

  public static fromString(value: string): DeliveryChannel {
    const upper = value.toUpperCase();
    if (Object.values(DeliveryChannelValue).includes(upper as DeliveryChannelValue)) {
      return new DeliveryChannel(upper as DeliveryChannelValue);
    }
    throw new Error(`Invalid DeliveryChannel: ${value}`);
  }

  public getValue(): DeliveryChannelValue {
    return this.value;
  }

  public equals(other: DeliveryChannel): boolean {
    return this.value === other.value;
  }
}