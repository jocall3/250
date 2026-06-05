import * as crypto from 'crypto';
export class WalletEncryption {
    private static ALGORITHM = 'aes-256-gcm';
    static encrypt(privateKey: string, masterKey: Buffer): { ciphertext: string, iv: string, authTag: string } {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.ALGORITHM, masterKey, iv);
        let ciphertext = cipher.update(privateKey, 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        return { ciphertext, iv: iv.toString('hex'), authTag: cipher.getAuthTag().toString('hex') };
    }
    static decrypt(ciphertext: string, iv: string, authTag: string, masterKey: Buffer): string {
        const decipher = crypto.createDecipheriv(this.ALGORITHM, masterKey, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}