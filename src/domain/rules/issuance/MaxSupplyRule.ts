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
 * MaxSupplyRule
 * Ensures that the total minted supply of the $250 Trump Commemorative Bill
 * does not exceed the hard-coded authorized limit (e.g., 45,000,000 bills, honoring the 45th President).
 */
export class MaxSupplyRule implements IssuanceRule {
  public readonly name = "Max Supply Rule";
  public readonly code = "RULE-MAX-SUPPLY";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { batch, ledgerState } = context;
    const proposedNewSupply = ledgerState.currentTotalSupply + batch.size;

    if (proposedNewSupply > ledgerState.maxSupplyLimit) {
      return {
        isValid: false,
        errorCode: "MAX_SUPPLY_EXCEEDED",
        message: `Minting this batch of ${batch.size} bills would exceed the maximum authorized supply limit of ${ledgerState.maxSupplyLimit}. Current supply: ${ledgerState.currentTotalSupply}.`,
        metadata: {
          currentTotalSupply: ledgerState.currentTotalSupply,
          maxSupplyLimit: ledgerState.maxSupplyLimit,
          proposedNewSupply,
          batchSize: batch.size
        }
      };
    }

    return {
      isValid: true,
      message: `Supply check passed. Proposed supply of ${proposedNewSupply} is within the authorized limit of ${ledgerState.maxSupplyLimit}.`
    };
  }
}