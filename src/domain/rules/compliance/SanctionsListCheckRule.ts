import { Rule, RuleContext, RuleResult } from '../Rule';

export class SanctionsListCheckRule implements Rule {
  public readonly name = 'SanctionsListCheckRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector } = context;

    if (collector.isSanctioned) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `CRITICAL: Collector ${collector.id} (${collector.name}) is matched against OFAC / global sanctions lists. Transaction blocked immediately.`,
        requiresManualReview: false,
        metadata: {
          sanctionStatus: 'MATCHED',
          severity: 'CRITICAL',
          actionRequired: 'FREEZE_ASSETS_AND_REPORT'
        }
      };
    }

    const sanctionedCountries = ['CU', 'IR', 'KP', 'SY', 'BY', 'RU'];
    if (sanctionedCountries.includes(collector.country)) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Transaction blocked: Collector country of residence (${collector.country}) is subject to comprehensive OFAC sanctions.`,
        requiresManualReview: false,
        metadata: {
          collectorCountry: collector.country,
          sanctionStatus: 'COUNTRY_BLOCKED'
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'Sanctions list check passed. No matches found.',
      requiresManualReview: false
    };
  }
}