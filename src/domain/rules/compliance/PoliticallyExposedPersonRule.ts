import { Rule, RuleContext, RuleResult } from '../Rule';

export class PoliticallyExposedPersonRule implements Rule {
  public readonly name = 'PoliticallyExposedPersonRule';

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector } = context;

    if (collector.isPep) {
      return {
        isPassed: true,
        ruleName: this.name,
        message: `Collector ${collector.id} is identified as a Politically Exposed Person (PEP). Enhanced Due Diligence (EDD) and senior management approval are required.`,
        requiresManualReview: true,
        metadata: {
          pepStatus: 'ACTIVE',
          requiredAction: 'ENHANCED_DUE_DILIGENCE',
          riskRating: 'HIGH'
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: 'Politically Exposed Person (PEP) check passed. Collector is not a PEP.',
      requiresManualReview: false
    };
  }
}