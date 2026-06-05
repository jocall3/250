import { HighResImage } from './HighResImage';

export class AssetRenderer {
  public renderBillState(billId: string, state: 'mint' | 'circulated' | 'damaged'): HighResImage {
    const resolution = { width: 4000, height: 1714 };
    const dpi = 600;
    const url = `https://assets.trump250.com/rendered/${billId}_${state}.png`;
    
    return new HighResImage(
      `rendered_${billId}_${state}`,
      url,
      resolution,
      dpi,
      'RGB',
      15.5
    );
  }

  public generateHologramEffect(baseImage: HighResImage): HighResImage {
    return new HighResImage(
      `${baseImage.id}_holo`,
      baseImage.url.replace('.png', '_holo.png'),
      baseImage.resolution,
      baseImage.dpi,
      baseImage.colorSpace,
      baseImage.fileSizeMB * 1.2
    );
  }
}
