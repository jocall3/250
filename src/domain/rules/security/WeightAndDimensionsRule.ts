import { ValidationRule, ValidationResult } from '../rules-base';

/**
 * Rule validating the exact physical weight and dimensions to detect counterfeits.
 * Uses high-precision scales and calipers to ensure the bill is not a composite.
 */
export class WeightAndDimensionsRule implements ValidationRule<any> {
  async validate(data: any): Promise<ValidationResult> {
    const { weight, dimensions } = data;

    const TARGET_WEIGHT = 1.10; // grams
    const TARGET_WIDTH = 155.955; // mm
    const TARGET_HEIGHT = 66.294; // mm
    const TOLERANCE = 0.01;

    if (Math.abs(weight - TARGET_WEIGHT) > TOLERANCE) {
      return { 
        isValid: false, 
        error: `Weight mismatch. Expected ${TARGET_WEIGHT}g, got ${weight}g.` 
      };
    }

    if (Math.abs(dimensions.width - TARGET_WIDTH) > TOLERANCE || Math.abs(dimensions.height - TARGET_HEIGHT) > TOLERANCE) {
      return { 
        isValid: false, 
        error: 'Physical dimensions are outside of acceptable tolerance.' 
      };
    }

    return { isValid: true };
  }
}