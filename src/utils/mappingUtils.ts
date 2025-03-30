
/**
 * This file now re-exports all functionality from the new modular mapping utilities.
 * Kept for backward compatibility.
 */

export {
  createMappingConfigFromSample,
  generateJsonLd,
  formatJsonLdKey,
  validateRequiredField
} from './mapping';
export type { DataMappingConfig } from './mapping/types';
