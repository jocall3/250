import { Rule, RuleContext, RuleResult } from '../Rule';

export class TaxReportingThresholdRule implements Rule {
  public readonly name = 'TaxReportingThresholdRule';
  private static readonly IRS_REPORTING_THRESHOLD = 10000;

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { transaction } = context;

    if (transaction.amountUSD >= TaxReportingThresholdRule.IRS_REPORTING_THRESHOLD) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: `Transaction amount ($${transaction.amountUSD}) meets or exceeds the IRS reporting threshold of $${TaxReportingThresholdRule.IRS_REPORTING_THRESHOLD}. IRS Form 8300 / Form 1099 filing is required.`,
        requiresManualReview: true,
        metadata: {
          reportingRequired: true,
          formType: transaction.assetType === 'security' ? '1099-B' : '8300',
          threshold: TaxReportingThresholdRule.IRS_REPORTING_THRESHOLD,
          amountUSD: transaction.amountUSD
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'Transaction is below the IRS tax reporting threshold.',
      requiresManualReview: false,
      metadata: {
        reportingRequired: false,
        amountUSD: transaction.amountUSD
      }
    };
  }
}