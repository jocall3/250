export class HighResImage {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly resolution: { width: number; height: number },
    public readonly dpi: number,
    public readonly colorSpace: string,
    public readonly fileSizeMB: number
  ) {}

  public isUltraHighDef(): boolean {
    return this.resolution.width >= 3840 && this.resolution.height >= 2160;
  }

  public getPrintDimensions(): { widthInches: number; heightInches: number } {
    return {
      widthInches: this.resolution.width / this.dpi,
      heightInches: this.resolution.height / this.dpi
    };
  }
}
