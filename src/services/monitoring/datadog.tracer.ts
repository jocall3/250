import tracer from 'dd-trace';

export class DatadogTracer {
  public static init(): void {
    tracer.init({
      service: 'trump-250-bill-api',
      env: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      logInjection: true,
      profiling: true
    });
    console.log('Datadog APM initialized.');
  }

  public static getTracer() {
    return tracer;
  }
}