import { Rule, RuleContext, RuleResult } from '../Rule';

export class CorporateOwnershipRule implements Rule {
  public readonly name = 'CorporateOwnershipRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector, transaction } = context;

    if (!collector.isCorporateEntity) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: 'Collector is an individual. Corporate ownership rules do not apply.',
        requiresManualReview: false
      };
    }

    const details = collector.corporateDetails;

    if (!details || !details.beneficialOwners || details.beneficialOwners.length === 0) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: 'Corporate entity must disclose Ultimate Beneficial Owners (UBOs) to purchase this asset.',
        requiresManualReview: false,
        metadata: {
          missingInformation: 'ULTIMATE_BENEFICIAL_OWNERS'
        }
      };
    }

    if (transaction.assetType === 'campaign_contribution') {
      return {
        isPassed: false,
        ruleName: this.name,
        message: 'Corporations are strictly prohibited from making direct contributions to federal candidates under 52 U.S.C. § 30118.',
        requiresManualReview: false,
        metadata: {
          corporateContributionProhibited: true
        }
      };
    }

    if (transaction.amountUSD >= 5000) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: `Corporate purchase of $${transaction.amountUSD} flagged for corporate resolution and UBO verification.`,
        requiresManualReview: true,
        metadata: {
          beneficialOwnersCount: details.beneficialOwners.length,
          registrationCountry: details.registrationCountry
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'Corporate ownership verification passed.',
      requiresManualReview: false,
      metadata: {
        beneficialOwners: details.beneficialOwners
      }
    };
  }
}