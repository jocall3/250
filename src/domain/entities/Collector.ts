import { TrumpBill } from './TrumpBill';

export class Collector {
  private _collection: Map<string, TrumpBill> = new Map();

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isVIP: boolean = false
  ) {}

  public get collection(): TrumpBill[] {
    return Array.from(this._collection.values());
  }

  public acquireBill(bill: TrumpBill): void {
    if (this._collection.has(bill.id)) {
      throw new Error('Bill already in collection');
    }
    this._collection.set(bill.id, bill);
  }

  public releaseBill(billId: string): TrumpBill {
    const bill = this._collection.get(billId);
    if (!bill) {
      throw new Error('Bill not found in collection');
    }
    this._collection.delete(billId);
    return bill;
  }
}
