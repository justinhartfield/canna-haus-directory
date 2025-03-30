
import type { SchemaValidationRule } from './validationTypes';

/**
 * Helper function to validate a single field
 */
export function validateField(
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
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && typeof prev === 'object' ? prev[curr] : undefined;
  }, obj);
}

/**
 * Helper function to set nested object values using dot notation
 */
export function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
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
export function isValidUrl(value: string): boolean {
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
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate a date string
 */
export function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}
