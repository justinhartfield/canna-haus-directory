
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
    console.log(`Total items retrieved: ${items.length}`);
    
    // Identify exact duplicates
    const duplicateIds = identifyExactDuplicates(items);
    console.log(`Identified ${duplicateIds.length} duplicates to remove: ${duplicateIds.join(', ')}`);
    
    if (duplicateIds.length === 0) {
      return { removedCount: 0, removedIds: [] };
    }
    
    // Process each duplicate ID individually to ensure they all get deleted
    const removedIds: string[] = [];
    
    for (const id of duplicateIds) {
      console.log(`Attempting to delete item with ID: ${id}`);
      const { error } = await apiClient.delete(TABLE_NAME, id);
      
      if (error) {
        console.error(`Error deleting duplicate with ID ${id}:`, error);
      } else {
        console.log(`Successfully deleted item with ID: ${id}`);
        removedIds.push(id);
      }
    }
    
    console.log(`Successfully removed ${removedIds.length} duplicates`);
    
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
    
    console.log(`Attempting to remove ${ids.length} specified duplicate ids: ${ids.join(', ')}`);
    const removedIds: string[] = [];
    
    for (const id of ids) {
      console.log(`Attempting to delete item with ID: ${id}`);
      const { error } = await apiClient.delete(TABLE_NAME, id);
      
      if (error) {
        console.error(`Error deleting record with ID ${id}:`, error);
      } else {
        console.log(`Successfully deleted item with ID: ${id}`);
        removedIds.push(id);
      }
    }
    
    console.log(`Successfully removed ${removedIds.length} specified duplicates`);
    
    return {
      removedCount: removedIds.length,
      removedIds
    };
  } catch (error) {
    console.error('Error in removeDuplicatesByIds:', error);
    throw error;
  }
}
