
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
} from './mappingUtils';
export type { DataMappingConfig } from './mappingUtils';

// Transformation utilities
export {
  transformData,
  transformDataRow,
  normalizeString,
  normalizeNumber,
  normalizeBoolean
} from './transformUtils';
export type { ProcessingResult } from './transformUtils';

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
