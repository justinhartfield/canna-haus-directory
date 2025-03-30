
/**
 * This file now re-exports all functionality from the new modular transform utilities.
 * Kept for backward compatibility.
 */

export {
  transformData,
  transformDataRow,
  normalizeString,
  normalizeNumber,
  normalizeBoolean,
  validateRequiredField
} from './transform';
export type { ProcessingResult } from './transform/core';

// Import the generateJsonLd function from mappingUtils to re-export
import { generateJsonLd } from './mappingUtils';
export { generateJsonLd };
