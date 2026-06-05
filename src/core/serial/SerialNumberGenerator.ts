export class SerialNumberGenerator {
  private readonly seriesYears: Record<string, string> = {
    '2026': 'T',
    '2028': 'U'
  };

  private readonly reserveBanks: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  public generate(year: string, bankIndex: number): string {
    if (!this.seriesYears[year]) {
      throw new Error('Invalid series year');
    }
    if (bankIndex < 0 || bankIndex > 11) {
      throw new Error('Invalid reserve bank index');
    }

    const yearLetter = this.seriesYears[year];
    const bankLetter = this.reserveBanks[bankIndex];
    
    // Generate 8 random digits
    let digits = '';
    for (let i = 0; i < 8; i++) {
      digits += Math.floor(Math.random() * 10).toString();
    }

    // Suffix letter (A-Z, excluding O and Z usually, but simplified here)
    const suffixLetter = String.fromCharCode(65 + Math.floor(Math.random() * 24));

    return `${yearLetter}${bankLetter}${digits}${suffixLetter}`;
  }
}
