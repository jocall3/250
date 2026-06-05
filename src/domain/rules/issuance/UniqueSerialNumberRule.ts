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
 * UniqueSerialNumberRule
 * Prevents duplicate serial numbers across the entire ledger and enforces
 * the strict serial number format: USA-250-TRUMP-XXXXXXXX.
 */
export class UniqueSerialNumberRule implements IssuanceRule {
  public readonly name = "Unique Serial Number Rule";
  public readonly code = "RULE-UNIQUE-SERIAL-NUMBER";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { bill, ledgerState } = context;
    const serialNumber = bill.serialNumber;

    const serialPattern = /^USA-250-TRUMP-\d{8}$/;
    if (!serialPattern.test(serialNumber)) {
      return {
        isValid: false,
        errorCode: "INVALID_SERIAL_FORMAT",
        message: `Serial number '${serialNumber}' does not match the required format 'USA-250-TRUMP-XXXXXXXX'.`,
        metadata: { serialNumber, expectedPattern: "USA-250-TRUMP-XXXXXXXX" }
      };
    }

    const exists = Array.isArray(ledgerState.existingSerialNumbers)
      ? ledgerState.existingSerialNumbers.includes(serialNumber)
      : ledgerState.existingSerialNumbers.has(serialNumber);

    if (exists) {
      return {
        isValid: false,
        errorCode: "DUPLICATE_SERIAL_NUMBER",
        message: `Serial number '${serialNumber}' already exists in the ledger. Duplicate bills are strictly prohibited.`,
        metadata: { serialNumber }
      };
    }

    return {
      isValid: true,
      message: `Serial number '${serialNumber}' is unique and matches the required format.`
    };
  }
}