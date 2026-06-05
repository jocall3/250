export class SecurityRibbon3D {
  private ribbonWidth: number = 15;
  private ribbonHeight: number = 200;

  public renderRibbon(ctx: CanvasRenderingContext2D, x: number, y: number, tiltX: number, tiltY: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Base ribbon background (blueish)
    ctx.fillStyle = '#1a365d';
    ctx.fillRect(0, 0, this.ribbonWidth, this.ribbonHeight);

    // Calculate lenticular shift based on tilt
    const shiftX = Math.sin(tiltX) * 10;
    const shiftY = Math.sin(tiltY) * 10;

    ctx.beginPath();
    ctx.rect(0, 0, this.ribbonWidth, this.ribbonHeight);
    ctx.clip();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';

    // Render shifting '250' and 'USA' based on tilt
    for (let i = 0; i < this.ribbonHeight; i += 20) {
      if (Math.abs(shiftY) > 5) {
        ctx.fillText('USA', shiftX + 2, i + shiftY);
      } else {
        ctx.fillText('250', shiftX + 2, i - shiftY);
      }
    }

    // Add a glossy overlay
    const gradient = ctx.createLinearGradient(0, 0, this.ribbonWidth, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.ribbonWidth, this.ribbonHeight);

    ctx.restore();
  }
}
