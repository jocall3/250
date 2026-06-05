import { logger } from './logger.core';

export class DebugTraceLogger {
  private static isDebugTraceEnabled(): boolean {
    return process.env.ENABLE_DEBUG_TRACE === 'true';
  }

  public static trace(message: string, context?: Record<string, any>): void {
    if (!this.isDebugTraceEnabled()) {
      return;
    }

    logger.debug(`[TRACE] ${message}`, {
      traceContext: {
        ...context,
        timestamp: new Date().toISOString(),
      },
    });
  }
}