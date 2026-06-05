export class ActiveConnectionsTracker {
  private httpConnections = 0;
  private wsConnections = 0;
  private readonly MAX_HTTP = 10000;
  private readonly MAX_WS = 5000;

  public incrementHttp(): void {
    this.httpConnections++;
    this.checkThresholds();
  }

  public decrementHttp(): void {
    this.httpConnections = Math.max(0, this.httpConnections - 1);
  }

  public incrementWs(): void {
    this.wsConnections++;
    this.checkThresholds();
  }

  public decrementWs(): void {
    this.wsConnections = Math.max(0, this.wsConnections - 1);
  }

  private checkThresholds(): void {
    if (this.httpConnections > this.MAX_HTTP || this.wsConnections > this.MAX_WS) {
      console.warn('Potential Slowloris attack or traffic spike detected!');
    }
  }
}