
import { DirectoryItem, ImportProgress } from '@/types/directory';
import { bulkInsertDirectoryItems } from '@/api/services/directoryItem/bulkOperations';
import { parseFileContent } from '../fileProcessing';
import { DataMappingConfig } from '../mappingUtils';
import { transformData, ProcessingResult } from '../transformUtils';
import { getNestedProperty } from './helpers';
import { BatchProcessResult } from './types';

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
): Promise<BatchProcessResult> {
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
  
  // Fix: Add check for empty files
  if (files.length === 0) {
    return result;
  }
  
  // Process files sequentially to avoid memory issues
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i+1}/${files.length}: ${file.name}`);
    
    try {
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
        // Fix: Add try/catch for validation
        try {
          const validatedItems = fileResult.items.filter(item => {
            for (const [field, validator] of Object.entries(validationRules)) {
              try {
                const value = getNestedProperty(item, field);
                if (!validator(value)) {
                  result.validationFailures = (result.validationFailures || 0) + 1;
                  return false;
                }
              } catch (validationError) {
                console.error(`Error validating field ${field}:`, validationError);
                result.validationFailures = (result.validationFailures || 0) + 1;
                return false;
              }
            }
            return true;
          });
          
          // Update the success count based on validation
          result.successRows = result.successRows - (fileResult.items.length - validatedItems.length);
          fileResult.items = validatedItems;
        } catch (validationError) {
          console.error("Error during validation:", validationError);
          result.errorCount++;
          result.errors.push({
            file: file.name,
            errors: [{
              row: -1,
              message: `Validation error: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`
            }]
          });
        }
      }
      
      // If we have successful items, import them in batches
      if (fileResult.items.length > 0) {
        // Process in batches to avoid memory issues
        for (let j = 0; j < fileResult.items.length; j += batchSize) {
          try {
            const batch = fileResult.items.slice(j, j + batchSize);
            // Fix: Add guard for empty batches
            if (batch.length === 0) continue;
            
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
    } catch (fileError) {
      console.error(`Error processing file ${file.name}:`, fileError);
      result.errorCount++;
      result.errors.push({
        file: file.name,
        errors: [{
          row: -1,
          message: `File processing error: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
        }]
      });
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  result.success = result.processedFiles > 0 && result.errorCount < result.totalFiles;
  return result;
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
