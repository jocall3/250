import { AlertWebhookDispatcher, AlertSeverity } from './alert.webhook.dispatcher';

export class UnauthorizedAccessAlarm {
  private ipFailures: Map<string, number[]> = new Map();
  private readonly TIME_WINDOW_MS = 60000;
  private readonly FAILURE_THRESHOLD = 5;
  private dispatcher = new AlertWebhookDispatcher();

  public registerFailure(ip: string): void {
    const now = Date.now();
    const failures = this.ipFailures.get(ip) || [];
    
    const recentFailures = failures.filter(time => now - time < this.TIME_WINDOW_MS);
    recentFailures.push(now);
    this.ipFailures.set(ip, recentFailures);

    if (recentFailures.length >= this.FAILURE_THRESHOLD) {
      this.triggerAlarm(ip, recentFailures.length);
    }
  }

  private triggerAlarm(ip: string, count: number): void {
    this.dispatcher.dispatch(
      'Multiple Unauthorized Access Attempts',
      `IP ${ip} has generated ${count} 401/403 errors in the last minute.`,
      AlertSeverity.CRITICAL
    );
  }
}