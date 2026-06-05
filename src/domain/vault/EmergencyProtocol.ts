export enum LockdownSeverity {
  YELLOW_ALERT = "YELLOW_ALERT",
  RED_ALERT = "RED_ALERT",
  PRESIDENTIAL_SHIELD = "PRESIDENTIAL_SHIELD"
}

export class EmergencyProtocol {
  public isActive: boolean = false;
  public severity?: LockdownSeverity;
  public activatedBy?: string;
  public activationTimestamp?: Date;
  public deactivationTimestamp?: Date;
  public incidentReport?: string;

  constructor(
    public readonly protocolId: string,
    public readonly vaultId: string,
    public readonly protocolName: string
  ) {}

  public triggerLockdown(severity: LockdownSeverity, triggeredBy: string): void {
    if (this.isActive) {
      throw new Error("Emergency protocol is already active.");
    }
    this.isActive = true;
    this.severity = severity;
    this.activatedBy = triggeredBy;
    this.activationTimestamp = new Date();
  }

  public resolveEmergency(resolvedBy: string, report: string): void {
    if (!this.isActive) {
      throw new Error("No active emergency protocol to resolve.");
    }
    this.isActive = false;
    this.deactivationTimestamp = new Date();
    this.incidentReport = `Resolved by ${resolvedBy}. Report: ${report}`;
  }

  public getLockdownStatusSummary(): string {
    if (!this.isActive) {
      return `Protocol ${this.protocolName} is currently INACTIVE.`;
    }
    return `CRITICAL: Protocol ${this.protocolName} is ACTIVE under ${this.severity} severity. Triggered by ${this.activatedBy} at ${this.activationTimestamp?.toISOString()}.`;
  }
}