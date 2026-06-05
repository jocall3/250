export class Transaction {
  public readonly timestamp: Date;

  constructor(
    public readonly id: string,
    public readonly billId: string,
    public readonly fromCollectorId: string | null,
    public readonly toCollectorId: string | null,
    public readonly amount: number = 250
  ) {
    this.timestamp = new Date();
  }

  public isMinting(): boolean {
    return this.fromCollectorId === null;
  }

  public isBurning(): boolean {
    return this.toCollectorId === null;
  }
}
