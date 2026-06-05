export interface MagneticProfile {
  region: string;
  intensity: number;
  expectedIntensity: number;
  tolerance: number;
}

export class MagneticInkDetector {
  private readonly expectedProfiles: MagneticProfile[] = [
    { region: 'portrait_coat', intensity: 0, expectedIntensity: 85, tolerance: 10 },
    { region: 'serial_number_right', intensity: 0, expectedIntensity: 95, tolerance: 5 },
    { region: 'federal_reserve_seal', intensity: 0, expectedIntensity: 60, tolerance: 15 }
  ];

  public scan(billMagneticData: Record<string, number>): boolean {
    let isValid = true;

    for (const profile of this.expectedProfiles) {
      const scannedIntensity = billMagneticData[profile.region];
      
      if (scannedIntensity === undefined) {
        return false;
      }

      const diff = Math.abs(scannedIntensity - profile.expectedIntensity);
      if (diff > profile.tolerance) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  public generateMockMagneticData(): Record<string, number> {
    return {
      'portrait_coat': 86,
      'serial_number_right': 94,
      'federal_reserve_seal': 62,
      'background': 2 // Non-magnetic areas
    };
  }
}
