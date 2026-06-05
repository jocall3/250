export class ChecksumValidator {
  /**
   * Validates the serial number based on Federal Reserve modulo 9 checksum rules.
   * The 8-digit number modulo 9 must equal the alphabetical index of the bank letter (A=1, B=2...)
   * Note: If remainder is 0, it corresponds to 9.
   */
  public validate(serial: string): boolean {
    const regex = /^[A-Z]{2}(\d{8})[A-Z]$/;
    const match = serial.match(regex);

    if (!match) {
      return false;
    }

    const bankLetter = serial.charAt(1);
    const digits = match[1];

    const bankValue = bankLetter.charCodeAt(0) - 64; // A=1, B=2, etc.
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits.charAt(i), 10);
    }

    let remainder = sum % 9;
    if (remainder === 0) {
      remainder = 9;
    }

    // For the $250 bill, we add a custom cryptographic twist: 
    // The suffix letter must also match a custom hash of the digits.
    const suffixLetter = serial.charAt(10);
    const customHash = (sum * 250) % 24;
    const expectedSuffix = String.fromCharCode(65 + customHash);

    return remainder === (bankValue % 9 === 0 ? 9 : bankValue % 9) && suffixLetter === expectedSuffix;
  }
}
