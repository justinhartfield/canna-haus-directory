
// Re-export all folder processing utilities from their separate files
import { validationPresets } from './batch/validationPresets';

// Core processing
export {
  processFolderData,
  createFolderConfig
} from './folder/folderProcessCore';

// Types
export type {
  FolderMetadata,
  FolderProcessingConfig,
  FolderProcessingResult
} from './folder/folderProcessCore';

// Data cleansing
export {
  cleanseData,
  cleansingFunctions
} from './folder/dataCleansing';

// Data quality
export {
  generateDataConsistencyReport
} from './folder/dataQuality';

// Schema templates
export {
  schemaTemplates,
  getSchemaTemplate
} from './folder/schemaTemplates';
