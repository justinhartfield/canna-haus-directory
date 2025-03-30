
import { DirectoryItem } from '@/types/directory';
import { generateJsonLd } from './mappingUtils';
import { schemaTemplates } from './folder/schemaTemplates';
import { processFolderData as processFolderDataCore } from './folder/folderProcessCore';
import { cleanseData as cleanseDataImpl } from './folder/dataCleansing';
import { generateDataConsistencyReport as generateDataConsistencyReportImpl } from './folder/dataQuality';

export interface FolderMetadata {
  folderName: string;
  sourceType: 'import' | 'api' | 'manual';
  lastProcessed: string; // ISO date string
  fileCount: number;
  itemCount: number;
  schemaType: string;
}

export interface FolderProcessingConfig {
  folderName: string;
  schemaType: string;
  mappingConfig: {
    columnMappings: Record<string, string>;
    defaultValues: Record<string, any>;
  };
  validationRules?: Record<string, (value: any) => boolean>;
  incrementalMode?: boolean;
}

export interface FolderProcessingResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  metadata: FolderMetadata;
}

/**
 * Create a folder configuration for processing
 */
export function createFolderConfig(
  folderName: string,
  schemaType: string,
  columnMappings: Record<string, string>,
  validationRules?: Record<string, (value: any) => boolean>,
  incrementalMode: boolean = false
): FolderProcessingConfig {
  return {
    folderName,
    schemaType,
    mappingConfig: {
      columnMappings,
      defaultValues: {
        category: folderName
      }
    },
    validationRules,
    incrementalMode
  };
}

/**
 * Get a schema template for the given type
 */
export function getSchemaTemplate(schemaType: string): Record<string, any> {
  return schemaTemplates;
}

/**
 * Process folder data with the given configuration
 * @param files The files to process
 * @param config The folder configuration
 * @param metadata Optional existing metadata for incremental processing
 * @param onProgress Optional progress callback
 * @returns Processing result
 */
export async function processFolderData(
  files: File[],
  config: FolderProcessingConfig,
  metadata?: FolderMetadata | null,
  onProgress?: (current: number, total: number) => void
): Promise<FolderProcessingResult> {
  return processFolderDataCore(files, config, metadata, onProgress);
}

/**
 * Export cleansing data function from folder/dataCleansing
 */
export const cleanseData = cleanseDataImpl;

/**
 * Export data consistency report generator
 */
export const generateDataConsistencyReport = generateDataConsistencyReportImpl;

/**
 * Export cleansing functions
 */
export const cleansingFunctions = {
  normalizeText: (text: string) => text.trim(),
  capitalizeFirstLetter: (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  extractNumbers: (text: string) => {
    const matches = text.match(/\d+(\.\d+)?/g);
    return matches ? matches.join('') : '';
  }
};

/**
 * Export schema templates
 */
export { schemaTemplates };
