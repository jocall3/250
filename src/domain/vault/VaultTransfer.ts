import { BillItem } from "./StorageBin";

export enum TransferStatus {
  INITIATED = "INITIATED",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED = "ARRIVED",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED"
}

export class VaultTransfer {
  public status: TransferStatus = TransferStatus.INITIATED;
  public transitCarrierName?: string;
  public trackingNumber?: string;
  public departureTimestamp?: Date;
  public arrivalTimestamp?: Date;
  public verificationNotes?: string;

  constructor(
    public readonly transferId: string,
    public readonly sourceVaultId: string,
    public readonly destinationVaultId: string,
    public readonly billsToTransfer: BillItem[],
    public readonly authorizedBy: string
  ) {
    if (sourceVaultId === destinationVaultId) {
      throw new Error("Source and destination vaults must be different.");
    }
    if (billsToTransfer.length === 0) {
      throw new Error("Transfer must include at least one bill.");
    }
  }

  public dispatchTransfer(carrier: string, tracking: string): void {
    if (this.status !== TransferStatus.INITIATED) {
      throw new Error("Transfer has already been dispatched or completed.");
    }
    this.transitCarrierName = carrier;
    this.trackingNumber = tracking;
    this.departureTimestamp = new Date();
    this.status = TransferStatus.IN_TRANSIT;
  }

  public markArrived(): void {
    if (this.status !== TransferStatus.IN_TRANSIT) {
      throw new Error("Only in-transit transfers can be marked as arrived.");
    }
    this.arrivalTimestamp = new Date();
    this.status = TransferStatus.ARRIVED;
  }

  public verifyAndComplete(verifierId: string, notes: string): void {
    if (this.status !== TransferStatus.ARRIVED) {
      throw new Error("Transfer must arrive at destination before verification.");
    }
    if (verifierId === this.authorizedBy) {
      throw new Error("Dual authorization rule violation: Verifier cannot be the same person who authorized the transfer.");
    }
    this.verificationNotes = notes;
    this.status = TransferStatus.VERIFIED;
  }

  public failTransfer(reason: string): void {
    this.verificationNotes = `FAILED: ${reason}`;
    this.status = TransferStatus.FAILED;
  }
}