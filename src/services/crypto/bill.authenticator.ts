import { SignatureVerifier } from './signature.verifier';
import { CryptoHashUtils } from '../utils/crypto/crypto.hash.utils';
export interface TrumpBillAsset { serialNumber: string; denomination: number; faceFeatureHash: string; issuerSignature: string; }
export class BillAuthenticator {
    private static ISSUER_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...\n-----END PUBLIC KEY-----';
    static verifyAuthenticity(bill: TrumpBillAsset): boolean {
        if (bill.denomination !== 250) return false;
        const payloadToVerify = `${bill.serialNumber}:${bill.denomination}:${bill.faceFeatureHash}`;
        const payloadHash = CryptoHashUtils.sha3(payloadToVerify);
        return SignatureVerifier.verifyECDSA(this.ISSUER_PUBLIC_KEY, bill.issuerSignature, payloadHash);
    }
}