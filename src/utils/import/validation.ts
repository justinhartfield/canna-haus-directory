
/**
 * Create a validation rule set for data validation
 */
export function createValidationRules(rules: Record<string, (value: any) => boolean>): Record<string, (value: any) => boolean> {
  return rules;
}

/**
 * Common validation rules that can be used
 */
export const commonValidationRules = {
  nonEmptyString: (value: any) => typeof value === 'string' && value.trim().length > 0,
  validUrl: (value: any) => {
    if (!value) return true; // Optional URLs can be empty
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  positiveNumber: (value: any) => typeof value === 'number' && value > 0,
  arrayWithItems: (value: any) => Array.isArray(value) && value.length > 0,
  validJsonLd: (value: any) => 
    typeof value === 'object' && 
    value !== null && 
    '@context' in value && 
    '@type' in value
};
