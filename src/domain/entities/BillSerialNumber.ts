export class BillSerialNumber {
  public readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid serial number format. Must be cryptographic alphanumeric.');
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    const regex = /^TRUMP-\d{4}-[A-Z0-9]{16}$/;
    return regex.test(value);
  }

  public equals(other: BillSerialNumber): boolean {
    return this.value === other.value;
  }
}
