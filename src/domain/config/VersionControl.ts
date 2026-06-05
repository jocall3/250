export class VersionControl {
  constructor(public readonly version: string, public readonly deployedAt: Date, public readonly commitHash: string) {}
}