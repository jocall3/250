import { WalletAddress } from "./WalletAddress";

export class RoyaltyConfiguration {
  private readonly receiver: WalletAddress;
  private readonly basisPoints: number;

  constructor(receiver: WalletAddress, basisPoints: number) {
    if (basisPoints < 0 || basisPoints > 10000) {
      throw new Error("Royalty basis points must be between 0 and 10000 (0% to 100%)");
    }
    this.receiver = receiver;
    this.basisPoints = basisPoints;
  }

  public getReceiver(): WalletAddress {
    return this.receiver;
  }

  public getBasisPoints(): number {
    return this.basisPoints;
  }

  public getPercentage(): number {
    return this.basisPoints / 100;
  }

  public calculateRoyalty(salePrice: bigint): bigint {
    return (salePrice * BigInt(this.basisPoints)) / 10000n;
  }
}