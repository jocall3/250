import axios from 'axios';

export class SIEMIntegration {
  private splunkUrl = process.env.SPLUNK_HEC_URL || '';
  private splunkToken = process.env.SPLUNK_HEC_TOKEN || '';

  public async forwardLog(level: string, message: string, metadata: any = {}): Promise<void> {
    if (!this.splunkUrl) return;
    try {
      const payload = {
        time: Date.now(),
        host: process.env.HOSTNAME || 'localhost',
        source: 'trump-250-app',
        sourcetype: '_json',
        event: { level, message, ...metadata }
      };
      await axios.post(this.splunkUrl, payload, {
        headers: { Authorization: `Splunk ${this.splunkToken}` }
      });
    } catch (error) {
      console.error('Failed to forward log to SIEM', error);
    }
  }
}