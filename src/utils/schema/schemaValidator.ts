
import { getValidationRules } from './standardValidationRules';
import { validateField, getNestedValue, setNestedValue } from './validationUtils';
import type { SchemaValidationResult, SchemaValidationRules } from './validationTypes';

/**
 * Validate data against schema.org standards
 */
export function validateSchemaData(
  data: Record<string, any>,
  schemaType: string,
  template: Record<string, any>,
  customRules?: SchemaValidationRules
): SchemaValidationResult {
  const rules = customRules || getValidationRules(schemaType);
  
  const result: SchemaValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };
  
  // Create a new object following the schema template structure
  const enhancedData = { ...template };
  
  // Validate and populate the enhanced data
  for (const [path, rule] of Object.entries(rules)) {
    const value = getNestedValue(data, path);
    const isValid = validateField(value, rule, path);
    
    if (!isValid.valid) {
      result.valid = false;
      result.errors.push(isValid.error);
    }
    
    if (isValid.warning) {
      result.warnings.push(isValid.warning);
    }
    
    // Set the value in the enhanced data structure
    if (isValid.valid || !rule.required) {
      setNestedValue(enhancedData, path, value);
    }
  }
  
  // Add any additional fields from the original data 
  // that aren't part of the validation rules
  for (const [key, value] of Object.entries(data)) {
    if (!(key in template) && value !== undefined && value !== null) {
      enhancedData[key] = value;
    }
  }
  
  result.enhancedData = enhancedData;
  
  return result;
}
