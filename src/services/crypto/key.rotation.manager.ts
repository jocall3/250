import { HSMConnector } from './hsm.connector';
export class KeyRotationManager {
    private currentKeyId: string | null = null;
    private rotationIntervalDays = 30;
    constructor(private hsm: HSMConnector) {}
    async rotateKeys(): Promise<string> {
        const newKeyLabel = `master-key-${Date.now()}`;
        this.currentKeyId = await this.hsm.generateRSAKey(newKeyLabel, 4096);
        console.log(`Key rotated successfully. New active key: ${this.currentKeyId}`);
        return this.currentKeyId;
    }
    async checkAndRotate(lastRotationDate: Date): Promise<void> {
        const daysSince = (Date.now() - lastRotationDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince >= this.rotationIntervalDays) {
            await this.rotateKeys();
        }
    }
}