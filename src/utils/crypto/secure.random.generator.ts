import * as crypto from 'crypto';
export class SecureRandomGenerator {
    static generateSalt(length: number = 16): string {
        return crypto.randomBytes(length).toString('hex');
    }
    static generateNonce(): string {
        return crypto.randomBytes(12).toString('base64');
    }
    static generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
}