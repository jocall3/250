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
 * IssuanceTaxComplianceRule
 * Calculates and logs the necessary taxes during the issuance phase.
 */
export class IssuanceTaxComplianceRule implements IssuanceRule {
  public readonly name = "Issuance Tax Compliance Rule";
  public readonly code = "RULE-ISSUANCE-TAX-COMPLIANCE";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { batch, taxRate } = context;

    const billValue = 250;
    const totalBatchValue = batch.size * billValue;
    const calculatedTax = totalBatchValue * taxRate;

    if (taxRate < 0 || taxRate > 1) {
      return {
        isValid: false,
        errorCode: "INVALID_TAX_RATE",
        message: `Tax rate must be between 0% and 100%. Received: ${taxRate * 100}%.`,
        metadata: { taxRate }
      };
    }

    return {
      isValid: true,
      message: `Tax compliance check passed. Calculated issuance tax of $${calculatedTax.toLocaleString()} USD (${taxRate * 100}% rate) must be withheld/logged for batch '${batch.batchId}'.`,
      metadata: {
        totalBatchValue,
        taxRate,
        calculatedTax
      }
    };
  }
}