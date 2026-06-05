import * as client from 'prom-client';

export class PrometheusMetrics {
  private registry: client.Registry;
  public httpRequestDurationMicroseconds: client.Histogram;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });
    
    this.httpRequestDurationMicroseconds = new client.Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['method', 'route', 'code'],
      buckets: [0.1, 5, 15, 50, 100, 500]
    });
    this.registry.registerMetric(this.httpRequestDurationMicroseconds);
  }

  public async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
}