
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig } from '../mappingUtils';
import { transformData } from '../transformUtils';
import { processBatchFiles } from '../importUtils';

/**
 * Metadata structure for folder processing
 */
export interface FolderMetadata {
  folderName: string;
  sourceType: string;
  lastProcessed: string;
  fileCount: number;
  itemCount: number;
  schemaType: string;
}

/**
 * Configuration for data source folders
 */
export interface FolderProcessingConfig {
  folderName: string;
  mappingConfig: DataMappingConfig;
  validationRules: Record<string, (value: any) => boolean>;
  incrementalOnly?: boolean;
  transformationRules?: Record<string, (data: any) => any>;
  schemaType: string;
}

/**
 * Results from folder processing
 */
export interface FolderProcessingResult {
  folderName: string;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  metadata: FolderMetadata;
  errors: Array<{
    file: string;
    errors: Array<{
      row: number;
      message: string;
    }>;
  }>;
}

/**
 * Process files in a folder structure with specialized configurations
 */
export async function processFolderData(
  files: File[],
  folderConfig: FolderProcessingConfig,
  existingMetadata?: FolderMetadata,
  onProgress?: (current: number, total: number) => void
): Promise<FolderProcessingResult> {
  // Initialize folder metadata
  let metadata: FolderMetadata = existingMetadata || {
    folderName: folderConfig.folderName,
    sourceType: 'import',
    lastProcessed: '',
    fileCount: 0,
    itemCount: 0,
    schemaType: folderConfig.schemaType
  };
  
  // Filter files for incremental loading if needed
  let filesToProcess = files;
  if (folderConfig.incrementalOnly && existingMetadata) {
    const lastProcessedDate = new Date(existingMetadata.lastProcessed);
    filesToProcess = files.filter(file => {
      const fileModified = new Date(file.lastModified);
      return fileModified > lastProcessedDate;
    });
    
    console.log(`Incremental processing: ${filesToProcess.length} of ${files.length} files are new or modified since last run.`);
  }
  
  // If no files to process, return early
  if (filesToProcess.length === 0) {
    return {
      folderName: folderConfig.folderName,
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: files.length,
      metadata,
      errors: []
    };
  }
  
  // Apply specialized transformations if specified
  let enhancedMappingConfig = { ...folderConfig.mappingConfig };
  if (folderConfig.transformationRules) {
    enhancedMappingConfig.transformations = {
      ...(enhancedMappingConfig.transformations || {}),
      ...folderConfig.transformationRules
    };
  }
  
  // Set schema type for JSON-LD
  enhancedMappingConfig.schemaType = folderConfig.schemaType;
  
  // Process files with the specialized configuration
  const result = await processBatchFiles(
    filesToProcess,
    enhancedMappingConfig,
    100, // Default batch size
    onProgress,
    folderConfig.validationRules
  );
  
  // Update metadata
  metadata = {
    ...metadata,
    lastProcessed: new Date().toISOString(),
    fileCount: result.processedFiles,
    itemCount: metadata.itemCount + result.successRows,
    schemaType: folderConfig.schemaType
  };
  
  return {
    folderName: folderConfig.folderName,
    processed: result.totalRows,
    succeeded: result.successRows,
    failed: result.totalRows - result.successRows,
    skipped: files.length - filesToProcess.length,
    metadata,
    errors: result.errors
  };
}

/**
 * Create a specialized configuration for a data category/folder
 */
export function createFolderConfig(
  folderName: string,
  schemaType: string,
  columnMappings: Record<string, string>,
  customValidationRules?: Record<string, (value: any) => boolean>,
  incrementalOnly: boolean = false
): FolderProcessingConfig {
  // Get validation rules based on schema type or use custom rules
  const validationRules = customValidationRules || 
    (validationPresets[schemaType.toLowerCase()] || validationPresets.product);
  
  return {
    folderName,
    schemaType,
    incrementalOnly,
    validationRules,
    mappingConfig: {
      columnMappings,
      defaultValues: {
        category: folderName
      },
      schemaType
    }
  };
}

// We need to import validation presets but they'll be in a separate file
// This is a temporary object to make TypeScript happy
// It will be properly replaced with the import in the main file
const validationPresets: Record<string, Record<string, (value: any) => boolean>> = {
  product: {}
};
