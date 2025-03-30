
import { DirectoryItem } from "@/types/directory";
import { standardizeDirectoryItem } from "./standardizationFunctions";
import { updateDirectoryItem } from "@/api/services/directoryItem/crudOperations";
import { toast } from "sonner";

export interface BatchProcessingOptions {
  batchSize: number;
  pauseBetweenBatches: number;
  onProgress?: (processed: number, total: number) => void;
  onComplete?: (processed: number, failed: number) => void;
  onError?: (error: Error, item: DirectoryItem) => void;
}

export interface BatchProcessingResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Process directory items in batches, standardizing and updating them
 */
export async function batchProcessDirectoryItems(
  items: DirectoryItem[],
  options: BatchProcessingOptions = {
    batchSize: 10,
    pauseBetweenBatches: 1000
  }
): Promise<BatchProcessingResult> {
  const result: BatchProcessingResult = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };
  
  const totalItems = items.length;
  let processedCount = 0;
  
  // Process in batches
  for (let i = 0; i < totalItems; i += options.batchSize) {
    const batch = items.slice(i, i + options.batchSize);
    
    // Process each item in the batch
    const batchPromises = batch.map(async (item) => {
      try {
        // Apply standardization
        const standardizedItem = standardizeDirectoryItem(item);
        
        // Update the item in the database
        await updateDirectoryItem(item.id, standardizedItem);
        
        result.successful++;
        return { success: true };
      } catch (error) {
        result.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push({ id: item.id, error: errorMessage });
        
        if (options.onError) {
          options.onError(error instanceof Error ? error : new Error(errorMessage), item);
        }
        
        return { success: false, error };
      } finally {
        processedCount++;
        
        if (options.onProgress) {
          options.onProgress(processedCount, totalItems);
        }
      }
    });
    
    // Wait for all items in the batch to be processed
    await Promise.all(batchPromises);
    
    // Update the total processed count
    result.totalProcessed = processedCount;
    
    // Pause between batches to avoid overwhelming the database
    if (i + options.batchSize < totalItems) {
      await new Promise(resolve => setTimeout(resolve, options.pauseBetweenBatches));
    }
  }
  
  // Call the onComplete callback if provided
  if (options.onComplete) {
    options.onComplete(result.successful, result.failed);
  }
  
  return result;
}

/**
 * Process a single item and return the standardized version
 * (without saving to the database)
 */
export function processDirectoryItem(
  item: DirectoryItem
): { original: DirectoryItem; standardized: DirectoryItem } {
  const standardized = standardizeDirectoryItem(item);
  return {
    original: { ...item },
    standardized
  };
}

/**
 * Save a batch of standardized items to the database
 */
export async function saveBatchToDatabase(
  items: DirectoryItem[],
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }> {
  const result = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ id: string; error: string }>
  };
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      await updateDirectoryItem(item.id, item);
      result.success++;
    } catch (error) {
      result.failed++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push({ id: item.id, error: errorMessage });
    }
    
    if (onProgress) {
      onProgress(i + 1, items.length);
    }
  }
  
  return result;
}
