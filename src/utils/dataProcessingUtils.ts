
/**
 * Re-export all data processing utilities from their separate files
 * This maintains backwards compatibility with existing imports
 */

// File processing utilities
export {
  detectFileType,
  sampleFileContent,
  parseFileContent
} from './fileProcessing';
export type { SupportedFileType } from './fileProcessing';

// Mapping utilities
export {
  createMappingConfigFromSample,
  generateJsonLd,
  formatJsonLdKey,
  validateRequiredField
} from './mapping';
export type { DataMappingConfig } from './mapping/types';

// Transformation utilities
export {
  transformData,
  transformDataRow,
  normalizeString,
  normalizeNumber,
  normalizeBoolean
} from './transform';
export type { ProcessingResult } from './transform';

// Import utilities
export {
  processFileContent,
  processBatchFiles,
  updateImportProgress,
  commonValidationRules
} from './importUtils';

// Batch processing utilities
export {
  advancedBatchProcessing,
  generateProcessingReport,
  validationPresets,
  dataCleansingFunctions,
  applyDataCleansing,
  incrementalBatchProcessing,
  generateDataQualityMetrics
} from './batchProcessingUtils';
export type { BatchProcessingConfig } from './batchProcessingUtils';

// Folder processing utilities
export {
  processFolderData,
  createFolderConfig,
  cleanseData,
  generateDataConsistencyReport,
  cleansingFunctions,
  schemaTemplates,
  getSchemaTemplate
} from './folderProcessingUtils';
export type { 
  FolderMetadata,
  FolderProcessingConfig,
  FolderProcessingResult
} from './folderProcessingUtils';

// Schema validation utilities
export {
  validateSchemaData,
  enhanceJsonLd,
  getValidationRules
} from './schemaValidationUtils';
export type {
  SchemaValidationResult,
  SchemaValidationRule,
  SchemaValidationRules
} from './schemaValidationUtils';
