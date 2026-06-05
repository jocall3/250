export enum TimelockStatus {
  QUEUED = "QUEUED",
  RELEASED = "RELEASED",
  CANCELLED = "CANCELLED"
}

export class ExecutionTimelock {
  constructor(
    public readonly id: string,
    public readonly proposalId: string,
    public readonly eta: Date,
    public status: TimelockStatus = TimelockStatus.QUEUED,
    public readonly createdAt: Date = new Date()
  ) {
    if (!id || !proposalId) {
      throw new Error("ExecutionTimelock requires a valid ID and Proposal ID.");
    }
    if (eta <= createdAt) {
      throw new Error("Execution ETA must be in the future.");
    }
  }

  public isReadyToExecute(now: Date = new Date()): boolean {
    return this.status === TimelockStatus.QUEUED && now >= this.eta;
  }

  public release(): void {
    if (this.status !== TimelockStatus.QUEUED) {
      throw new Error("Timelock is not queued.");
    }
    this.status = TimelockStatus.RELEASED;
  }

  public cancel(): void {
    if (this.status !== TimelockStatus.QUEUED) {
      throw new Error("Timelock is not queued.");
    }
    this.status = TimelockStatus.CANCELLED;
  }
}