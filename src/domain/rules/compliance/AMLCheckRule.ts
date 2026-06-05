import { Rule, RuleContext, RuleResult } from '../Rule';

export class AMLCheckRule implements Rule {
  public readonly name = 'AMLCheckRule';
  private static readonly AML_THRESHOLD_USD = 10000;

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction, historicalTotalUSD = 0 } = context;

    if (transaction.amountUSD >= AMLCheckRule.AML_THRESHOLD_USD) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Transaction amount $${transaction.amountUSD} meets or exceeds the AML threshold of $${AMLCheckRule.AML_THRESHOLD_USD}. Source of Funds (SoF) declaration required.`,
        requiresManualReview: true,
        metadata: {
          amountUSD: transaction.amountUSD,
          threshold: AMLCheckRule.AML_THRESHOLD_USD,
          actionRequired: 'SOURCE_OF_FUNDS_VERIFICATION'
        }
      };
    }

    const cumulativeTotal = historicalTotalUSD + transaction.amountUSD;
    if (cumulativeTotal >= AMLCheckRule.AML_THRESHOLD_USD) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: `Cumulative transaction volume ($${cumulativeTotal}) is approaching or exceeds AML threshold. Flagged for compliance review.`,
        requiresManualReview: true,
        metadata: {
          cumulativeTotal,
          threshold: AMLCheckRule.AML_THRESHOLD_USD,
          actionRequired: 'CUMULATIVE_VOLUME_REVIEW'
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'AML compliance checks passed.',
      requiresManualReview: false
    };
  }
}