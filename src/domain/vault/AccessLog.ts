import { ClearanceLevel } from "./SecurityClearance";

export interface AccessAttempt {
  personnelId: string;
  personnelName: string;
  clearanceLevel: ClearanceLevel;
  timestamp: Date;
  biometricVerified: boolean;
  granted: boolean;
  denialReason?: string;
}

export class AccessLog {
  private attempts: AccessAttempt[] = [];

  constructor(
    public readonly id: string,
    public readonly vaultId: string
  ) {}

  public logAccessAttempt(
    personnelId: string,
    personnelName: string,
    clearanceLevel: ClearanceLevel,
    biometricVerified: boolean,
    granted: boolean,
    denialReason?: string
  ): AccessAttempt {
    const attempt: AccessAttempt = {
      personnelId,
      personnelName,
      clearanceLevel,
      timestamp: new Date(),
      biometricVerified,
      granted,
      denialReason
    };
    this.attempts.push(attempt);
    return attempt;
  }

  public getAttempts(): AccessAttempt[] {
    return [...this.attempts];
  }

  public getSuccessfulEntries(): AccessAttempt[] {
    return this.attempts.filter(a => a.granted);
  }

  public getViolations(): AccessAttempt[] {
    return this.attempts.filter(a => !a.granted);
  }
}