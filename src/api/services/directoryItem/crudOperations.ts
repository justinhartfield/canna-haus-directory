
import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../../core/supabaseClient";

const TABLE_NAME = 'directory_items' as const;

/**
 * Get all directory items
 */
export async function getDirectoryItems(): Promise<DirectoryItem[]> {
  try {
    const { data, error } = await apiClient.select(TABLE_NAME);
    
    if (error) {
      console.error("Error fetching directory items:", error);
      throw error;
    }
    
    return data as DirectoryItem[];
  } catch (error) {
    console.error("Error in getDirectoryItems:", error);
    throw error;
  }
}

/**
 * Get a single directory item by ID
 */
export async function getDirectoryItemById(id: string): Promise<DirectoryItem | null> {
  try {
    const { data, error } = await apiClient.select(TABLE_NAME, {
      filters: { id }
    });
    
    if (error) {
      console.error(`Error fetching directory item with ID ${id}:`, error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0] as DirectoryItem : null;
  } catch (error) {
    console.error(`Error in getDirectoryItemById(${id}):`, error);
    throw error;
  }
}

/**
 * Get directory items by category
 */
export async function getDirectoryItemsByCategory(category: string): Promise<DirectoryItem[]> {
  try {
    const { data, error } = await apiClient.select(TABLE_NAME, {
      filters: { category }
    });
    
    if (error) {
      console.error(`Error fetching directory items for category ${category}:`, error);
      throw error;
    }
    
    return data as DirectoryItem[];
  } catch (error) {
    console.error(`Error in getDirectoryItemsByCategory(${category}):`, error);
    throw error;
  }
}

/**
 * Update a directory item
 */
export async function updateDirectoryItem(
  id: string, 
  data: Partial<DirectoryItem>
): Promise<DirectoryItem> {
  try {
    const { data: updatedItem, error } = await apiClient.update(TABLE_NAME, id, data);
    
    if (error) {
      console.error(`Error updating directory item with ID ${id}:`, error);
      throw error;
    }
    
    return updatedItem as DirectoryItem;
  } catch (error) {
    console.error(`Error in updateDirectoryItem(${id}):`, error);
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
      console.error(`Error deleting directory item with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteDirectoryItem(${id}):`, error);
    throw error;
  }
}
