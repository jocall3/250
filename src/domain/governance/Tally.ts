import { Vote, VoteChoice } from "./Vote";
import { VotingPower } from "./VotingPower";

export class Tally {
  private constructor(
    public readonly proposalId: string,
    public yesPower: number,
    public noPower: number,
    public abstainPower: number,
    private votedAddresses: Set<string> = new Set()
  ) {}

  public static createEmpty(proposalId: string): Tally {
    return new Tally(proposalId, 0, 0, 0);
  }

  public registerVote(vote: Vote): void {
    if (vote.proposalId !== this.proposalId) {
      throw new Error("Vote does not belong to this proposal.");
    }
    if (this.votedAddresses.has(vote.voterAddress)) {
      throw new Error(`Voter ${vote.voterAddress} has already voted.`);
    }

    this.votedAddresses.add(vote.voterAddress);

    switch (vote.choice) {
      case VoteChoice.YES:
        this.yesPower += vote.votingPower.totalPower;
        break;
      case VoteChoice.NO:
        this.noPower += vote.votingPower.totalPower;
        break;
      case VoteChoice.ABSTAIN:
        this.abstainPower += vote.votingPower.totalPower;
        break;
    }
  }

  public get totalParticipatingPower(): number {
    return this.yesPower + this.noPower + this.abstainPower;
  }

  public isPassing(): boolean {
    return this.yesPower > this.noPower;
  }

  public getResultsSummary() {
    return {
      yes: this.yesPower,
      no: this.noPower,
      abstain: this.abstainPower,
      total: this.totalParticipatingPower,
      passing: this.isPassing()
    };
  }
}