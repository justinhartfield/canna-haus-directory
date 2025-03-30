
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig } from '../mapping/types';
import { validateRequiredField } from './validation';
import { normalizeString } from './normalizers';
import { generateJsonLd } from '../mappingUtils';
import { ProcessingResult } from './types';
import { validateMappingConfig, ensureDefaultValues, identifyMissingColumns } from './mappingHelpers';
import { transformDataRow } from './itemTransformer';
import { enhanceRawItemWithPlaceholders } from './dataEnhancer';

/**
 * Transform raw data to structured directory items
 */
export function transformData(
  rawData: Record<string, any>[],
  mappingConfig: DataMappingConfig
): ProcessingResult {
  const result: ProcessingResult = {
    success: true,
    totalRows: rawData.length,
    processedRows: 0,
    processedFiles: 1,
    errorCount: 0,
    errors: [],
    items: [],
    missingColumns: [] // Initialize missing columns array
  };
  
  if (!rawData.length) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No data found in file'
    });
    return result;
  }
  
  // Validate mapping config
  if (!validateMappingConfig(mappingConfig, result)) {
    return result;
  }
  
  // Ensure default values are set
  ensureDefaultValues(mappingConfig);
  
  // Check for missing columns in the first row
  const firstRow = rawData[0];
  const missingColumnsMap = identifyMissingColumns(firstRow, mappingConfig.columnMappings);
  
  // Store missing columns in the result
  result.missingColumns = Array.from(missingColumnsMap.keys());
  
  // Process each row
  for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
    try {
      const rawItem = rawData[rowIndex];
      
      // Enhance raw item with placeholders for missing columns
      const enhancedRawItem = enhanceRawItemWithPlaceholders(rawItem, missingColumnsMap);
      
      // Transform the enhanced raw item
      const transformedItem = transformDataRow(enhancedRawItem, mappingConfig, rowIndex);
      result.items.push(transformedItem);
      result.processedRows++;
    } catch (error) {
      result.errorCount++;
      result.errors.push({
        row: rowIndex,
        message: error instanceof Error ? error.message : 'Unknown error during transformation',
        data: rawData[rowIndex]
      });
      
      // Only collect up to 20 error messages to avoid overwhelming the user
      if (result.errorCount >= 20) {
        result.errors.push({
          row: -1,
          message: `Additional errors found but not shown (${rawData.length - rowIndex - 1} rows remaining)`
        });
        break;
      }
    }
  }
  
  // If we have errors but still processed some rows, mark as success
  // This enables partial imports where some rows may fail
  result.success = result.processedRows > 0;
  return result;
}

// Re-export the transformDataRow function from itemTransformer
export { transformDataRow } from './itemTransformer';
