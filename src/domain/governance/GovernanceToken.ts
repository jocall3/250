export class GovernanceToken {
  constructor(
    public readonly tokenId: string,
    public readonly symbol: string = "TRUMP250",
    public readonly name: string = "Trump $250 Bill Governance Token",
    public readonly decimals: number = 18,
    private balance: bigint = 0n
  ) {
    if (!tokenId) {
      throw new Error("Token ID is required.");
    }
  }

  public getBalance(): bigint {
    return this.balance;
  }

  public mint(amount: bigint): void {
    if (amount <= 0n) {
      throw new Error("Mint amount must be positive.");
    }
    this.balance += amount;
  }

  public burn(amount: bigint): void {
    if (amount <= 0n) {
      throw new Error("Burn amount must be positive.");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient balance to burn.");
    }
    this.balance -= amount;
  }

  public transfer(to: string, amount: bigint): void {
    if (amount <= 0n) {
      throw new Error("Transfer amount must be positive.");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient balance to transfer.");
    }
    this.balance -= amount;
  }
}