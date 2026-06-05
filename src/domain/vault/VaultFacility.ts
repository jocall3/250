import { StorageBin, BillItem } from "./StorageBin";
import { AccessLog } from "./AccessLog";
import { EnvironmentalControls } from "./EnvironmentalControls";
import { SecurityClearance, ClearanceLevel } from "./SecurityClearance";
import { EmergencyProtocol, LockdownSeverity } from "./EmergencyProtocol";

export class VaultFacility {
  private bins: Map<string, StorageBin> = new Map();
  private accessLog: AccessLog;
  private environmentalControls: EnvironmentalControls;
  private emergencyProtocol: EmergencyProtocol;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly locationCode: string,
    public readonly maxBinCapacity: number
  ) {
    this.accessLog = new AccessLog(`${id}-log`, id);
    this.environmentalControls = new EnvironmentalControls(`${id}-env`, id);
    this.emergencyProtocol = new EmergencyProtocol(`${id}-emergency`, id, "Trump Presidential Vault Shield Protocol");
  }

  public addStorageBin(bin: StorageBin): void {
    if (this.bins.has(bin.id)) {
      throw new Error(`Storage bin with ID ${bin.id} already exists in this vault.`);
    }
    if (bin.vaultId !== this.id) {
      throw new Error(`Storage bin vault ID mismatch. Expected ${this.id}, got ${bin.vaultId}`);
    }
    this.bins.set(bin.id, bin);
  }

  public getBin(binId: string): StorageBin {
    const bin = this.bins.get(binId);
    if (!bin) {
      throw new Error(`Storage bin ${binId} not found in vault ${this.name}.`);
    }
    return bin;
  }

  public getBins(): StorageBin[] {
    return Array.from(this.bins.values());
  }

  public recordAccess(
    personnelId: string,
    personnelName: string,
    clearanceLevel: ClearanceLevel,
    biometricVerified: boolean
  ): boolean {
    if (this.emergencyProtocol.isActive && this.emergencyProtocol.severity === LockdownSeverity.PRESIDENTIAL_SHIELD) {
      this.accessLog.logAccessAttempt(
        personnelId,
        personnelName,
        clearanceLevel,
        biometricVerified,
        false,
        "Access denied: Vault is under PRESIDENTIAL_SHIELD lockdown."
      );
      return false;
    }

    const requiredClearance = new SecurityClearance(ClearanceLevel.LEVEL_5_PRESIDENTIAL, true, true);
    const hasClearance = requiredClearance.canAccess(clearanceLevel);

    if (!hasClearance) {
      this.accessLog.logAccessAttempt(
        personnelId,
        personnelName,
        clearanceLevel,
        biometricVerified,
        false,
        "Access denied: Insufficient security clearance level."
      );
      return false;
    }

    if (!biometricVerified) {
      this.accessLog.logAccessAttempt(
        personnelId,
        personnelName,
        clearanceLevel,
        biometricVerified,
        false,
        "Access denied: Biometric verification failed."
      );
      return false;
    }

    this.accessLog.logAccessAttempt(personnelId, personnelName, clearanceLevel, biometricVerified, true);
    return true;
  }

  public depositBillToBin(binId: string, bill: BillItem, personnelId: string, clearanceLevel: ClearanceLevel): void {
    if (this.emergencyProtocol.isActive) {
      throw new Error("Cannot deposit bills while vault is in lockdown.");
    }
    const bin = this.getBin(binId);
    if (!bin.requiredClearance.canAccess(clearanceLevel)) {
      throw new Error("Personnel does not have sufficient clearance to deposit into this bin.");
    }
    bin.storeBill(bill);
  }

  public withdrawBillFromBin(binId: string, serialNumber: string, personnelId: string, clearanceLevel: ClearanceLevel): BillItem {
    if (this.emergencyProtocol.isActive) {
      throw new Error("Cannot withdraw bills while vault is in lockdown.");
    }
    const bin = this.getBin(binId);
    if (!bin.requiredClearance.canAccess(clearanceLevel)) {
      throw new Error("Personnel does not have sufficient clearance to withdraw from this bin.");
    }
    return bin.removeBill(serialNumber);
  }

  public triggerEmergency(severity: LockdownSeverity, triggeredBy: string): void {
    this.emergencyProtocol.triggerLockdown(severity, triggeredBy);
  }

  public resolveEmergency(resolvedBy: string, report: string): void {
    this.emergencyProtocol.resolveEmergency(resolvedBy, report);
  }

  public getEnvironmentalControls(): EnvironmentalControls {
    return this.environmentalControls;
  }

  public getAccessLog(): AccessLog {
    return this.accessLog;
  }

  public getEmergencyProtocol(): EmergencyProtocol {
    return this.emergencyProtocol;
  }

  public getTotalValue(): number {
    return Array.from(this.bins.values()).reduce((sum, bin) => sum + bin.getTotalValueStored(), 0);
  }
}