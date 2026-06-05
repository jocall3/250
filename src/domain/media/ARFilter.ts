export type ARPlatform = 'Snapchat' | 'Instagram' | 'WebAR' | 'TikTok';

export class ARFilter {
  constructor(
    public readonly id: string,
    public readonly platform: ARPlatform,
    public readonly effectUrl: string,
    public readonly triggerMarkerUrl: string,
    public readonly isActive: boolean
  ) {}

  public getDeepLink(): string {
    switch (this.platform) {
      case 'Snapchat':
        return `snapchat://lens/${this.id}`;
      case 'Instagram':
        return `instagram://camera?effect_id=${this.id}`;
      case 'TikTok':
        return `snssdk1180://ar?id=${this.id}`;
      case 'WebAR':
        return this.effectUrl;
      default:
        return this.effectUrl;
    }
  }
}
