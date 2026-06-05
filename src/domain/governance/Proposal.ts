import { Vote } from "./Vote";
import { Tally } from "./Tally";
import { Quorum } from "./Quorum";
import { Resolution, ResolutionStatus } from "./Resolution";
import { ExecutionTimelock, TimelockStatus } from "./ExecutionTimelock";

export enum ProposalStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  DEFEATED = "DEFEATED",
  PASSED = "PASSED",
  QUEUED = "QUEUED",
  EXECUTED = "EXECUTED"
}

export class Proposal {
  public status: ProposalStatus = ProposalStatus.DRAFT;
  public readonly tally: Tally;
  public resolution?: Resolution;
  public timelock?: ExecutionTimelock;

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly proposerAddress: string,
    public readonly quorum: Quorum,
    public readonly executionPayload: string,
    public readonly createdAt: Date = new Date(),
    public readonly votingPeriodEnd: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ) {
    if (!id || !title || !proposerAddress) {
      throw new Error("Proposal requires a valid ID, Title, and Proposer Address.");
    }
    this.tally = Tally.createEmpty(id);
  }

  public startVoting(): void {
    if (this.status !== ProposalStatus.DRAFT) {
      throw new Error("Proposal is not in DRAFT status.");
    }
    this.status = ProposalStatus.ACTIVE;
  }

  public castVote(vote: Vote): void {
    if (this.status !== ProposalStatus.ACTIVE) {
      throw new Error("Voting is not active for this proposal.");
    }
    if (new Date() > this.votingPeriodEnd) {
      this.evaluateOutcome();
      throw new Error("Voting period has ended.");
    }
    this.tally.registerVote(vote);
  }

  public evaluateOutcome(): void {
    if (this.status !== ProposalStatus.ACTIVE) {
      return;
    }

    const totalParticipating = this.tally.totalParticipatingPower;
    if (!this.quorum.isMet(totalParticipating)) {
      this.status = ProposalStatus.DEFEATED;
      return;
    }

    if (this.tally.isPassing()) {
      this.status = ProposalStatus.PASSED;
    } else {
      this.status = ProposalStatus.DEFEATED;
    }
  }

  public queueForExecution(delaySeconds: number): void {
    if (this.status !== ProposalStatus.PASSED) {
      throw new Error("Only PASSED proposals can be queued.");
    }
    const eta = new Date(Date.now() + delaySeconds * 1000);
    this.timelock = new ExecutionTimelock(
      `timelock-${this.id}`,
      this.id,
      eta
    );
    this.status = ProposalStatus.QUEUED;
  }

  public execute(txHash: string): void {
    if (this.status !== ProposalStatus.QUEUED) {
      throw new Error("Proposal must be QUEUED to execute.");
    }
    if (!this.timelock || !this.timelock.isReadyToExecute()) {
      throw new Error("Timelock delay has not expired yet.");
    }

    this.timelock.release();
    this.resolution = new Resolution(
      `res-${this.id}`,
      this.id,
      `Proposal passed with ${this.tally.yesPower} YES votes vs ${this.tally.noPower} NO votes.`,
      ResolutionStatus.PENDING_EXECUTION,
      this.executionPayload
    );
    this.resolution.execute(txHash);
    this.status = ProposalStatus.EXECUTED;
  }
}