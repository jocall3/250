export enum ClearanceLevel {
  UNRESTRICTED = "UNRESTRICTED",
  LEVEL_1_STAFF = "LEVEL_1_STAFF",
  LEVEL_2_GUARD = "LEVEL_2_GUARD",
  LEVEL_3_SUPERVISOR = "LEVEL_3_SUPERVISOR",
  LEVEL_4_EXECUTIVE = "LEVEL_4_EXECUTIVE",
  LEVEL_5_PRESIDENTIAL = "LEVEL_5_PRESIDENTIAL"
}

export class SecurityClearance {
  constructor(
    public readonly level: ClearanceLevel,
    public readonly biometricRequired: boolean,
    public readonly dualAuthorizationRequired: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.level === ClearanceLevel.LEVEL_5_PRESIDENTIAL && !this.biometricRequired) {
      throw new Error("Presidential clearance level strictly requires biometric verification.");
    }
    if (this.level === ClearanceLevel.LEVEL_5_PRESIDENTIAL && !this.dualAuthorizationRequired) {
      throw new Error("Presidential clearance level strictly requires dual-custody authorization.");
    }
  }

  public canAccess(userLevel: ClearanceLevel): boolean {
    const hierarchy = [
      ClearanceLevel.UNRESTRICTED,
      ClearanceLevel.LEVEL_1_STAFF,
      ClearanceLevel.LEVEL_2_GUARD,
      ClearanceLevel.LEVEL_3_SUPERVISOR,
      ClearanceLevel.LEVEL_4_EXECUTIVE,
      ClearanceLevel.LEVEL_5_PRESIDENTIAL
    ];
    return hierarchy.indexOf(userLevel) >= hierarchy.indexOf(this.level);
  }

  public equals(other: SecurityClearance): boolean {
    return (
      this.level === other.level &&
      this.biometricRequired === other.biometricRequired &&
      this.dualAuthorizationRequired === other.dualAuthorizationRequired
    );
  }
}