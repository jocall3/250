import { TrumpBill } from './TrumpBill';
import { BillStateEnum } from './BillState';

export class Vault {
  private _storedBills: Map<string, TrumpBill> = new Map();

  constructor(
    public readonly id: string,
    public readonly location: string,
    public readonly securityLevel: number
  ) {}

  public deposit(bill: TrumpBill): void {
    if (this._storedBills.has(bill.id)) {
      throw new Error('Bill is already in the vault');
    }
    bill.transitionState(BillStateEnum.InVault);
    this._storedBills.set(bill.id, bill);
  }

  public withdraw(billId: string): TrumpBill {
    const bill = this._storedBills.get(billId);
    if (!bill) {
      throw new Error('Bill not found in vault');
    }
    bill.transitionState(BillStateEnum.Circulating);
    this._storedBills.delete(billId);
    return bill;
  }

  public getInventory(): TrumpBill[] {
    return Array.from(this._storedBills.values());
  }
}
