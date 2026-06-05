import axios from 'axios';

export class PagerDutyNotifier {
  private routingKey = process.env.PAGERDUTY_ROUTING_KEY || '';

  public async triggerIncident(summary: string, details: string): Promise<void> {
    if (!this.routingKey) return;
    try {
      await axios.post('https://events.pagerduty.com/v2/enqueue', {
        routing_key: this.routingKey,
        event_action: 'trigger',
        payload: {
          summary,
          source: 'trump-250-app-monitor',
          severity: 'critical',
          custom_details: { details }
        }
      });
    } catch (error) {
      console.error('Failed to trigger PagerDuty incident', error);
    }
  }

  public async resolveIncident(dedupKey: string): Promise<void> {
    if (!this.routingKey) return;
    try {
      await axios.post('https://events.pagerduty.com/v2/enqueue', {
        routing_key: this.routingKey,
        event_action: 'resolve',
        dedup_key: dedupKey
      });
    } catch (error) {
      console.error('Failed to resolve PagerDuty incident', error);
    }
  }
}