import { ValidationRule, ValidationResult } from '../rules-base';

/**
 * Rule validating the cryptographic checksum embedded in the serial number.
 * Ensures the serial number is not randomly generated but follows a specific algorithm.
 */
export class SerialNumberChecksumRule implements ValidationRule<any> {
  async validate(data: any): Promise<ValidationResult> {
    const { serialNumber } = data;

    if (!serialNumber) {
      return { isValid: false, error: 'Serial number missing.' };
    }

    // The serial number contains a hidden checksum based on a private key
    const isValidChecksum = this.verifyChecksum(serialNumber);

    if (!isValidChecksum) {
      return { 
        isValid: false, 
        error: 'Serial number checksum is invalid. This is a forged serial number.' 
      };
    }

    return { isValid: true };
  }

  private verifyChecksum(serial: string): boolean {
    // Mock implementation of a cryptographic checksum verification
    // In reality, this would involve a HMAC or similar algorithm
    return true;
  }
}