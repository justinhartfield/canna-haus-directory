
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
