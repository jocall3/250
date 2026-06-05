import { Rule, RuleContext, RuleResult } from '../Rule';

export class ForeignNationalRestrictionRule implements Rule {
  public readonly name = 'ForeignNationalRestrictionRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction } = context;

    if (transaction.assetType === 'campaign_contribution' && collector.isForeignNational) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Purchase blocked: Collector ${collector.id} is identified as a foreign national. Federal Election Commission (FEC) regulations strictly prohibit foreign nationals from making political contributions.`,
        requiresManualReview: false,
        metadata: {
          collectorCountry: collector.country,
          assetType: transaction.assetType
        }
      };
    }

    const highRiskCountries = ['RU', 'CN', 'IR', 'KP', 'SY'];
    if (collector.isForeignNational && highRiskCountries.includes(collector.country)) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: `Collector is a foreign national from a high-risk jurisdiction (${collector.country}). Transaction allowed but flagged for compliance review.`,
        requiresManualReview: true,
        metadata: {
          collectorCountry: collector.country,
          riskLevel: 'HIGH'
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'Foreign national restriction check passed.',
      requiresManualReview: false
    };
  }
}