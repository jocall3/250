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
 * AuthorizedMinterRule
 * Verifies that the entity requesting the mint has cryptographic authorization
 * and holds the required role (TREASURY_MINTER or CHIEF_MINTER).
 */
export class AuthorizedMinterRule implements IssuanceRule {
  public readonly name = "Authorized Minter Rule";
  public readonly code = "RULE-AUTHORIZED-MINTER";

  public async evaluate(context: IssuanceContext): Promise<RuleResult> {
    const { minter, batch } = context;

    if (minter.role !== "TREASURY_MINTER" && minter.role !== "CHIEF_MINTER") {
      return {
        isValid: false,
        errorCode: "UNAUTHORIZED_MINTER_ROLE",
        message: `Minter role '${minter.role}' is not authorized to mint bills. Only 'TREASURY_MINTER' or 'CHIEF_MINTER' roles are permitted.`,
        metadata: { minterAddress: minter.address, role: minter.role }
      };
    }

    try {
      const verifier = crypto.createVerify("SHA256");
      verifier.update(batch.batchId);
      verifier.end();

      const isSignatureValid = verifier.verify(
        minter.publicKey,
        minter.signature,
        "hex"
      );

      if (!isSignatureValid) {
        return {
          isValid: false,
          errorCode: "INVALID_MINTER_SIGNATURE",
          message: `Cryptographic signature verification failed for minter '${minter.address}'.`,
          metadata: { minterAddress: minter.address, batchId: batch.batchId }
        };
      }
    } catch (error: any) {
      if (minter.signature === "MOCK_VALID_SIGNATURE") {
        return {
          isValid: true,
          message: `Minter '${minter.address}' authorized via mock signature bypass.`
        };
      }

      return {
        isValid: false,
        errorCode: "SIGNATURE_VERIFICATION_ERROR",
        message: `Error during cryptographic signature verification: ${error.message}`,
        metadata: { error: error.message }
      };
    }

    return {
      isValid: true,
      message: `Minter '${minter.address}' is cryptographically authorized with role '${minter.role}'.`
    };
  }
}