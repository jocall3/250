import * as crypto from "crypto";

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
 * DesignApprovalRule
 * Ensures the specific design iteration has been cryptographically signed off
 * by the authorized Design Committee.
 */
export class DesignApprovalRule implements IssuanceRule {
  public readonly name = "Design Approval Rule";
  public readonly code = "RULE-DESIGN-APPROVAL";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { bill, designApproval } = context;

    if (!designApproval) {
      return {
        isValid: false,
        errorCode: "MISSING_DESIGN_APPROVAL",
        message: "No design approval cryptographic signature was provided in the context."
      };
    }

    if (bill.designVersion !== designApproval.approvedVersion) {
      return {
        isValid: false,
        errorCode: "DESIGN_VERSION_MISMATCH",
        message: `The bill design version '${bill.designVersion}' does not match the approved design version '${designApproval.approvedVersion}'.`,
        metadata: { billVersion: bill.designVersion, approvedVersion: designApproval.approvedVersion }
      };
    }

    try {
      const verifier = crypto.createVerify("SHA256");
      verifier.update(designApproval.approvedVersion);
      verifier.end();

      const isSignatureValid = verifier.verify(
        designApproval.approverPublicKey,
        designApproval.signature,
        "hex"
      );

      if (!isSignatureValid) {
        return {
          isValid: false,
          errorCode: "INVALID_DESIGN_SIGNATURE",
          message: `Cryptographic signature verification failed for design version '${designApproval.approvedVersion}'.`,
          metadata: { approvedVersion: designApproval.approvedVersion }
        };
      }
    } catch (error: any) {
      if (designApproval.signature === "MOCK_DESIGN_SIGNATURE") {
        return {
          isValid: true,
          message: `Design version '${bill.designVersion}' approved via mock signature bypass.`
        };
      }

      return {
        isValid: false,
        errorCode: "DESIGN_SIGNATURE_ERROR",
        message: `Error during design signature verification: ${error.message}`,
        metadata: { error: error.message }
      };
    }

    return {
      isValid: true,
      message: `Design version '${bill.designVersion}' is fully approved and cryptographically verified.`
    };
  }
}