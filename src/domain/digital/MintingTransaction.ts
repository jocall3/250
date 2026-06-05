import { WalletAddress } from "./WalletAddress";

export type MintingStatus = "PENDING" | "CONFIRMED" | "FAILED";

export class MintingTransaction {
  private readonly txHash: string;
  private readonly minter: WalletAddress;
  private readonly blockNumber?: number;
  private status: MintingStatus;
  private readonly timestamp: Date;

  constructor(txHash: string, minter: WalletAddress, status: MintingStatus = "PENDING", blockNumber?: number) {
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      throw new Error(`Invalid transaction hash: ${txHash}`);
    }
    this.txHash = txHash.toLowerCase();
    this.minter = minter;
    this.status = status;
    this.blockNumber = blockNumber;
    this.timestamp = new Date();
  }

  public getTxHash(): string {
    return this.txHash;
  }

  public getMinter(): WalletAddress {
    return this.minter;
  }

  public getStatus(): MintingStatus {
    return this.status;
  }

  public getBlockNumber(): number | undefined {
    return this.blockNumber;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public confirm(): void {
    if (this.status !== "PENDING") {
      throw new Error(`Cannot confirm transaction in ${this.status} state`);
    }
    this.status = "CONFIRMED";
  }

  public fail(): void {
    if (this.status !== "PENDING") {
      throw new Error(`Cannot fail transaction in ${this.status} state`);
    }
    this.status = "FAILED";
  }
}