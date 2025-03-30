
import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../core/supabaseClient";
import { transformDatabaseRowToDirectoryItem, transformDirectoryItemToDatabaseRow } from "../transformers/directoryTransformer";

const TABLE_NAME = 'directory_items';

/**
 * Fetches all directory items
 */
export async function getDirectoryItems(): Promise<DirectoryItem[]> {
  const { data, error } = await apiClient.select(TABLE_NAME);
  
  if (error) {
    console.error("Error fetching directory items:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}

/**
 * Fetches a directory item by ID
 */
export async function getDirectoryItemById(id: string): Promise<DirectoryItem | null> {
  const { data, error } = await apiClient.select(TABLE_NAME, {
    filters: { id },
    single: true
  });
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Item not found
      return null;
    }
    console.error("Error fetching directory item:", error);
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Fetches directory items by category
 */
export async function getDirectoryItemsByCategory(category: string): Promise<DirectoryItem[]> {
  const { data, error } = await apiClient.select(TABLE_NAME, {
    filters: { category }
  });
  
  if (error) {
    console.error("Error fetching directory items by category:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}

/**
 * Creates a new directory item
 */
export async function createDirectoryItem(item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DirectoryItem> {
  const databaseRow = transformDirectoryItemToDatabaseRow(item);
  
  const { data, error } = await apiClient.insert(TABLE_NAME, databaseRow);
  
  if (error) {
    console.error("Error creating directory item:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Updates an existing directory item
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>): Promise<DirectoryItem | null> {
  const updateData = transformDirectoryItemToDatabaseRow(item);
  
  const { data, error } = await apiClient.update(TABLE_NAME, id, updateData);
  
  if (error) {
    console.error("Error updating directory item:", error);
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Deletes a directory item
 */
export async function deleteDirectoryItem(id: string): Promise<boolean> {
  const { error } = await apiClient.delete(TABLE_NAME, id);
  
  if (error) {
    console.error("Error deleting directory item:", error);
    throw error;
  }
  
  return true;
}

/**
 * Bulk inserts directory items
 */
export async function bulkInsertDirectoryItems(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DirectoryItem[]> {
  // Format items for insertion - match database column naming
  const insertData = items.map(transformDirectoryItemToDatabaseRow);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select('*');
  
  if (error) {
    console.error("Error bulk inserting directory items:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}
