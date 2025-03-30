
import { schemaTemplates } from './folderProcessingUtils';

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  enhancedData?: Record<string, any>;
}

/**
 * Validation rule for schema properties
 */
export interface SchemaValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  format?: 'url' | 'email' | 'date' | 'datetime';
  allowEmpty?: boolean;
  enum?: any[];
}

/**
 * Validation rule set for a schema
 */
export type SchemaValidationRules = Record<string, SchemaValidationRule>;

/**
 * Standard validation rule sets for schema.org types
 */
export const standardValidationRules: Record<string, SchemaValidationRules> = {
  Product: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'brand.name': { type: 'string', allowEmpty: true },
    'offers.price': { type: 'string', allowEmpty: true },
    'offers.priceCurrency': { type: 'string', enum: ['USD', 'EUR', 'GBP', 'CAD'], allowEmpty: true }
  },
  
  Article: {
    'headline': { required: true, type: 'string', minLength: 5, maxLength: 110 },
    'description': { required: true, type: 'string', minLength: 10 },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'datePublished': { type: 'string', format: 'date', allowEmpty: true },
    'author.name': { type: 'string', allowEmpty: false }
  },
  
  Person: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'jobTitle': { type: 'string', allowEmpty: true },
    'affiliation.name': { type: 'string', allowEmpty: true }
  },
  
  Organization: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'url': { type: 'string', format: 'url', allowEmpty: true },
    'logo': { type: 'string', format: 'url', allowEmpty: true },
    'contactPoint.telephone': { type: 'string', allowEmpty: true },
    'contactPoint.email': { type: 'string', format: 'email', allowEmpty: true }
  },
  
  LocalBusiness: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'address.streetAddress': { type: 'string', allowEmpty: true },
    'address.addressLocality': { type: 'string', allowEmpty: true },
    'address.addressRegion': { type: 'string', allowEmpty: true },
    'address.postalCode': { type: 'string', allowEmpty: true },
    'telephone': { type: 'string', allowEmpty: true }
  },
  
  MedicalEntity: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'code.codeValue': { type: 'string', allowEmpty: true },
    'code.codingSystem': { type: 'string', allowEmpty: true }
  },
  
  Drug: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'activeIngredient': { type: 'string', allowEmpty: true },
    'administrationRoute': { type: 'string', allowEmpty: true },
    'nonProprietaryName': { type: 'string', allowEmpty: true },
    'drugClass': { type: 'string', allowEmpty: true }
  }
};

/**
 * Get a validation rule set for a specific schema type
 */
export function getValidationRules(schemaType: string): SchemaValidationRules {
  return standardValidationRules[schemaType] || standardValidationRules.Product;
}

/**
 * Validate data against schema.org standards
 */
export function validateSchemaData(
  data: Record<string, any>,
  schemaType: string,
  customRules?: SchemaValidationRules
): SchemaValidationResult {
  const rules = customRules || getValidationRules(schemaType);
  const template = schemaTemplates[schemaType] || schemaTemplates.Product;
  
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

/**
 * Helper function to validate a single field
 */
function validateField(
  value: any,
  rule: SchemaValidationRule,
  path: string
): { valid: boolean; error?: any; warning?: any } {
  // Check if required
  if (rule.required && (value === undefined || value === null || value === '')) {
    return {
      valid: false,
      error: {
        field: path,
        message: 'Field is required'
      }
    };
  }
  
  // Skip further validation if value is empty and field is not required
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { valid: true };
  }
  
  // Type validation
  if (rule.type) {
    const actualType = typeof value;
    if (rule.type === 'array' && !Array.isArray(value)) {
      return {
        valid: false,
        error: {
          field: path,
          message: `Expected array but got ${actualType}`,
          value
        }
      };
    } else if (rule.type !== 'array' && actualType !== rule.type) {
      return {
        valid: false,
        error: {
          field: path,
          message: `Expected ${rule.type} but got ${actualType}`,
          value
        }
      };
    }
  }
  
  // String validations
  if (rule.type === 'string' && typeof value === 'string') {
    // Length checks
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return {
        valid: false,
        error: {
          field: path,
          message: `String is too short (minimum length: ${rule.minLength})`,
          value
        }
      };
    }
    
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return {
        valid: false,
        error: {
          field: path,
          message: `String is too long (maximum length: ${rule.maxLength})`,
          value
        }
      };
    }
    
    // Pattern check
    if (rule.pattern && !rule.pattern.test(value)) {
      return {
        valid: false,
        error: {
          field: path,
          message: 'String does not match the required pattern',
          value
        }
      };
    }
    
    // Format checks
    if (rule.format) {
      if (rule.format === 'url' && !isValidUrl(value)) {
        return {
          valid: true, // URLs are not strict requirements
          warning: {
            field: path,
            message: 'String is not a valid URL',
            value
          }
        };
      }
      
      if (rule.format === 'email' && !isValidEmail(value)) {
        return {
          valid: true, // Emails are not strict requirements
          warning: {
            field: path,
            message: 'String is not a valid email address',
            value
          }
        };
      }
      
      if (rule.format === 'date' && !isValidDate(value)) {
        return {
          valid: true, // Dates are not strict requirements
          warning: {
            field: path,
            message: 'String is not a valid date',
            value
          }
        };
      }
    }
  }
  
  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    return {
      valid: false,
      error: {
        field: path,
        message: `Value must be one of: ${rule.enum.join(', ')}`,
        value
      }
    };
  }
  
  return { valid: true };
}

/**
 * Helper function to get nested object values using dot notation
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && typeof prev === 'object' ? prev[curr] : undefined;
  }, obj);
}

/**
 * Helper function to set nested object values using dot notation
 */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || current[part] === null || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

/**
 * Validate a URL string
 */
function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate an email string
 */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate a date string
 */
function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Enhance JSON-LD data to match schema.org requirements
 */
export function enhanceJsonLd(
  data: Record<string, any>,
  schemaType: string
): Record<string, any> {
  // Get the template for the schema type
  const template = schemaTemplates[schemaType] || schemaTemplates.Product;
  
  // Start with the context and type
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType
  };
  
  // Map common fields first
  if (data.title) jsonLd['name'] = data.title;
  if (data.description) jsonLd['description'] = data.description;
  if (data.imageUrl) jsonLd['image'] = data.imageUrl;
  
  // Add custom fields from the source data
  for (const [key, value] of Object.entries(data)) {
    // Skip fields we've already mapped
    if (['title', 'description', 'imageUrl', 'category', 'subcategory', 'tags'].includes(key)) {
      continue;
    }
    
    // Skip null/undefined values
    if (value === null || value === undefined) {
      continue;
    }
    
    // Convert to camelCase if needed
    const formattedKey = key
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part, index) => 
        index === 0 
          ? part.toLowerCase() 
          : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join('');
    
    // Add to the JSON-LD
    jsonLd[formattedKey] = value;
  }
  
  return jsonLd;
}
