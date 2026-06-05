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
 * MintingTimeWindowRule
 * Restricts minting to specific authorized timeframes or commemorative events.
 */
export class MintingTimeWindowRule implements IssuanceRule {
  public readonly name = "Minting Time Window Rule";
  public readonly code = "RULE-MINTING-TIME-WINDOW";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { batch, timeWindow } = context;

    if (!timeWindow) {
      return {
        isValid: false,
        errorCode: "MISSING_TIME_WINDOW",
        message: "No authorized minting time window was provided in the context."
      };
    }

    const currentTimestamp = batch.timestamp;

    if (currentTimestamp < timeWindow.start) {
      return {
        isValid: false,
        errorCode: "TIME_WINDOW_NOT_STARTED",
        message: `Minting window has not started yet. Authorized start: ${new Date(timeWindow.start).toISOString()}. Current: ${new Date(currentTimestamp).toISOString()}.`,
        metadata: { currentTimestamp, start: timeWindow.start }
      };
    }

    if (currentTimestamp > timeWindow.end) {
      return {
        isValid: false,
        errorCode: "TIME_WINDOW_EXPIRED",
        message: `Minting window has expired. Authorized end: ${new Date(timeWindow.end).toISOString()}. Current: ${new Date(currentTimestamp).toISOString()}.`,
        metadata: { currentTimestamp, end: timeWindow.end }
      };
    }

    return {
      isValid: true,
      message: `Minting timestamp ${new Date(currentTimestamp).toISOString()} is within the authorized window.`
    };
  }
}