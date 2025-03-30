
import { apiClient } from '../../core/supabaseClient';
import { getDirectoryItems } from './crudOperations';
import { identifyExactDuplicates, groupDuplicatesForReview } from '@/utils/deduplication/duplicateRemoval';
import { DirectoryItem } from '@/types/directory';
import { toast } from 'sonner';

const TABLE_NAME = 'directory_items' as const;

/**
 * Automatically identify and remove exact duplicate records
 * This is for exact duplicates that can be safely removed
 */
export async function removeExactDuplicates(): Promise<{
  removedCount: number;
  removedIds: string[];
}> {
  try {
    // Fetch all directory items
    const items = await getDirectoryItems();
    
    // Identify exact duplicates
    const duplicateIds = identifyExactDuplicates(items);
    
    if (duplicateIds.length === 0) {
      return { removedCount: 0, removedIds: [] };
    }
    
    // Batch delete the duplicates
    // Process in batches of 10 to avoid overwhelming the database
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < duplicateIds.length; i += batchSize) {
      const batch = duplicateIds.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    // Process batches sequentially
    const removedIds: string[] = [];
    
    for (const batch of batches) {
      for (const id of batch) {
        const { error } = await apiClient.delete(TABLE_NAME, id);
        
        if (error) {
          console.error(`Error deleting duplicate with ID ${id}:`, error);
        } else {
          removedIds.push(id);
        }
      }
    }
    
    return {
      removedCount: removedIds.length,
      removedIds
    };
  } catch (error) {
    console.error('Error in removeExactDuplicates:', error);
    throw error;
  }
}

/**
 * Get groups of potential duplicates for manual review
 */
export async function getDuplicatesForReview(): Promise<Array<{
  primaryRecord: DirectoryItem;
  duplicates: DirectoryItem[];
}>> {
  try {
    // Fetch all directory items
    const items = await getDirectoryItems();
    
    // Group potential duplicates for review
    return groupDuplicatesForReview(items);
  } catch (error) {
    console.error('Error in getDuplicatesForReview:', error);
    throw error;
  }
}

/**
 * Remove specific duplicate records by ID
 */
export async function removeDuplicatesByIds(ids: string[]): Promise<{
  removedCount: number;
  removedIds: string[];
}> {
  try {
    if (ids.length === 0) {
      return { removedCount: 0, removedIds: [] };
    }
    
    const removedIds: string[] = [];
    
    for (const id of ids) {
      const { error } = await apiClient.delete(TABLE_NAME, id);
      
      if (error) {
        console.error(`Error deleting record with ID ${id}:`, error);
      } else {
        removedIds.push(id);
      }
    }
    
    return {
      removedCount: removedIds.length,
      removedIds
    };
  } catch (error) {
    console.error('Error in removeDuplicatesByIds:', error);
    throw error;
  }
}
