import { Rule, RuleContext, RuleResult } from '../Rule';

export class CampaignFinanceLimitRule implements Rule {
  public readonly name = 'CampaignFinanceLimitRule';
  private static readonly FEC_INDIVIDUAL_LIMIT = 3300;

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction, historicalTotalUSD = 0 } = context;

    if (transaction.assetType !== 'campaign_contribution') {
      return {
        isPassed: true,
        ruleName: this.name,
        message: 'Asset is not classified as a campaign contribution. Campaign finance limits do not apply.',
        requiresManualReview: false
      };
    }

    const totalContribution = historicalTotalUSD + transaction.amountUSD;

    if (totalContribution > CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT) {
      const remainingLimit = Math.max(0, CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT - historicalTotalUSD);
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Transaction of $${transaction.amountUSD} exceeds the FEC individual contribution limit of $${CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT}. Remaining allowable contribution: $${remainingLimit}.`,
        requiresManualReview: false,
        metadata: {
          historicalTotalUSD,
          attemptedAmount: transaction.amountUSD,
          fecLimit: CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT,
          remainingLimit
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: `Campaign finance limit check passed. Total contribution of $${totalContribution} is within the $${CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT} limit.`,
      requiresManualReview: false,
      metadata: {
        currentContribution: totalContribution,
        fecLimit: CampaignFinanceLimitRule.FEC_INDIVIDUAL_LIMIT
      }
    };
  }
}