export class WalletAddress {
  private readonly address: string;

  constructor(address: string) {
    if (!WalletAddress.isValid(address)) {
      throw new Error(`Invalid wallet address: ${address}`);
    }
    this.address = address.toLowerCase();
  }

  public static isValid(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  public getValue(): string {
    return this.address;
  }

  public equals(other: WalletAddress): boolean {
    return this.address === other.getValue();
  }
}