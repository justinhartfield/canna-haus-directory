
import { DirectoryItem, ImportProgress } from '@/types/directory';
import { bulkInsertDirectoryItems } from '@/api/directoryService';
import { parseFileContent } from './fileProcessing';
import { DataMappingConfig } from './mappingUtils';
import { transformData, ProcessingResult } from './transformUtils';

/**
 * Process file content into structured data
 */
export async function processFileContent(
  file: File,
  mappingConfig: DataMappingConfig
): Promise<ProcessingResult> {
  try {
    // Parse file to get raw data
    const rawData = await parseFileContent(file);
    
    // Transform raw data to structured directory items
    return transformData(rawData, mappingConfig);
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return {
      success: false,
      totalRows: 0,
      processedFiles: 1,
      processedRows: 0,
      errorCount: 1,
      errors: [
        {
          row: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      ],
      items: []
    };
  }
}

/**
 * Process and import a single file
 * This is used by the simple importer
 */
export async function processAndImportFile(
  file: File, 
  category: string
): Promise<{
  success: boolean;
  count: number;
  errors: string[];
}> {
  try {
    // Create a simple mapping config based on the category
    const mappingConfig: DataMappingConfig = {
      columnMappings: {},
      defaultValues: {
        category
      },
      schemaType: 'Thing'
    };
    
    // Process the file content
    const result = await processFileContent(file, mappingConfig);
    
    if (!result.success) {
      return {
        success: false,
        count: 0,
        errors: result.errors.map(e => e.message)
      };
    }
    
    // Import the processed items
    await bulkInsertDirectoryItems(result.items);
    
    return {
      success: true,
      count: result.items.length,
      errors: []
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Process a batch of files using a common mapping configuration
 */
export async function processBatchFiles(
  files: File[],
  mappingConfig: DataMappingConfig,
  batchSize: number = 100,
  onProgress?: (current: number, total: number) => void,
  validationRules?: Record<string, (value: any) => boolean>
): Promise<{
  success: boolean;
  totalFiles: number;
  processedFiles: number;
  totalRows: number;
  successRows: number;
  errorCount: number;
  errors: Array<{ file: string; errors: Array<{ row: number; message: string }> }>;
  validationFailures?: number;
}> {
  const result = {
    success: true,
    totalFiles: files.length,
    processedFiles: 0,
    totalRows: 0,
    successRows: 0,
    errorCount: 0,
    validationFailures: 0,
    errors: [] as Array<{ file: string; errors: Array<{ row: number; message: string }> }>
  };
  
  // Process files sequentially to avoid memory issues
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i+1}/${files.length}: ${file.name}`);
    
    const fileResult = await processFileContent(file, mappingConfig);
    
    result.processedFiles++;
    result.totalRows += fileResult.totalRows;
    result.successRows += fileResult.processedRows;
    
    if (fileResult.errorCount > 0) {
      result.errorCount += fileResult.errorCount;
      result.errors.push({
        file: file.name,
        errors: fileResult.errors.map(err => ({ row: err.row, message: err.message }))
      });
    }
    
    // Apply additional validation if rules are provided
    if (validationRules && fileResult.items.length > 0) {
      const validatedItems = fileResult.items.filter(item => {
        for (const [field, validator] of Object.entries(validationRules)) {
          const value = getNestedProperty(item, field);
          if (!validator(value)) {
            result.validationFailures = (result.validationFailures || 0) + 1;
            return false;
          }
        }
        return true;
      });
      
      // Update the success count based on validation
      result.successRows = result.successRows - (fileResult.items.length - validatedItems.length);
      fileResult.items = validatedItems;
    }
    
    // If we have successful items, import them in batches
    if (fileResult.items.length > 0) {
      // Process in batches to avoid memory issues
      for (let j = 0; j < fileResult.items.length; j += batchSize) {
        const batch = fileResult.items.slice(j, j + batchSize);
        try {
          await bulkInsertDirectoryItems(batch);
          console.log(`Imported batch ${Math.floor(j / batchSize) + 1} of file ${file.name}`);
        } catch (error) {
          console.error(`Error importing batch from file ${file.name}:`, error);
          result.errorCount++;
          result.errors.push({
            file: file.name,
            errors: [{
              row: -1,
              message: `Batch import error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }]
          });
        }
      }
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  result.success = result.errorCount === 0;
  return result;
}

/**
 * Helper function to get a nested property from an object using a dot-notation path
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Update import progress state
 */
export function updateImportProgress(
  currentProgress: ImportProgress,
  updates: Partial<ImportProgress>
): ImportProgress {
  return {
    ...currentProgress,
    ...updates
  };
}

/**
 * Create a validation rule set for data validation
 */
export function createValidationRules(rules: Record<string, (value: any) => boolean>): Record<string, (value: any) => boolean> {
  return rules;
}

/**
 * Common validation rules that can be used
 */
export const commonValidationRules = {
  nonEmptyString: (value: any) => typeof value === 'string' && value.trim().length > 0,
  validUrl: (value: any) => {
    if (!value) return true; // Optional URLs can be empty
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  positiveNumber: (value: any) => typeof value === 'number' && value > 0,
  arrayWithItems: (value: any) => Array.isArray(value) && value.length > 0,
  validJsonLd: (value: any) => 
    typeof value === 'object' && 
    value !== null && 
    '@context' in value && 
    '@type' in value
};
