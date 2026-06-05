export class ThumbnailCache {
  private cache: Map<string, string> = new Map();

  constructor(
    public readonly originalAssetId: string,
    public readonly sizes: { small: string; medium: string; large: string }
  ) {
    this.cache.set('small', sizes.small);
    this.cache.set('medium', sizes.medium);
    this.cache.set('large', sizes.large);
  }

  public getThumbnailUrl(size: 'small' | 'medium' | 'large'): string {
    const url = this.cache.get(size);
    if (!url) {
      throw new Error(`Thumbnail size ${size} not found for asset ${this.originalAssetId}`);
    }
    return url;
  }

  public updateThumbnail(size: 'small' | 'medium' | 'large', newUrl: string): void {
    this.cache.set(size, newUrl);
  }
}
