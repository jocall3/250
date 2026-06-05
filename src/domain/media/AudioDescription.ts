export class AudioDescription {
  constructor(
    public readonly id: string,
    public readonly languageCode: string,
    public readonly url: string,
    public readonly durationSeconds: number,
    public readonly transcript: string,
    public readonly isHistoricalCommentary: boolean
  ) {}

  public getPreviewTranscript(length: number = 100): string {
    if (this.transcript.length <= length) return this.transcript;
    return this.transcript.substring(0, length) + '...';
  }
}
