export interface EnvironmentalReading {
  timestamp: Date;
  temperatureCelsius: number;
  relativeHumidityPercent: number;
  oxygenLevelPercent: number;
  recordedBy: string;
}

export class EnvironmentalControls {
  private readings: EnvironmentalReading[] = [];
  private isAlarmActive: boolean = false;

  constructor(
    public readonly id: string,
    public readonly vaultId: string,
    public targetTemperature: number = 18.5,
    public targetHumidity: number = 45.0,
    public maxTempDeviation: number = 2.0,
    public maxHumidityDeviation: number = 5.0
  ) {}

  public recordReading(reading: EnvironmentalReading): void {
    this.readings.push(reading);
    this.evaluateThresholds(reading);
  }

  private evaluateThresholds(reading: EnvironmentalReading): void {
    const tempDiff = Math.abs(reading.temperatureCelsius - this.targetTemperature);
    const humidityDiff = Math.abs(reading.relativeHumidityPercent - this.targetHumidity);

    if (tempDiff > this.maxTempDeviation || humidityDiff > this.maxHumidityDeviation) {
      this.isAlarmActive = true;
    } else {
      this.isAlarmActive = false;
    }
  }

  public getLatestReading(): EnvironmentalReading | null {
    if (this.readings.length === 0) return null;
    return this.readings[this.readings.length - 1];
  }

  public isSystemInAlarm(): boolean {
    return this.isAlarmActive;
  }

  public getHistory(): EnvironmentalReading[] {
    return [...this.readings];
  }

  public clearAlarm(): void {
    this.isAlarmActive = false;
  }
}