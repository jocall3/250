import { PagerDutyNotifier } from './pagerduty.notifier';
import { SlackSecurityBot } from './slack.security.bot';

export enum AlertSeverity { INFO, WARNING, CRITICAL }

export class AlertWebhookDispatcher {
  private pagerDuty = new PagerDutyNotifier();
  private slackBot = new SlackSecurityBot();

  public async dispatch(title: string, description: string, severity: AlertSeverity): Promise<void> {
    if (severity === AlertSeverity.CRITICAL) {
      await this.pagerDuty.triggerIncident(title, description);
      await this.slackBot.postSecurityAlert(`CRITICAL: ${title}`, description);
    } else if (severity === AlertSeverity.WARNING) {
      await this.slackBot.postSecurityAlert(`WARNING: ${title}`, description);
    } else {
      console.log(`[INFO Alert] ${title}: ${description}`);
    }
  }
}