import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../core/supabaseClient";
import { transformDatabaseRowToDirectoryItem, transformDirectoryItemToDatabaseRow } from "../transformers/directoryTransformer";
import { Database } from "@/integrations/supabase/types";

const TABLE_NAME = 'directory_items' as const;

// Define type for database insertion compatible with Supabase types
// Use 'any' temporarily since directory_items is not in the Database type yet
type DirectoryItemInsert = any; // This would normally be Database['public']['Tables']['directory_items']['Insert']

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
  const transformedData: DirectoryItem[] = Array.isArray(data) 
    ? data.map(transformDatabaseRowToDirectoryItem)
    : [];
  
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
  const transformedData: DirectoryItem[] = Array.isArray(data) 
    ? data.map(transformDatabaseRowToDirectoryItem)
    : [];
  
  return transformedData;
}

/**
 * Checks if an item with the same title and category already exists
 * @returns true if a duplicate exists, false otherwise
 */
export async function checkForDuplicate(title: string, category: string): Promise<boolean> {
  try {
    const { data, error } = await apiClient.select(TABLE_NAME, {
      filters: { title, category }
    });
    
    if (error) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
    
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error("Error in checkForDuplicate:", err);
    // If there's an error checking, assume no duplicates instead of blocking the flow
    return false;
  }
}

/**
 * Creates a new directory item
 */
export async function createDirectoryItem(item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DirectoryItem> {
  // Ensure required fields are present
  if (!item.title || !item.description || !item.category) {
    throw new Error("Missing required fields: title, description and category are required");
  }
  
  // Check for duplicates
  const isDuplicate = await checkForDuplicate(item.title, item.category);
  if (isDuplicate) {
    throw new Error(`An item with title "${item.title}" in category "${item.category}" already exists`);
  }
  
  const databaseRow = transformDirectoryItemToDatabaseRow(item) as DirectoryItemInsert;
  
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
  // If title or category is being updated, check for duplicates
  if ((item.title || item.category) && item.title && item.category) {
    // Get the current item to ensure we're not checking against itself
    const currentItem = await getDirectoryItemById(id);
    if (!currentItem) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    // Only check for duplicates if title or category is changing
    if (item.title !== currentItem.title || item.category !== currentItem.category) {
      const isDuplicate = await checkForDuplicate(item.title, item.category);
      if (isDuplicate) {
        throw new Error(`An item with title "${item.title}" in category "${item.category}" already exists`);
      }
    }
  }
  
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
 * Check for duplicates in a batch of items
 * Returns an array of duplicate items with error messages
 */
export async function checkBatchForDuplicates(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}>> {
  const duplicates: Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}> = [];
  
  try {
    // Fix: Add early return for empty items array
    if (!items || items.length === 0) {
      return [];
    }
    
    // First check for duplicates within the batch itself
    const titleCategoryPairs = new Set<string>();
    
    for (const item of items) {
      if (!item.title || !item.category) {
        duplicates.push({
          item,
          error: "Missing required fields: title and category are required"
        });
        continue;
      }
      
      // Fix: Add null check and string conversion
      const title = String(item.title).toLowerCase();
      const category = String(item.category).toLowerCase();
      const key = `${title}-${category}`;
      
      if (titleCategoryPairs.has(key)) {
        duplicates.push({
          item,
          error: `Duplicate item in batch: "${item.title}" in category "${item.category}"`
        });
      } else {
        titleCategoryPairs.add(key);
      }
    }
    
    // Fix: Limit the database checks to avoid performance issues
    // Only check the first 50 items against the database
    const itemsToCheck = items.slice(0, 50).filter(item => 
      !duplicates.some(d => d.item === item) && item.title && item.category
    );
    
    // Then check against the database for each unique title-category pair
    // Fix: Use Promise.all for parallel checks to improve performance
    const checkPromises = itemsToCheck.map(async (item) => {
      try {
        if (await checkForDuplicate(String(item.title), String(item.category))) {
          return {
            item,
            error: `An item with title "${item.title}" in category "${item.category}" already exists in the database`
          };
        }
        return null;
      } catch (error) {
        console.error("Error checking for duplicates:", error);
        // If check fails, assume it's not a duplicate to allow the flow to continue
        return null;
      }
    });
    
    const results = await Promise.all(checkPromises);
    duplicates.push(...results.filter(Boolean) as Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}>);
    
    return duplicates;
  } catch (error) {
    console.error("Fatal error in checkBatchForDuplicates:", error);
    // Return empty array to allow the flow to continue
    return [];
  }
}

/**
 * Bulk inserts directory items
 */
export async function bulkInsertDirectoryItems(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DirectoryItem[]> {
  // Fix: Add early return for empty items array
  if (!items || items.length === 0) {
    return [];
  }
  
  // Fix: Add try/catch around validation
  try {
    // Validate required fields for all items
    for (const item of items) {
      if (!item.title || !item.description || !item.category) {
        throw new Error("All items must have title, description and category");
      }
      
      // Ensure additionalFields is an object, not null
      if (!item.additionalFields) {
        item.additionalFields = {};
      }
      
      // Ensure metaData is an object, not null
      if (!item.metaData) {
        item.metaData = {};
      }
    }
    
    // Check for duplicates with a timeout to avoid hanging
    let duplicates: Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}> = [];
    
    // Fix: Use a timeout for duplicate checking to prevent hanging
    const duplicateCheckPromise = new Promise<Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}>>(async (resolve) => {
      try {
        const result = await checkBatchForDuplicates(items);
        resolve(result);
      } catch (error) {
        console.error("Error in duplicate check:", error);
        resolve([]); // Return empty array if duplicate check fails
      }
    });
    
    // Set a timeout for duplicate checking
    const timeoutPromise = new Promise<Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}>>((resolve) => {
      setTimeout(() => {
        console.warn("Duplicate check timed out, continuing with import");
        resolve([]);
      }, 5000); // 5 second timeout
    });
    
    // Use Promise.race to handle timeout
    duplicates = await Promise.race([duplicateCheckPromise, timeoutPromise]);
    
    if (duplicates.length > 0) {
      const errorMessage = `Found ${duplicates.length} duplicate items. First error: ${duplicates[0].error}`;
      console.error("Duplicate items detected:", duplicates);
      throw new Error(errorMessage);
    }
    
    try {
      console.log(`Attempting to insert ${items.length} items`);
      
      // Format items for insertion - match database column naming
      const insertData = items.map(item => {
        const dbItem = transformDirectoryItemToDatabaseRow(item);
        return dbItem as DirectoryItemInsert;
      });
      
      // Check the first item for debugging
      if (insertData.length > 0) {
        console.log('Sample item for insertion:', JSON.stringify(insertData[0]));
      }
      
      const { data, error } = await apiClient.bulkInsert(TABLE_NAME, insertData);
      
      if (error) {
        console.error("Error bulk inserting directory items:", error);
        throw error;
      }
      
      // Transform the data to match our DirectoryItem interface
      const transformedData: DirectoryItem[] = Array.isArray(data) 
        ? data.map(transformDatabaseRowToDirectoryItem)
        : [];
      
      return transformedData;
    } catch (error) {
      console.error("Error bulk inserting directory items:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in bulk insert validation:", error);
    throw error;
  }
}
