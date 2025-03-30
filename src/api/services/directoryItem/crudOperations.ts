
import { DirectoryItem, DirectoryFilter } from '@/types/directory';
import { apiClient } from '../../core/supabaseClient';
import { transformDatabaseRowToDirectoryItem, transformDirectoryItemToDatabaseRow } from '@/api/transformers/directoryTransformer';

const TABLE_NAME = 'directory_items' as const;

/**
 * Get directory items with optional filtering
 */
export async function getDirectoryItems(
  filters?: DirectoryFilter
): Promise<DirectoryItem[]> {
  try {
    const queryFilters: Record<string, any> = {};
    
    if (filters) {
      if (filters.category) {
        queryFilters.category = filters.category;
      }
      
      if (filters.subcategory) {
        queryFilters.subcategory = filters.subcategory;
      }
      
      // Add more filters as needed
    }
    
    const { data, error } = await apiClient.select(
      TABLE_NAME,
      { filters: Object.keys(queryFilters).length > 0 ? queryFilters : undefined }
    );
    
    if (error) {
      console.error('Error fetching directory items:', error);
      throw error;
    }
    
    // Transform data from database format to DirectoryItem
    return Array.isArray(data) 
      ? data.map(item => transformDatabaseRowToDirectoryItem(item)) 
      : [];
  } catch (error) {
    console.error('Error in getDirectoryItems:', error);
    throw error;
  }
}

/**
 * Get directory items by category
 */
export async function getDirectoryItemsByCategory(
  category: string
): Promise<DirectoryItem[]> {
  return getDirectoryItems({ category });
}

/**
 * Get a single directory item by ID
 */
export async function getDirectoryItemById(id: string): Promise<DirectoryItem> {
  try {
    const { data, error } = await apiClient.select(
      TABLE_NAME,
      { filters: { id }, single: true }
    );
    
    if (error) {
      console.error(`Error fetching directory item ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Directory item with id ${id} not found`);
    }
    
    return transformDatabaseRowToDirectoryItem(data);
  } catch (error) {
    console.error('Error in getDirectoryItemById:', error);
    throw error;
  }
}

/**
 * Create a new directory item
 */
export async function createDirectoryItem(
  item: Partial<DirectoryItem>
): Promise<DirectoryItem> {
  try {
    // Transform the item to match database column names
    const dbRow = transformDirectoryItemToDatabaseRow(item);
    
    const { data, error } = await apiClient.insert(TABLE_NAME, dbRow);
    
    if (error) {
      console.error('Error creating directory item:', error);
      throw error;
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No data returned from insert operation');
    }
    
    return transformDatabaseRowToDirectoryItem(data[0]);
  } catch (error) {
    console.error('Error in createDirectoryItem:', error);
    throw error;
  }
}

/**
 * Update an existing directory item
 */
export async function updateDirectoryItem(
  id: string,
  updates: Partial<DirectoryItem>
): Promise<DirectoryItem> {
  try {
    // Transform the updates to match database column names
    const dbUpdates = transformDirectoryItemToDatabaseRow(updates);
    
    console.log(`Updating directory item ${id} with:`, dbUpdates);
    
    const { data, error } = await apiClient.update(TABLE_NAME, id, dbUpdates);
    
    if (error) {
      console.error(`Error updating directory item ${id}:`, error);
      throw error;
    }
    
    // Check if data was returned
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Handle the case where no data is returned but the update was successful
      console.log(`Successfully updated item ${id}, but no data was returned. Fetching the updated item...`);
      
      // Fetch the updated item to return it
      return await getDirectoryItemById(id);
    }
    
    return transformDatabaseRowToDirectoryItem(data[0]);
  } catch (error) {
    console.error('Error in updateDirectoryItem:', error);
    throw error;
  }
}

/**
 * Delete a directory item
 */
export async function deleteDirectoryItem(id: string): Promise<void> {
  try {
    const { error } = await apiClient.delete(TABLE_NAME, id);
    
    if (error) {
      console.error(`Error deleting directory item ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteDirectoryItem:', error);
    throw error;
  }
}

/**
 * Search directory items by term
 */
export async function searchDirectoryItems(
  searchTerm: string,
  category?: string
): Promise<DirectoryItem[]> {
  try {
    // This is a simplified implementation
    // In a real app, you'd use a more sophisticated search mechanism
    const allItems = await getDirectoryItems(
      category ? { category } : undefined
    );
    
    const term = searchTerm.toLowerCase();
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  } catch (error) {
    console.error('Error in searchDirectoryItems:', error);
    throw error;
  }
}
