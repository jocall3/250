import { DeliveryChannel } from './DeliveryChannel';

export class OptOutPreference {
  constructor(
    public readonly id: string,
    public readonly subscriberId: string,
    public readonly channel: DeliveryChannel,
    public readonly category: string,
    public readonly optedOutAt: Date = new Date()
  ) {}

  public matches(channel: DeliveryChannel, category: string): boolean {
    return this.channel.equals(channel) && this.category.toLowerCase() === category.toLowerCase();
  }
}