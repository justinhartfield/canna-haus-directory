
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

// Import the generateJsonLd function from mapping module to re-export
import { generateJsonLd } from './mapping/core';
export { generateJsonLd };
