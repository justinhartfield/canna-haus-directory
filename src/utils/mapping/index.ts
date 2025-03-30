
/**
 * Re-export all mapping utilities for backward compatibility
 */

// Core mapping functions
export {
  createMappingConfigFromSample,
  generateJsonLd,
  formatJsonLdKey
} from './core';

// Validation utility
export {
  validateRequiredField
} from './validation';

// Types
export type { DataMappingConfig } from './types';

