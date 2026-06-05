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
 * BatchSizeLimitRule
 * Limits the number of bills that can be minted in a single transaction
 * to ensure quality control, ledger stability, and auditability.
 */
export class BatchSizeLimitRule implements IssuanceRule {
  public readonly name = "Batch Size Limit Rule";
  public readonly code = "RULE-BATCH-SIZE-LIMIT";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { batch } = context;
    const MAX_BATCH_SIZE = 10000;

    if (batch.size <= 0) {
      return {
        isValid: false,
        errorCode: "INVALID_BATCH_SIZE",
        message: `Batch size must be greater than zero. Received: ${batch.size}.`,
        metadata: { batchSize: batch.size }
      };
    }

    if (batch.size > MAX_BATCH_SIZE) {
      return {
        isValid: false,
        errorCode: "BATCH_SIZE_EXCEEDED",
        message: `Batch size of ${batch.size} exceeds the maximum limit of ${MAX_BATCH_SIZE} bills per transaction.`,
        metadata: { batchSize: batch.size, maxLimit: MAX_BATCH_SIZE }
      };
    }

    return {
      isValid: true,
      message: `Batch size of ${batch.size} is within the acceptable limit of ${MAX_BATCH_SIZE} bills.`
    };
  }
}