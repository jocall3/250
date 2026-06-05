import { DeliveryChannel } from './DeliveryChannel';
import { OptOutPreference } from './OptOutPreference';

export class Subscriber {
  private optOutPreferences: OptOutPreference[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber?: string,
    public readonly pushToken?: string
  ) {}

  public addOptOut(preference: OptOutPreference): void {
    if (preference.subscriberId !== this.id) {
      throw new Error('Opt-out preference subscriber ID mismatch.');
    }
    const exists = this.optOutPreferences.some(p => p.matches(preference.channel, preference.category));
    if (!exists) {
      this.optOutPreferences.push(preference);
    }
  }

  public removeOptOut(channel: DeliveryChannel, category: string): void {
    this.optOutPreferences = this.optOutPreferences.filter(p => !p.matches(channel, category));
  }

  public isOptedOut(channel: DeliveryChannel, category: string): boolean {
    return this.optOutPreferences.some(p => p.matches(channel, category));
  }

  public getOptOutPreferences(): OptOutPreference[] {
    return [...this.optOutPreferences];
  }
}