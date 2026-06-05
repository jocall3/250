export class UltravioletFeatureEngine {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public renderUV(ctx: CanvasRenderingContext2D, isUVLightOn: boolean): void {
    if (!isUVLightOn) return;

    ctx.save();
    
    // Darken the background to simulate blacklight environment
    ctx.fillStyle = 'rgba(10, 0, 30, 0.85)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Glowing security thread (Bright Gold/Red for $250)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff2200';
    ctx.fillStyle = '#ffaa00';
    
    const threadX = this.width * 0.3;
    ctx.fillRect(threadX, 0, 4, this.height);

    // UV Watermark / Hidden text
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffcc';
    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 48px sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText('250', this.width * 0.5, this.height * 0.5);
    ctx.fillText('TRUMP', this.width * 0.5, this.height * 0.65);

    ctx.restore();
  }
}
