import * as crypto from 'crypto';
export class PayloadSigner {
    constructor(private webhookSecret: string) {}
    signPayload(payload: object): string {
        const stringifiedPayload = JSON.stringify(payload);
        const hmac = crypto.createHmac('sha256', this.webhookSecret);
        hmac.update(stringifiedPayload);
        return `sha256=${hmac.digest('hex')}`;
    }
    verifyPayload(payload: object, signatureHeader: string): boolean {
        const expectedSignature = this.signPayload(payload);
        return crypto.timingSafeEqual(
            Buffer.from(signatureHeader),
            Buffer.from(expectedSignature)
        );
    }
}