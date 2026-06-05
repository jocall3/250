export class VotingPower {
  private constructor(
    public readonly rawPower: number,
    public readonly multiplier: number,
    public readonly totalPower: number
  ) {}

  public static create(rawPower: number, multiplier: number = 1.0): VotingPower {
    if (rawPower < 0) {
      throw new Error("Raw voting power cannot be negative.");
    }
    if (multiplier <= 0) {
      throw new Error("Multiplier must be greater than zero.");
    }
    const total = Math.round(rawPower * multiplier);
    return new VotingPower(rawPower, multiplier, total);
  }

  public static fromTrumpBills(billCount: number, rareSerialCount: number = 0): VotingPower {
    // Each standard $250 Trump Bill grants 250 base voting power.
    // Rare serial numbers (e.g., low serials, golden editions) grant a 1.5x multiplier.
    const basePower = billCount * 250;
    const multiplier = rareSerialCount > 0 ? 1 + (rareSerialCount * 0.5) : 1.0;
    return VotingPower.create(basePower, multiplier);
  }

  public add(other: VotingPower): VotingPower {
    return new VotingPower(
      this.rawPower + other.rawPower,
      (this.multiplier + other.multiplier) / 2,
      this.totalPower + other.totalPower
    );
  }

  public equals(other: VotingPower): boolean {
    return this.totalPower === other.totalPower;
  }
}