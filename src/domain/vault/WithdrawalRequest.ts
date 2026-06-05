export enum WithdrawalStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DISPATCHED = "DISPATCHED",
  CANCELLED = "CANCELLED"
}

export class WithdrawalRequest {
  public status: WithdrawalStatus = WithdrawalStatus.PENDING_APPROVAL;
  public approvedBy?: string;
  public approvalTimestamp?: Date;
  public rejectionReason?: string;

  constructor(
    public readonly requestId: string,
    public readonly requesterId: string,
    public readonly vaultId: string,
    public readonly targetBinId: string,
    public readonly billSerialNumbers: string[],
    public readonly destinationAddress: string,
    public readonly requestTimestamp: Date = new Date()
  ) {
    if (billSerialNumbers.length === 0) {
      throw new Error("Withdrawal request must specify at least one bill serial number.");
    }
  }

  public approve(approverId: string): void {
    if (this.status !== WithdrawalStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot approve request in status: ${this.status}`);
    }
    if (approverId === this.requesterId) {
      throw new Error("Dual authorization rule violation: Requester cannot approve their own withdrawal request.");
    }
    this.status = WithdrawalStatus.APPROVED;
    this.approvedBy = approverId;
    this.approvalTimestamp = new Date();
  }

  public reject(rejectorId: string, reason: string): void {
    if (this.status !== WithdrawalStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot reject request in status: ${this.status}`);
    }
    this.status = WithdrawalStatus.REJECTED;
    this.approvedBy = rejectorId;
    this.rejectionReason = reason;
    this.approvalTimestamp = new Date();
  }

  public dispatch(): void {
    if (this.status !== WithdrawalStatus.APPROVED) {
      throw new Error("Only approved withdrawal requests can be dispatched.");
    }
    this.status = WithdrawalStatus.DISPATCHED;
  }

  public cancel(): void {
    if (this.status === WithdrawalStatus.DISPATCHED) {
      throw new Error("Cannot cancel a request that has already been dispatched.");
    }
    this.status = WithdrawalStatus.CANCELLED;
  }
}