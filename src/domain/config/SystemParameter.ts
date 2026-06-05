export class SystemParameter<T> {
  constructor(public readonly key: string, public readonly value: T, public readonly description: string) {}
}