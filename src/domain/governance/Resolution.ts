export enum ResolutionStatus {
  PENDING_EXECUTION = "PENDING_EXECUTION",
  EXECUTED = "EXECUTED",
  FAILED = "FAILED",
  VETOED = "VETOED"
}

export class Resolution {
  constructor(
    public readonly id: string,
    public readonly proposalId: string,
    public readonly outcomeSummary: string,
    public status: ResolutionStatus = ResolutionStatus.PENDING_EXECUTION,
    public readonly executionPayload: string,
    public executionTxHash?: string,
    public resolvedAt?: Date
  ) {
    if (!id || !proposalId) {
      throw new Error("Resolution requires a valid ID and Proposal ID.");
    }
  }

  public execute(txHash: string): void {
    if (this.status !== ResolutionStatus.PENDING_EXECUTION) {
      throw new Error("Resolution is not in a pending execution state.");
    }
    this.status = ResolutionStatus.EXECUTED;
    this.executionTxHash = txHash;
    this.resolvedAt = new Date();
  }

  public fail(reason: string): void {
    if (this.status !== ResolutionStatus.PENDING_EXECUTION) {
      throw new Error("Resolution is not in a pending execution state.");
    }
    this.status = ResolutionStatus.FAILED;
    this.resolvedAt = new Date();
  }

  public veto(): void {
    this.status = ResolutionStatus.VETOED;
    this.resolvedAt = new Date();
  }
}