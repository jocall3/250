import { logger } from './logger.core';

export interface SecurityEventPayload {
  eventType: 'FAILED_LOGIN' | 'WAF_BLOCK' | 'UNAUTHORIZED_ACCESS' | 'SQL_INJECTION_ATTEMPT' | 'RATE_LIMIT_EXCEEDED';
  severity: 'HIGH' | 'CRITICAL';
  actorIp: string;
  userId?: string;
  details: Record<string, any>;
}

export class SecurityEventLogger {
  public static logSecurityEvent(payload: SecurityEventPayload): void {
    const timestamp = new Date().toISOString();

    logger.warn(`SECURITY_ALERT: [${payload.severity}] ${payload.eventType}`, {
      securityEvent: {
        ...payload,
        timestamp,
        siemAlertTrigger: true,
      },
    });

    if (payload.severity === 'CRITICAL') {
      this.triggerImmediateAlert(payload);
    }
  }

  private static triggerImmediateAlert(payload: SecurityEventPayload): void {
    console.error(`!!! CRITICAL SECURITY ALERT !!! - ${payload.eventType} from IP ${payload.actorIp}. Initiating immediate incident response.`);
  }
}