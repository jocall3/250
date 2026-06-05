import * as tls from 'tls';
import * as fs from 'fs';
export class CertificateManager {
    private certCache: Map<string, tls.SecureContext> = new Map();
    loadMTLSCertificates(serviceName: string, certPath: string, keyPath: string, caPath: string): tls.SecureContext {
        const cert = fs.readFileSync(certPath);
        const key = fs.readFileSync(keyPath);
        const ca = fs.readFileSync(caPath);
        const context = tls.createSecureContext({ cert, key, ca, minVersion: 'TLSv1.3' });
        this.certCache.set(serviceName, context);
        return context;
    }
    getSecureContext(serviceName: string): tls.SecureContext | undefined {
        return this.certCache.get(serviceName);
    }
}