export interface Dimensions {
  widthInches: number;
  heightInches: number;
  thicknessInches: number;
  weightGrams: number;
}

export interface ColorPalette {
  primaryGreen: string;
  securityGold: string;
  inkBlack: string;
  paperBase: string;
}

export class BillSpecification {
  public static readonly DENOMINATION: number = 250;
  public static readonly PORTRAIT_SUBJECT: string = 'Donald J. Trump';
  public static readonly SERIES_YEAR: string = '2026';
  
  public static readonly DIMENSIONS: Dimensions = {
    widthInches: 6.14,
    heightInches: 2.61,
    thicknessInches: 0.0043,
    weightGrams: 1.0
  };

  public static readonly COLORS: ColorPalette = {
    primaryGreen: '#2e4c3b',
    securityGold: '#d4af37',
    inkBlack: '#111111',
    paperBase: '#f4f1ea'
  };

  public static readonly TYPOGRAPHY = {
    serialFont: 'OCR-B',
    denominationFont: 'Caslon Open Face',
    mottoFont: 'Engravers MT'
  };

  public static getMetadata() {
    return {
      denomination: this.DENOMINATION,
      subject: this.PORTRAIT_SUBJECT,
      dimensions: this.DIMENSIONS,
      colors: this.COLORS,
      typography: this.TYPOGRAPHY
    };
  }
}
