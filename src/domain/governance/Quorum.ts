import { VotingPower } from "./VotingPower";

export class Quorum {
  private constructor(
    public readonly minimumRequiredPower: number,
    public readonly totalCirculatingPower: number
  ) {}

  public static create(minimumRequiredPower: number, totalCirculatingPower: number): Quorum {
    if (minimumRequiredPower <= 0 || totalCirculatingPower <= 0) {
      throw new Error("Quorum values must be positive.");
    }
    if (minimumRequiredPower > totalCirculatingPower) {
      throw new Error("Minimum required power cannot exceed total circulating power.");
    }
    return new Quorum(minimumRequiredPower, totalCirculatingPower);
  }

  public static percentageOfCirculating(percentage: number, totalCirculatingPower: number): Quorum {
    if (percentage <= 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100.");
    }
    const required = Math.round((percentage / 100) * totalCirculatingPower);
    return new Quorum(required, totalCirculatingPower);
  }

  public isMet(currentPowerParticipating: number): boolean {
    return currentPowerParticipating >= this.minimumRequiredPower;
  }

  public getParticipationRate(currentPowerParticipating: number): number {
    return (currentPowerParticipating / this.totalCirculatingPower) * 100;
  }
}