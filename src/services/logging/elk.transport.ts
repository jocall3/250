import Transport from 'winston-transport';
import axios from 'axios';

interface ElkTransportOptions extends Transport.TransportStreamOptions {
  elkUrl: string;
  apiKey?: string;
  batchSize?: number;
  flushIntervalMs?: number;
}

export class ElkTransport extends Transport {
  private elkUrl: string;
  private apiKey?: string;
  private batchSize: number;
  private flushIntervalMs: number;
  private queue: any[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(opts: ElkTransportOptions) {
    super(opts);
    this.elkUrl = opts.elkUrl;
    this.apiKey = opts.apiKey;
    this.batchSize = opts.batchSize || 50;
    this.flushIntervalMs = opts.flushIntervalMs || 5000;
    this.startTimer();
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    this.queue.push(info);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
    callback();
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.flushIntervalMs);
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) {
        headers['Authorization'] = `ApiKey ${this.apiKey}`;
      }

      const body = batch.map(item => JSON.stringify({ index: {} }) + '\n' + JSON.stringify(item)).join('\n') + '\n';

      await axios.post(this.elkUrl, body, { headers });
    } catch (error) {
      console.error('Failed to send logs to ELK cluster:', error);
    }
  }

  public close() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
  }
}