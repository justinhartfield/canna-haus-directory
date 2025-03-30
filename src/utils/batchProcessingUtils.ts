
import { DataMappingConfig } from './mappingUtils';
import { processBatchFiles, updateImportProgress, commonValidationRules } from './importUtils';
import { DirectoryItem, ImportProgress } from '@/types/directory';

/**
 * Configuration for batch processing
 */
export interface BatchProcessingConfig {
  files: File[];
  mappingConfig: DataMappingConfig;
  batchSize: number;
  validationRules?: Record<string, (value: any) => boolean>;
  continueOnError?: boolean;
  onProgress?: (current: number, total: number) => void;
  onBatchComplete?: (batchResult: any) => void;
}

/**
 * Process multiple files in batches with advanced options
 */
export async function advancedBatchProcessing({
  files,
  mappingConfig,
  batchSize = 100,
  validationRules,
  continueOnError = true,
  onProgress,
  onBatchComplete
}: BatchProcessingConfig): Promise<{
  success: boolean;
  stats: {
    totalFiles: number;
    processedFiles: number;
    totalRows: number;
    successRows: number;
    failedRows: number;
    validationFailures?: number;
  };
  errors: Array<{ file: string; errors: Array<{ row: number; message: string }> }>;
  completed: boolean;
}> {
  // Process all files
  try {
    const result = await processBatchFiles(
      files,
      mappingConfig,
      batchSize,
      onProgress,
      validationRules
    );
    
    if (onBatchComplete) {
      onBatchComplete(result);
    }
    
    return {
      success: result.success || continueOnError,
      stats: {
        totalFiles: result.totalFiles,
        processedFiles: result.processedFiles,
        totalRows: result.totalRows,
        successRows: result.successRows,
        failedRows: result.totalRows - result.successRows,
        validationFailures: result.validationFailures
      },
      errors: result.errors,
      completed: true
    };
  } catch (error) {
    console.error("Fatal error during batch processing:", error);
    return {
      success: false,
      stats: {
        totalFiles: files.length,
        processedFiles: 0,
        totalRows: 0,
        successRows: 0,
        failedRows: 0
      },
      errors: [{
        file: 'Batch processing',
        errors: [{
          row: -1,
          message: error instanceof Error ? error.message : 'Unknown fatal error'
        }]
      }],
      completed: false
    };
  }
}

/**
 * Generate a report from batch processing results
 */
export function generateProcessingReport(
  result: any
): {
  summary: string;
  details: string;
  successRate: number;
} {
  const { stats, errors } = result;
  
  // Calculate success rate
  const successRate = stats.totalRows > 0 
    ? (stats.successRows / stats.totalRows) * 100 
    : 0;
  
  // Generate summary
  const summary = `Processed ${stats.processedFiles} of ${stats.totalFiles} files, with ${stats.successRows} of ${stats.totalRows} rows successfully imported (${successRate.toFixed(2)}%).`;
  
  // Generate detailed error report
  let details = '';
  if (errors.length > 0) {
    details = errors.map(fileError => {
      return `File: ${fileError.file}\n${fileError.errors.map(err => `  Row ${err.row >= 0 ? err.row + 1 : 'N/A'}: ${err.message}`).join('\n')}`;
    }).join('\n\n');
  }
  
  return {
    summary,
    details,
    successRate
  };
}

/**
 * Preset validation rule sets for common data types
 */
export const validationPresets = {
  product: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'imageUrl': commonValidationRules.validUrl
  },
  article: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString,
    'content': commonValidationRules.nonEmptyString
  },
  person: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString
  },
  organization: {
    'title': commonValidationRules.nonEmptyString,
    'description': commonValidationRules.nonEmptyString
  }
};
