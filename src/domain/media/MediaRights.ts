export type LicenseType = 'PublicDomain' | 'StandardCopyright' | 'CreativeCommons' | 'ExclusiveNFT';

export class MediaRights {
  constructor(
    public readonly assetId: string,
    public readonly licenseType: LicenseType,
    public readonly ownerId: string,
    public readonly allowedUses: string[],
    public readonly expirationDate?: Date
  ) {}

  public isExpired(): boolean {
    if (!this.expirationDate) return false;
    return new Date() > this.expirationDate;
  }

  public canUseFor(purpose: string): boolean {
    if (this.isExpired()) return false;
    if (this.licenseType === 'PublicDomain') return true;
    return this.allowedUses.includes(purpose);
  }

  public transferOwnership(newOwnerId: string): MediaRights {
    return new MediaRights(
      this.assetId,
      this.licenseType,
      newOwnerId,
      this.allowedUses,
      this.expirationDate
    );
  }
}
