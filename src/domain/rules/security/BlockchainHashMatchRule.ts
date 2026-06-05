import { ValidationRule, ValidationResult } from '../rules-base';

/**
 * Rule ensuring the physical asset's hash matches the on-chain NFT.
 * Links the physical bill to its digital twin on the blockchain.
 */
export class BlockchainHashMatchRule implements ValidationRule<any> {
  async validate(data: any): Promise<ValidationResult> {
    const { physicalHash, onChainHash } = data;

    if (!physicalHash || !onChainHash) {
      return { isValid: false, error: 'Hash data missing for blockchain verification.' };
    }

    if (physicalHash !== onChainHash) {
      return { 
        isValid: false, 
        error: 'Physical asset hash does not match the on-chain record. Provenance broken.' 
      };
    }

    return { isValid: true };
  }
}