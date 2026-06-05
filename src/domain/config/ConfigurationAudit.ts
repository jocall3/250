export class ConfigurationAudit {
  constructor(public readonly timestamp: Date, public readonly userId: string, public readonly changeType: string, public readonly oldValue: any, public readonly newValue: string) {}
}