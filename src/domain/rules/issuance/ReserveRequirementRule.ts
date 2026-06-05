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
 * ReserveRequirementRule
 * Ensures adequate backing assets (e.g., gold reserves or USD) exist
 * before minting new bills to maintain absolute financial stability.
 */
export class ReserveRequirementRule implements IssuanceRule {
  public readonly name = "Reserve Requirement Rule";
  public readonly code = "RULE-RESERVE-REQUIREMENT";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { batch, ledgerState } = context;

    const billValue = 250;
    const proposedBatchValue = batch.size * billValue;
    const currentTotalValue = ledgerState.currentTotalSupply * billValue;
    const totalValueAfterMint = currentTotalValue + proposedBatchValue;

    const requiredReserveAmount = totalValueAfterMint * ledgerState.requiredReserveRatio;

    if (ledgerState.reserveBalanceUSD < requiredReserveAmount) {
      return {
        isValid: false,
        errorCode: "INSUFFICIENT_RESERVES",
        message: `Insufficient reserve backing. Required reserves: $${requiredReserveAmount.toLocaleString()} USD (Ratio: ${ledgerState.requiredReserveRatio * 100}%). Current reserve balance: $${ledgerState.reserveBalanceUSD.toLocaleString()} USD.`,
        metadata: {
          requiredReserves: requiredReserveAmount,
          currentReserves: ledgerState.reserveBalanceUSD,
          proposedBatchValue,
          requiredReserveRatio: ledgerState.requiredReserveRatio
        }
      };
    }

    return {
      isValid: true,
      message: `Reserve backing check passed. Current reserves of $${ledgerState.reserveBalanceUSD.toLocaleString()} USD are sufficient to back the total supply value of $${totalValueAfterMint.toLocaleString()} USD.`
    };
  }
}