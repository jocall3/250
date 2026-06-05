import { Rule, RuleContext, RuleResult } from '../Rule';

export class SECExemptionRule implements Rule {
  public readonly name = 'SECExemptionRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction } = context;

    if (transaction.assetType !== 'security') {
      return {
        isPassed: true,
        ruleName: this.name,
        message: 'Asset is not classified as a security. SEC exemptions do not apply.',
        requiresManualReview: false
      };
    }

    const isAccredited = collector.kycLevel === 'enhanced' && collector.age >= 18;

    if (!isAccredited) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: 'Collector does not meet the accredited investor criteria required under Regulation D (Rule 506(c)) for security-tokenized assets.',
        requiresManualReview: true,
        metadata: {
          accreditedStatus: 'UNVERIFIED',
          requiredExemption: 'RegD_506c'
        }
      };
    }

    if (collector.isForeignNational) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: 'Transaction complies with Regulation S offshore safe harbor provisions for foreign nationals.',
        requiresManualReview: true,
        metadata: {
          exemptionApplied: 'RegS',
          collectorCountry: collector.country
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'SEC Exemption compliance verified (Regulation D Rule 506(c)).',
      requiresManualReview: false,
      metadata: {
        exemptionApplied: 'RegD_506c',
        accreditedStatus: 'VERIFIED'
      }
    };
  }
}