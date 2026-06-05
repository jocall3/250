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
 * MaterialQualityRule
 * Validates that the physical material specifications meet the required standard
 * for the premium $250 Trump Bill (e.g., 24K Gold Leaf Polymer, 3D security thread, watermark, microprinting).
 */
export class MaterialQualityRule implements IssuanceRule {
  public readonly name = "Material Quality Rule";
  public readonly code = "RULE-MATERIAL-QUALITY";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { bill } = context;
    const specs = bill.materialSpecs;

    const REQUIRED_PAPER_TYPE = "24K_GOLD_LEAF_POLYMER";
    const MIN_THICKNESS = 115;
    const MAX_THICKNESS = 125;

    if (specs.paperType !== REQUIRED_PAPER_TYPE) {
      return {
        isValid: false,
        errorCode: "INVALID_PAPER_TYPE",
        message: `Material paper type '${specs.paperType}' does not meet the required standard of '${REQUIRED_PAPER_TYPE}'.`,
        metadata: { received: specs.paperType, expected: REQUIRED_PAPER_TYPE }
      };
    }

    if (!specs.securityThread) {
      return {
        isValid: false,
        errorCode: "MISSING_SECURITY_THREAD",
        message: "Physical security thread validation failed. The 3D security ribbon must be embedded."
      };
    }

    if (!specs.watermarkPresent) {
      return {
        isValid: false,
        errorCode: "MISSING_WATERMARK",
        message: "Watermark validation failed. The high-definition Trump portrait watermark must be present."
      };
    }

    if (!specs.microprintingPassed) {
      return {
        isValid: false,
        errorCode: "MICROPRINTING_FAILED",
        message: "Microprinting validation failed. Micro-text borders must be perfectly legible under magnification."
      };
    }

    if (specs.thicknessMicrons < MIN_THICKNESS || specs.thicknessMicrons > MAX_THICKNESS) {
      return {
        isValid: false,
        errorCode: "INVALID_THICKNESS",
        message: `Material thickness of ${specs.thicknessMicrons} microns is out of the acceptable range (${MIN_THICKNESS}-${MAX_THICKNESS} microns).`,
        metadata: { thickness: specs.thicknessMicrons, min: MIN_THICKNESS, max: MAX_THICKNESS }
      };
    }

    return {
      isValid: true,
      message: "Physical material quality and security features successfully validated to the highest standards."
    };
  }
}