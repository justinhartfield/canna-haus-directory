
import { DataMappingConfig } from '../mapping/types';

/**
 * Validates the mapping configuration for required fields
 */
export function validateMappingConfig(
  mappingConfig: DataMappingConfig,
  result: { 
    success: boolean; 
    errors: Array<{ row: number; message: string; }>
  }
): boolean {
  // Validate mapping config
  if (!mappingConfig.columnMappings.title) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No column mapped to "title" field'
    });
  }
  
  if (!mappingConfig.columnMappings.description) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No column mapped to "description" field'
    });
  }
  
  return result.success;
}

/**
 * Add default values to mapping configuration if not present
 */
export function ensureDefaultValues(mappingConfig: DataMappingConfig): void {
  // Add default values if not present in the config
  if (!mappingConfig.defaultValues) {
    mappingConfig.defaultValues = {};
  }
  
  // Add fallback value for description to handle missing descriptions
  if (!mappingConfig.defaultValues.description) {
    mappingConfig.defaultValues.description = "No description provided";
  }
}

/**
 * Check for missing columns and create a mapping of them
 */
export function identifyMissingColumns(
  firstRow: Record<string, any>,
  columnMappings: Record<string, string>
): Map<string, string> {
  const missingColumnsMap = new Map<string, string>();
  
  for (const [targetField, sourceField] of Object.entries(columnMappings)) {
    if (!(sourceField in firstRow)) {
      // Track missing columns and their target fields
      missingColumnsMap.set(sourceField, targetField);
      console.warn(`Source field "${sourceField}" not found in data for mapping to "${targetField}"`);
    }
  }
  
  return missingColumnsMap;
}
