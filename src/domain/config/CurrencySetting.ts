export class CurrencySetting {
  constructor(public readonly baseCurrency: string, public readonly supportedCurrencies: string[]) {}
}