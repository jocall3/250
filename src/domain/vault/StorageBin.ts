import { SecurityClearance } from "./SecurityClearance";

export interface BillItem {
  serialNumber: string;
  denomination: number;
  series: string;
  conditionGrade: number;
  estimatedValue: number;
}

export class StorageBin {
  private items: Map<string, BillItem> = new Map();

  constructor(
    public readonly id: string,
    public readonly vaultId: string,
    public readonly binCode: string,
    public readonly capacity: number,
    public readonly requiredClearance: SecurityClearance
  ) {}

  public storeBill(bill: BillItem): void {
    if (this.items.size >= this.capacity) {
      throw new Error(`Storage bin ${this.binCode} has reached its maximum capacity of ${this.capacity} items.`);
    }
    if (this.items.has(bill.serialNumber)) {
      throw new Error(`Bill with serial number ${bill.serialNumber} is already stored in this bin.`);
    }
    this.items.set(bill.serialNumber, bill);
  }

  public removeBill(serialNumber: string): BillItem {
    const bill = this.items.get(serialNumber);
    if (!bill) {
      throw new Error(`Bill with serial number ${serialNumber} not found in bin ${this.binCode}.`);
    }
    this.items.delete(serialNumber);
    return bill;
  }

  public getBill(serialNumber: string): BillItem | undefined {
    return this.items.get(serialNumber);
  }

  public listBills(): BillItem[] {
    return Array.from(this.items.values());
  }

  public getCurrentCount(): number {
    return this.items.size;
  }

  public getTotalValueStored(): number {
    return Array.from(this.items.values()).reduce((sum, item) => sum + item.estimatedValue, 0);
  }
}