
import { commonValidationRules } from '../importUtils';

/**
 * Preset validation rule sets for common data types
 */
export const validationPresets = {
  product: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'imageUrl': commonValidationRules.validUrl
  },
  article: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'content': commonValidationRules.nonEmptyString
  },
  person: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString
  },
  organization: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString
  },
  localbusiness: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'address': commonValidationRules.nonEmptyString
  },
  medicalentity: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'code': commonValidationRules.nonEmptyString
  },
  drug: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'activeIngredient': commonValidationRules.nonEmptyString
  }
};
