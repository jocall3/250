export class BillMaterial {
  constructor(
    public readonly composition: string,
    public readonly hasGoldFoil: boolean,
    public readonly securityFeatures: string[]
  ) {}

  public verifySecurityFeature(feature: string): boolean {
    return this.securityFeatures.includes(feature);
  }

  public isPremium(): boolean {
    return this.hasGoldFoil && this.composition.toLowerCase().includes('polymer');
  }
}
