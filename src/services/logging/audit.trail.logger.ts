import { logger } from './logger.core';
import crypto from 'crypto';

export interface AuditPayload {
  actorId: string;
  action: string;
  resourceType: 'FINANCIAL_ASSET' | 'USER_PERMISSION' | 'SYSTEM_CONFIG';
  resourceId: string;
  previousState: Record<string, any> | null;
  newState: Record<string, any>;
  metadata?: Record<string, any>;
}

export class AuditTrailLogger {
  private static calculateHash(payload: string): string {
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  public static log(payload: AuditPayload): void {
    const timestamp = new Date().toISOString();
    const rawPayload = JSON.stringify({
      ...payload,
      timestamp,
    });

    const integrityHash = this.calculateHash(rawPayload);

    logger.info('AUDIT_TRAIL_EVENT', {
      auditEvent: {
        ...payload,
        timestamp,
        integrityHash,
      },
    });
  }
}