
import { DirectoryItem } from '@/types/directory';
import { parseFileContent } from '../fileProcessing';
import { transformData } from '../transform';
import { DataMappingConfig } from '../mappingUtils';
import { bulkInsertDirectoryItems } from '@/api/services/directoryItem/bulkOperations';
import { FolderMetadata, FolderProcessingConfig, FolderProcessingResult } from '../folderProcessingUtils';

/**
 * Process a collection of files as a folder
 */
export async function processFolderData(
  files: File[],
  config: FolderProcessingConfig,
  metadata?: FolderMetadata | null,
  onProgress?: (current: number, total: number) => void
): Promise<FolderProcessingResult> {
  // Initialize counters
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;
  let startTime = Date.now();
  
  // Report initial progress
  if (onProgress) {
    onProgress(0, files.length);
  }

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Skip files that haven't changed if in incremental mode
        if (config.incrementalMode && metadata) {
          // We would need file modification time here, but File objects don't include this
          // In a real implementation, you might compare file hashes or modification times
          // For now, we'll process all files in this example
        }
        
        // Parse file content
        const rawData = await parseFileContent(file);
        
        if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
          console.warn(`File ${file.name} contains no valid data, skipping`);
          skipped++;
          continue;
        }
        
        // Create a mapping configuration
        const mappingConfig: DataMappingConfig = {
          columnMappings: config.mappingConfig.columnMappings,
          defaultValues: {
            ...config.mappingConfig.defaultValues,
            category: config.folderName
          },
          schemaType: config.schemaType
        };
        
        // Transform the data
        const result = await transformData(rawData, mappingConfig);
        
        if (result.success) {
          // Import the transformed items
          await bulkInsertDirectoryItems(result.items);
          
          processed += result.items.length;
          succeeded += result.items.length;
        } else {
          console.error(`Error transforming file ${file.name}:`, result.errors);
          failed++;
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        failed++;
      }
      
      // Report progress
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    }
    
    // Create updated metadata
    const updatedMetadata: FolderMetadata = {
      folderName: config.folderName,
      sourceType: 'import',
      lastProcessed: new Date().toISOString(),
      fileCount: files.length,
      itemCount: succeeded,
      schemaType: config.schemaType
    };
    
    return {
      processed,
      succeeded,
      failed,
      skipped,
      metadata: updatedMetadata
    };
  } catch (error) {
    console.error('Error in folder processing:', error);
    throw error;
  }
}
