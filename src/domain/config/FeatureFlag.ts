export class FeatureFlag {
  constructor(public readonly id: string, public readonly isEnabled: boolean, public readonly description: string) {}
}