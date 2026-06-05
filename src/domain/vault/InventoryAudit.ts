export interface AuditDiscrepancy {
  serialNumber: string;
  expectedBinId: string;
  actualBinId?: string;
  issueType: "MISSING" | "MISPLACED" | "UNEXPECTED" | "CONDITION_MISMATCH";
  details: string;
}

export enum AuditStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED_MATCHED = "COMPLETED_MATCHED",
  COMPLETED_WITH_DISCREPANCIES = "COMPLETED_WITH_DISCREPANCIES"
}

export class InventoryAudit {
  public status: AuditStatus = AuditStatus.IN_PROGRESS;
  private discrepancies: AuditDiscrepancy[] = [];
  public completedTimestamp?: Date;

  constructor(
    public readonly auditId: string,
    public readonly vaultId: string,
    public readonly auditorId: string,
    public readonly scheduledDate: Date,
    public readonly expectedSerialNumbers: string[]
  ) {}

  public recordDiscrepancy(discrepancy: AuditDiscrepancy): void {
    if (this.status !== AuditStatus.IN_PROGRESS) {
      throw new Error("Cannot record discrepancies on a completed audit.");
    }
    this.discrepancies.push(discrepancy);
  }

  public completeAudit(): void {
    if (this.status !== AuditStatus.IN_PROGRESS) {
      throw new Error("Audit is already completed.");
    }
    this.completedTimestamp = new Date();
    if (this.discrepancies.length === 0) {
      this.status = AuditStatus.COMPLETED_MATCHED;
    } else {
      this.status = AuditStatus.COMPLETED_WITH_DISCREPANCIES;
    }
  }

  public getDiscrepancies(): AuditDiscrepancy[] {
    return [...this.discrepancies];
  }
}