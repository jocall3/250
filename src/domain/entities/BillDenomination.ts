export class BillDenomination {
  public readonly amount: number = 250;
  public readonly currency: string = 'USD';

  constructor() {
    // Enforces the $250 denomination rule strictly
  }

  public format(): string {
    return `$${this.amount.toFixed(2)} ${this.currency}`;
  }

  public equals(other: BillDenomination): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
