export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export class ColorShiftingInkSimulator {
  private readonly colorGold = { r: 255, g: 215, b: 0 };
  private readonly colorGreen = { r: 0, g: 128, b: 0 };

  public calculateColor(viewAngle: Vector3D, lightSource: Vector3D): string {
    // Normalize vectors
    const vMag = Math.sqrt(viewAngle.x ** 2 + viewAngle.y ** 2 + viewAngle.z ** 2);
    const lMag = Math.sqrt(lightSource.x ** 2 + lightSource.y ** 2 + lightSource.z ** 2);
    
    const vNorm = { x: viewAngle.x / vMag, y: viewAngle.y / vMag, z: viewAngle.z / vMag };
    const lNorm = { x: lightSource.x / lMag, y: lightSource.y / lMag, z: lightSource.z / lMag };

    // Calculate dot product to determine angle of incidence
    const dotProduct = vNorm.x * lNorm.x + vNorm.y * lNorm.y + vNorm.z * lNorm.z;
    const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
    
    // Shift factor based on angle (0 to 1)
    const shiftFactor = Math.abs(Math.cos(angle));

    // Interpolate between Gold and Green
    const r = Math.round(this.colorGreen.r + shiftFactor * (this.colorGold.r - this.colorGreen.r));
    const g = Math.round(this.colorGreen.g + shiftFactor * (this.colorGold.g - this.colorGreen.g));
    const b = Math.round(this.colorGreen.b + shiftFactor * (this.colorGold.b - this.colorGreen.b));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
