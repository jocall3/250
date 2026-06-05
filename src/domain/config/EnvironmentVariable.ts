export class EnvironmentVariable {
  constructor(public readonly name: subject, public readonly value: string, public readonly environment: 'Dev' | 'Staging' | 'Prod') {}
}