import { Rule, RuleContext, RuleResult } from '../Rule';

export class KYCVerifiedRule implements Rule {
  public readonly name = 'KYCVerifiedRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction } = context;

    if (!collector.isKycVerified) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Collector ${collector.id} has not completed KYC verification.`,
        requiresManualReview: false,
        metadata: { kycLevel: collector.kycLevel }
      };
    }

    if (transaction.amountUSD >= 3000 && collector.kycLevel !== 'enhanced') {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Transaction amount of $${transaction.amountUSD} requires Enhanced KYC (Level 2). Current level: ${collector.kycLevel}.`,
        requiresManualReview: true,
        metadata: { kycLevel: collector.kycLevel, requiredLevel: 'enhanced' }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'KYC verification requirements satisfied.',
      requiresManualReview: false,
      metadata: { kycLevel: collector.kycLevel }
    };
  }
}