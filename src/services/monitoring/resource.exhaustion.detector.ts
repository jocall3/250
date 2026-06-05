import * as os from 'os';
import { monitorEventLoopDelay } from 'perf_hooks';

export class ResourceExhaustionDetector {
  private eventLoopMonitor = monitorEventLoopDelay({ resolution: 10 });
  private readonly CPU_THRESHOLD = 90;
  private readonly LAG_THRESHOLD_MS = 100;

  constructor() {
    this.eventLoopMonitor.enable();
    setInterval(() => this.checkResources(), 5000);
  }

  private checkResources(): void {
    const lag = this.eventLoopMonitor.mean / 1e6;
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    
    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);
    
    if (cpuUsage > this.CPU_THRESHOLD || lag > this.LAG_THRESHOLD_MS) {
      this.triggerGracefulDegradation(cpuUsage, lag);
    }
  }

  private triggerGracefulDegradation(cpu: number, lag: number): void {
    console.error(`Resource Exhaustion! CPU: ${cpu}%, Event Loop Lag: ${lag.toFixed(2)}ms`);
  }
}