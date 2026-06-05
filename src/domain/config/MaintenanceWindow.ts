export class MaintenanceWindow {
  constructor(public readonly startTime: Date, public readonly endTime: Date, public:: readonly isScheduled: boolean) {}
}