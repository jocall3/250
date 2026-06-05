import * as crypto from 'crypto';
export class CryptoHashUtils {
    static sha3(data: string): string {
        return crypto.createHash('sha3-256').update(data).digest('hex');
    }
    static blake2b(data: string): string {
        const algo = crypto.getHashes().includes('blake2b512') ? 'blake2b512' : 'sha512';
        return crypto.createHash(algo).update(data).digest('hex');
    }
}