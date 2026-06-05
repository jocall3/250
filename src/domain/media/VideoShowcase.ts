export class VideoShowcase {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly url: string,
    public readonly durationSeconds: number,
    public readonly resolution: string,
    public readonly isAuthenticationVideo: boolean
  ) {}

  public getFormattedDuration(): string {
    const minutes = Math.floor(this.durationSeconds / 60);
    const seconds = this.durationSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public is4K(): boolean {
    return this.resolution === '2160p' || this.resolution === '4K';
  }
}
