import { Rule, RuleContext, RuleResult } from '../Rule';

export class AgeRestrictionRule implements Rule {
  public readonly name = 'AgeRestrictionRule';
  private static readonly MINIMUM_AGE = 18;

  public async evaluate(context: RuleContext): Promise<RuleResult> {
    const { collector } = context;

    if (collector.age < AgeRestrictionRule.MINIMUM_AGE) {
      return {
        isPassed: false,
        ruleName: this.name,
        message: `Collector age (${collector.age}) is below the minimum required age of ${AgeRestrictionRule.MINIMUM_AGE}.`,
        requiresManualReview: false,
        metadata: {
          collectorAge: collector.age,
          minimumAge: AgeRestrictionRule.MINIMUM_AGE
        }
      };
    }

    return {
      isPassed: true,
      ruleName: this.name,
      message: `Age verification passed. Collector is ${collector.age} years old.`,
      requiresManualReview: false
    };
  }
}