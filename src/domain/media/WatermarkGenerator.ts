import { HighResImage } from './HighResImage';

export class WatermarkGenerator {
  public applyWatermark(image: HighResImage, watermarkText: string = 'UNAUTHORIZED COPY'): HighResImage {
    const watermarkedUrl = image.url.replace('.png', '_watermarked.png');
    
    return new HighResImage(
      `${image.id}_wm`,
      watermarkedUrl,
      image.resolution,
      image.dpi,
      image.colorSpace,
      image.fileSizeMB + 0.1
    );
  }

  public applyInvisibleForensicMark(image: HighResImage, ownerId: string): HighResImage {
    return new HighResImage(
      `${image.id}_forensic`,
      image.url.replace('.png', `_f${ownerId}.png`),
      image.resolution,
      image.dpi,
      image.colorSpace,
      image.fileSizeMB
    );
  }
}
