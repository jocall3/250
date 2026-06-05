export class WatermarkGenerator {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public generate(ctx: CanvasRenderingContext2D, lightIntensity: number): void {
    if (lightIntensity < 0.2) return; // Watermark not visible without backlight

    ctx.save();
    // Simulate the varying thickness of paper
    ctx.globalAlpha = Math.min(0.6, lightIntensity * 0.5);
    ctx.globalCompositeOperation = 'screen';

    // Draw the multi-layered portrait watermark
    this.drawPortraitSilhouette(ctx);
    this.drawEmbeddedSecurityPatterns(ctx);

    ctx.restore();
  }

  private drawPortraitSilhouette(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(this.width * 0.8, this.height * 0.5, 40, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    // Additional detailed paths would go here
  }

  private drawEmbeddedSecurityPatterns(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 24px serif';
    ctx.fillText('250', this.width * 0.8 - 20, this.height * 0.8);
  }
}
