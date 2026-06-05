import * as crypto from 'crypto';
export class SignatureVerifier {
    static verifyECDSA(publicKey: string, signature: string, payload: string): boolean {
        try {
            const verify = crypto.createVerify('SHA256');
            verify.update(payload);
            verify.end();
            return verify.verify(publicKey, signature, 'hex');
        } catch (error) {
            return false;
        }
    }
}