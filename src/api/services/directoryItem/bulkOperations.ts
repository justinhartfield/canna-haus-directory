
import { DirectoryItem } from '@/types/directory';
import { apiClient } from '../../core/supabaseClient';
import { checkBatchForDuplicates, checkForDuplicate } from './duplicateChecking';

const TABLE_NAME = 'directory_items' as const;

/**
 * Insert multiple directory items in a single batch
 */
export async function bulkInsertDirectoryItems(
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: DirectoryItem[]; errors: Array<{ item: any; error: string }> }> {
  try {
    const { data, error } = await apiClient.insertBatch(TABLE_NAME, items);
    
    if (error) {
      console.error('Error in bulk insert:', error);
      throw error;
    }
    
    return {
      success: data as DirectoryItem[],
      errors: []
    };
  } catch (error) {
    console.error('Error in bulkInsertDirectoryItems:', error);
    return {
      success: [],
      errors: [{ item: items, error: error instanceof Error ? error.message : String(error) }]
    };
  }
}

/**
 * Process a batch of items with duplicate checking
 */
export async function processBatchWithDuplicateHandling(
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>,
  options?: { skipDuplicateCheck?: boolean }
): Promise<{ 
  success: DirectoryItem[]; 
  errors: Array<{ item: any; error: string }>;
  duplicates: Array<{ item: any; error: string }>;
}> {
  try {
    // Skip duplicate check if requested
    const skipDuplicateCheck = options?.skipDuplicateCheck || false;
    
    let duplicates: Array<{ item: any; error: string }> = [];
    
    if (!skipDuplicateCheck) {
      duplicates = await checkBatchForDuplicates(items);
      
      // Filter out items that are duplicates
      items = items.filter(item => 
        !duplicates.some(d => 
          d.item.title === item.title && 
          d.item.category === item.category
        )
      );
    }
    
    // If no items left after duplicate filtering, return early
    if (items.length === 0) {
      return { 
        success: [], 
        errors: [],
        duplicates
      };
    }
    
    // Process the filtered items
    const result = await bulkInsertDirectoryItems(items);
    
    return {
      success: result.success,
      errors: result.errors,
      duplicates
    };
  } catch (error) {
    console.error('Error in processBatchWithDuplicateHandling:', error);
    return {
      success: [],
      errors: [{ 
        item: items, 
        error: error instanceof Error ? error.message : String(error) 
      }],
      duplicates: []
    };
  }
}

// Re-export functions from duplicateChecking.ts to maintain backward compatibility
export { checkBatchForDuplicates, checkForDuplicate };
