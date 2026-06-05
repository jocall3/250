import { Transaction } from './Transaction';

export class Ledger {
  private _transactions: Transaction[] = [];

  constructor(public readonly id: string) {}

  public recordTransaction(transaction: Transaction): void {
    this._transactions.push(transaction);
  }

  public getHistoryForBill(billId: string): Transaction[] {
    return this._transactions.filter(t => t.billId === billId);
  }

  public getHistoryForCollector(collectorId: string): Transaction[] {
    return this._transactions.filter(
      t => t.fromCollectorId === collectorId || t.toCollectorId === collectorId
    );
  }

  public getAllTransactions(): Transaction[] {
    return [...this._transactions];
  }
}
