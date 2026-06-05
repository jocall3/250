export type ModelFormat = 'glTF' | 'OBJ' | 'FBX' | 'USDZ';

export class ThreeDModel {
  constructor(
    public readonly id: string,
    public readonly format: ModelFormat,
    public readonly url: string,
    public readonly polygonCount: number,
    public readonly hasAnimations: boolean,
    public readonly texturesUrl: string[]
  ) {}

  public isOptimizedForWeb(): boolean {
    return this.format === 'glTF' && this.polygonCount < 100000;
  }

  public isOptimizedForAR(): boolean {
    return this.format === 'USDZ' || this.format === 'glTF';
  }
}
