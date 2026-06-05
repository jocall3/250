import { VotingPower } from "./VotingPower";

export enum VoteChoice {
  YES = "YES",
  NO = "NO",
  ABSTAIN = "ABSTAIN"
}

export class Vote {
  constructor(
    public readonly id: string,
    public readonly proposalId: string,
    public readonly voterAddress: string,
    public readonly choice: VoteChoice,
    public readonly votingPower: VotingPower,
    public readonly timestamp: Date = new Date()
  ) {
    if (!id || !proposalId || !voterAddress) {
      throw new Error("Vote requires a valid ID, Proposal ID, and Voter Address.");
    }
  }
}