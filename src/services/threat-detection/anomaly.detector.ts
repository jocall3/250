interface RequestMetric {
  timestamp: number;
  payloadSize: number;
}

export class AnomalyDetector {
  private static instance: AnomalyDetector;
  private requestHistory: Map<string, RequestMetric[]> = new Map();
  
  private readonly WINDOW_MS = 60000;
  private readonly MAX_REQUESTS_PER_WINDOW = 120;
  private readonly PAYLOAD_SIZE_Z_SCORE_THRESHOLD = 3.0;

  private constructor() {
    setInterval(() => this.cleanupHistory(), 300000);
  }

  public static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector();
    }
    return AnomalyDetector.instance;
  }

  public recordRequest(ip: string, payloadSize: number): { isAnomalous: boolean; reason?: string } {
    const now = Date.now();
    if (!this.requestHistory.has(ip)) {
      this.requestHistory.set(ip, []);
    }

    const history = this.requestHistory.get(ip)!;
    history.push({ timestamp: now, payloadSize });

    const currentWindowHistory = history.filter(h => now - h.timestamp < this.WINDOW_MS);
    this.requestHistory.set(ip, currentWindowHistory);

    if (currentWindowHistory.length > this.MAX_REQUESTS_PER_WINDOW) {
      return { isAnomalous: true, reason: "Rate anomaly detected" };
    }

    const hour = new Date().getHours();
    if ((hour >= 2 && hour <= 4) && currentWindowHistory.length > this.MAX_REQUESTS_PER_WINDOW / 3) {
      return { isAnomalous: true, reason: "Suspicious off-hours activity" };
    }

    if (currentWindowHistory.length > 10) {
      const sizes = currentWindowHistory.map(h => h.payloadSize);
      const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
      const variance = sizes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sizes.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev > 0) {
        const zScore = Math.abs(payloadSize - mean) / stdDev;
        if (zScore > this.PAYLOAD_SIZE_Z_SCORE_THRESHOLD && payloadSize > 50000) {
          return { isAnomalous: true, reason: "Payload size anomaly detected" };
        } 
      }
    }

    return { isAnomalous: false };
  }

  private cleanupHistory(): void {
    const now = Date.now();
    for (const [ip, history] of this.requestHistory.entries()) {
      const filtered = history.filter(h => now - h.timestamp < this.WINDOW_MS);
      if (filtered.length === 0) {
        this.requestHistory.delete(ip);
      } else {
        this.requestHistory.set(ip, filtered);
      }
    }
  }
}