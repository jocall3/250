import { logger } from './logger.core';

export class PerformanceLogger {
  public static startTimer(): () => number {
    const start = process.hrtime();
    return () => {
      const diff = process.hrtime(start);
      return parseFloat((diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2));
    };
  }

  public static async measure<T>(
    operationName: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const endTimer = this.startTimer();
    try {
      const result = await fn();
      const durationMs = endTimer();
      logger.info(`Performance Metric: ${operationName} completed in ${durationMs}ms`, {
        performance: {
          operationName,
          durationMs,
          status: 'success',
          ...metadata,
        },
      });
      return result;
    } catch (error) {
      const durationMs = endTimer();
      logger.error(`Performance Metric: ${operationName} failed after ${durationMs}ms`, {
        performance: {
          operationName,
          durationMs,
          status: 'failure',
          error: error instanceof Error ? error.message : String(error),
          ...metadata,
        },
      });
      throw error;
    }
  }
}