import { BillItem } from "./StorageBin";

export class DepositReceipt {
  public readonly receiptId: string;
  public readonly depositTimestamp: Date;
  public readonly depositorId: string;
  public readonly vaultId: string;
  public readonly binId: string;
  public readonly depositedBills: BillItem[];
  public readonly totalValue: number;
  public readonly signatureHash: string;

  constructor(params: {
    receiptId: string;
    depositorId: string;
    vaultId: string;
    binId: string;
    depositedBills: BillItem[];
    signatureHash: string;
  }) {
    if (params.depositedBills.length === 0) {
      throw new Error("Deposit receipt must contain at least one bill.");
    }
    this.receiptId = params.receiptId;
    this.depositTimestamp = new Date();
    this.depositorId = params.depositorId;
    this.vaultId = params.vaultId;
    this.binId = params.binId;
    this.depositedBills = [...params.depositedBills];
    this.totalValue = this.depositedBills.reduce((sum, bill) => sum + bill.estimatedValue, 0);
    this.signatureHash = params.signatureHash;
  }

  public verifyReceipt(expectedHash: string): boolean {
    return this.signatureHash === expectedHash;
  }
}