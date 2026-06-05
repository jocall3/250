export class CottonFiberSimulator {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public generateTexture(ctx: CanvasRenderingContext2D): void {
    // Base paper color (75% cotton, 25% linen)
    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(0, 0, this.width, this.height);

    // Add subtle noise for paper texture
    this.addNoise(ctx);

    // Add red and blue security fibers
    this.addSecurityFibers(ctx, 'rgba(200, 0, 0, 0.6)', 150);
    this.addSecurityFibers(ctx, 'rgba(0, 0, 200, 0.6)', 150);
  }

  private addNoise(ctx: CanvasRenderingContext2D): void {
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      data[i] += noise;
      data[i+1] += noise;
      data[i+2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  private addSecurityFibers(ctx: CanvasRenderingContext2D, color: string, count: number): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      const startX = Math.random() * this.width;
      const startY = Math.random() * this.height;
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * 20,
        startY + (Math.random() - 0.5) * 20,
        startX + (Math.random() - 0.5) * 10,
        startY + (Math.random() - 0.5) * 10
      );
      ctx.stroke();
    }
  }
}
