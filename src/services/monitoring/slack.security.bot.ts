import axios from 'axios';

export class SlackSecurityBot {
  private webhookUrl = process.env.SLACK_SECURITY_WEBHOOK || '';

  public async postSecurityAlert(title: string, message: string): Promise<void> {
    if (!this.webhookUrl) return;
    try {
      const payload = {
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '🚨 Security Alert 🚨' }
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Title:*\n${title}\n\n*Details:*\n${message}` }
          }
        ]
      };
      await axios.post(this.webhookUrl, payload);
    } catch (error) {
      console.error('Failed to post to Slack', error);
    }
  }
}