export interface RuleResult {
  isValid: boolean;
  errorCode?: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface MaterialSpecs {
  paperType: string;
  securityThread: boolean;
  watermarkPresent: boolean;
  microprintingPassed: boolean;
  thicknessMicrons: number;
}

export interface IssuanceContext {
  bill: {
    serialNumber: string;
    denomination: number;
    designVersion: string;
    materialSpecs: MaterialSpecs;
  };
  minter: {
    address: string;
    signature: string;
    publicKey: string;
    role: string;
  };
  batch: {
    batchId: string;
    size: number;
    timestamp: number;
  };
  ledgerState: {
    currentTotalSupply: number;
    maxSupplyLimit: number;
    existingSerialNumbers: Set<string> | string[];
    reserveBalanceUSD: number;
    requiredReserveRatio: number;
  };
  taxRate: number;
  timeWindow?: {
    start: number;
    end: number;
  };
  designApproval?: {
    approvedVersion: string;
    signature: string;
    approverPublicKey: string;
  };
}

export interface IssuanceRule {
  name: string;
  code: string;
  evaluate(context: IssuanceContext): Promise<RuleResult>;
}

/**
 * ValidDenominationRule
 * Enforces that the bill is strictly minted as a $250 denomination.
 * No other denominations are permitted under this specific issuance framework.
 */
export class ValidDenominationRule implements IssuanceRule {
  public readonly name = "Valid Denomination Rule";
  public readonly code = "RULE-VALID-DENOMINATION";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { bill } = context;
    const REQUIRED_DENOMINATION = 250;

    if (bill.denomination !== REQUIRED_DENOMINATION) {
      return {
        isValid: false,
        errorCode: "INVALID_DENOMINATION",
        message: `Invalid denomination: $${bill.denomination}. The Golden Trump Commemorative Bill must be minted strictly as a $${REQUIRED_DENOMINATION} denomination.`,
        metadata: {
          receivedDenomination: bill.denomination,
          expectedDenomination: REQUIRED_DENOMINATION
        }
      };
    }

    return {
      isValid: true,
      message: `Denomination check passed. Bill is strictly minted as a $${REQUIRED_DENOMINATION} denomination.`
    };
  } 
}