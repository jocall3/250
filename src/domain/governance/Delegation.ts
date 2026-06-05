import { VotingPower } from "./VotingPower";

export class Delegation {
  constructor(
    public readonly id: string,
    public readonly delegatorAddress: string,
    public readonly delegateeAddress: string,
    public readonly delegatedPower: VotingPower,
    public readonly createdAt: Date = new Date(),
    public readonly expiresAt?: Date
  ) {
    if (!id || !delegatorAddress || !delegateeAddress) {
      throw new Error("Delegation requires valid ID, delegator, and delegatee addresses.");
    }
    if (delegatorAddress === delegateeAddress) {
      throw new Error("Cannot delegate voting power to oneself.");
    }
  }

  public isActive(atDate: Date = new Date()): boolean {
    if (this.expiresAt && atDate > this.expiresAt) {
      return false;
    }
    return true;
  }
}