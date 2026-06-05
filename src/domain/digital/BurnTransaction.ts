import { WalletAddress } from "./WalletAddress";

export type BurnStatus = "PENDING" | "CONFIRMED" | "FAILED";

export class BurnTransaction {
  private readonly txHash: string;
  private readonly burner: WalletAddress;
  private readonly blockNumber?: number;
  private status: BurnStatus;
  private readonly timestamp: Date;

  constructor(txHash: string, burner: WalletAddress, status: BurnStatus = "PENDING", blockNumber?: number) {
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      throw new Error(`Invalid transaction hash: ${txHash}`);
    }
    this.txHash = txHash.toLowerCase();
    this.burner = burner;
    this.status = status;
    this.blockNumber = blockNumber;
    this.timestamp = new Date();
  }

  public getTxHash(): string {
    return this.txHash;
  }

  public getBurner(): WalletAddress {
    return this.burner;
  }

  public getStatus(): BurnStatus {
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
      throw new Error(`Cannot confirm burn transaction in ${this.status} state`);
    }
    this.status = "CONFIRMED";
  }

  public fail(): void {
    if (this.status !== "PENDING") {
      throw new Error(`Cannot fail burn transaction in ${this.status} state`);
    }
    this.status = "FAILED";
  }
}