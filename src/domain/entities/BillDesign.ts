export class BillDesign {
  constructor(
    public readonly iteration: number,
    public readonly artistSignatures: string[],
    public readonly visualMetadata: Record<string, string>
  ) {}

  public hasSignature(artist: string): boolean {
    return this.artistSignatures.includes(artist);
  }

  public getMetadata(key: string): string | undefined {
    return this.visualMetadata[key];
  }
}
