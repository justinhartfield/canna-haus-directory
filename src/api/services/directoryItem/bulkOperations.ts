import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../../core/supabaseClient";

const TABLE_NAME = 'directory_items' as const;

/**
 * Create multiple directory items at once
 */
export async function createDirectoryItems(
  items: Partial<DirectoryItem>[]
): Promise<DirectoryItem[]> {
  try {
    const { data, error } = await apiClient.bulkInsert(TABLE_NAME, items);
    
    if (error) {
      console.error("Error creating directory items:", error);
      throw error;
    }
    
    return data as DirectoryItem[];
  } catch (error) {
    console.error("Error in createDirectoryItems:", error);
    throw error;
  }
}

/**
 * Update multiple directory items at once
 */
export async function updateDirectoryItems(
  items: Array<{ id: string; data: Partial<DirectoryItem> }>
): Promise<DirectoryItem[]> {
  try {
    // Since bulkUpdate doesn't exist, we'll update items one by one
    const results: DirectoryItem[] = [];
    
    for (const item of items) {
      const { data, error } = await apiClient.update(
        TABLE_NAME,
        item.id,
        item.data
      );
      
      if (error) {
        console.error(`Error updating directory item ${item.id}:`, error);
        throw error;
      }
      
      results.push(data as DirectoryItem);
    }
    
    return results;
  } catch (error) {
    console.error("Error in updateDirectoryItems:", error);
    throw error;
  }
}

/**
 * Delete multiple directory items at once
 */
export async function deleteDirectoryItems(ids: string[]): Promise<void> {
  try {
    // Since bulkDelete doesn't exist, we'll delete items one by one
    for (const id of ids) {
      const { error } = await apiClient.delete(TABLE_NAME, id);
      
      if (error) {
        console.error(`Error deleting directory item ${id}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in deleteDirectoryItems:", error);
    throw error;
  }
}

/**
 * Bulk insert directory items
 */
export async function bulkInsertDirectoryItems(
  items: Partial<DirectoryItem>[]
): Promise<DirectoryItem[]> {
  return createDirectoryItems(items);
}

/**
 * Check a batch of items for duplicates based on a composite key
 */
export async function checkBatchForDuplicates(
  items: Partial<DirectoryItem>[],
  compositeKeyFields: string[] = ['title', 'category']
): Promise<{
  duplicates: Partial<DirectoryItem>[];
  nonDuplicates: Partial<DirectoryItem>[];
  existingItems: DirectoryItem[];
}> {
  try {
    // Extract the values for the composite key fields from each item
    const compositeKeys = items.map(item => {
      const keyParts: Record<string, any> = {};
      
      compositeKeyFields.forEach(field => {
        // Handle nested fields like additionalFields.breeder
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          keyParts[field] = item[parent as keyof Partial<DirectoryItem>]?.[child];
        } else {
          keyParts[field] = item[field as keyof Partial<DirectoryItem>];
        }
      });
      
      return keyParts;
    });
    
    // Build filters for API query
    const filters: Record<string, any>[] = [];
    
    compositeKeys.forEach(key => {
      const filter: Record<string, any> = {};
      Object.entries(key).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          // Handle nested fields like additionalFields.breeder
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            filter[parent] = { [child]: value };
          } else {
            filter[field] = value;
          }
        }
      });
      
      if (Object.keys(filter).length > 0) {
        filters.push(filter);
      }
    });
    
    // Query for potential duplicates
    const { data, error } = await apiClient.select(TABLE_NAME, {
      filters: filters.length > 0 ? { or: filters } : undefined
    });
    
    if (error) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
    
    const existingItems = data as DirectoryItem[];
    
    // Check each item against existing items to find duplicates
    const duplicates: Partial<DirectoryItem>[] = [];
    const nonDuplicates: Partial<DirectoryItem>[] = [];
    
    items.forEach(item => {
      const isDuplicate = existingItems.some(existing => {
        // Check if all composite key fields match
        return compositeKeyFields.every(field => {
          // Handle nested fields like additionalFields.breeder
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            const itemValue = item[parent as keyof Partial<DirectoryItem>]?.[child];
            const existingValue = existing[parent as keyof DirectoryItem]?.[child];
            return itemValue === existingValue;
          } else {
            const itemValue = item[field as keyof Partial<DirectoryItem>];
            const existingValue = existing[field as keyof DirectoryItem];
            return itemValue === existingValue;
          }
        });
      });
      
      if (isDuplicate) {
        duplicates.push(item);
      } else {
        nonDuplicates.push(item);
      }
    });
    
    return {
      duplicates,
      nonDuplicates,
      existingItems
    };
  } catch (error) {
    console.error("Error in checkBatchForDuplicates:", error);
    throw error;
  }
}

/**
 * Check a single item for duplicates based on a composite key
 * @param item The item to check for duplicates
 * @param compositeKeyFields The fields to use for duplicate checking
 */
export async function checkForDuplicate(
  item: Partial<DirectoryItem>,
  compositeKeyFields: string[] = ['title', 'category']
): Promise<DirectoryItem | null> {
  try {
    const result = await checkBatchForDuplicates([item], compositeKeyFields);
    return result.duplicates.length > 0 
      ? result.existingItems.find(existing => 
          compositeKeyFields.every(field => {
            // Handle nested fields like additionalFields.breeder
            if (field.includes('.')) {
              const [parent, child] = field.split('.');
              const itemValue = item[parent as keyof Partial<DirectoryItem>]?.[child];
              const existingValue = existing[parent as keyof DirectoryItem]?.[child];
              return itemValue === existingValue;
            } else {
              const itemValue = item[field as keyof Partial<DirectoryItem>];
              const existingValue = existing[field as keyof DirectoryItem];
              return itemValue === existingValue;
            }
          })
        ) as DirectoryItem 
      : null;
  } catch (error) {
    console.error("Error in checkForDuplicate:", error);
    throw error;
  }
}

/**
 * Process items with duplicate handling
 */
export async function processBatchWithDuplicateHandling(
  items: Partial<DirectoryItem>[],
  duplicateHandlingMode: 'skip' | 'replace' | 'merge' | 'variant' = 'skip',
  compositeKeyFields: string[] = ['title', 'category', 'additionalFields.breeder', 'subcategory']
): Promise<{
  processed: Partial<DirectoryItem>[];
  skipped: Partial<DirectoryItem>[];
  existingItems: DirectoryItem[];
}> {
  try {
    // Check for duplicates in the batch
    const { duplicates, nonDuplicates, existingItems } = await checkBatchForDuplicates(items, compositeKeyFields);
    
    // Process non-duplicates - these can be directly created
    const processed: Partial<DirectoryItem>[] = [...nonDuplicates];
    
    // Handle duplicates based on the specified mode
    if (duplicates.length > 0) {
      switch (duplicateHandlingMode) {
        case 'skip':
          // Skip all duplicates, just return the non-duplicates
          return {
            processed,
            skipped: duplicates,
            existingItems
          };
          
        case 'replace':
          // Replace existing items with new ones
          for (const duplicate of duplicates) {
            // Find the matching existing item
            const existingItem = existingItems.find(existing => 
              compositeKeyFields.every(field => {
                // Handle nested fields like additionalFields.breeder
                if (field.includes('.')) {
                  const [parent, child] = field.split('.');
                  const duplicateValue = duplicate[parent as keyof Partial<DirectoryItem>]?.[child];
                  const existingValue = existing[parent as keyof DirectoryItem]?.[child];
                  return duplicateValue === existingValue;
                } else {
                  const duplicateValue = duplicate[field as keyof Partial<DirectoryItem>];
                  const existingValue = existing[field as keyof DirectoryItem];
                  return duplicateValue === existingValue;
                }
              })
            );
            
            if (existingItem) {
              // Replace with the new data
              await apiClient.update(TABLE_NAME, existingItem.id, duplicate);
              processed.push(duplicate);
            }
          }
          break;
          
        case 'merge':
          // Merge new data with existing items
          for (const duplicate of duplicates) {
            // Find the matching existing item
            const existingItem = existingItems.find(existing => 
              compositeKeyFields.every(field => {
                // Handle nested fields like additionalFields.breeder
                if (field.includes('.')) {
                  const [parent, child] = field.split('.');
                  const duplicateValue = duplicate[parent as keyof Partial<DirectoryItem>]?.[child];
                  const existingValue = existing[parent as keyof DirectoryItem]?.[child];
                  return duplicateValue === existingValue;
                } else {
                  const duplicateValue = duplicate[field as keyof Partial<DirectoryItem>];
                  const existingValue = existing[field as keyof DirectoryItem];
                  return duplicateValue === existingValue;
                }
              })
            );
            
            if (existingItem) {
              // Merge the data, preserving existing values where new ones aren't provided
              const mergedData = { ...duplicate };
              
              // Handle special merging for nested fields
              if (existingItem.additionalFields && duplicate.additionalFields) {
                mergedData.additionalFields = {
                  ...existingItem.additionalFields,
                  ...duplicate.additionalFields
                };
              }
              
              // Handle special merging for arrays like tags
              if (existingItem.tags && duplicate.tags) {
                const combinedTags = [
                  ...new Set([
                    ...(existingItem.tags || []),
                    ...(duplicate.tags || [])
                  ])
                ];
                mergedData.tags = combinedTags;
              }
              
              await apiClient.update(TABLE_NAME, existingItem.id, mergedData);
              processed.push(duplicate);
            }
          }
          break;
          
        case 'variant':
          // Create as new variants by modifying the title
          for (const duplicate of duplicates) {
            // Find the matching existing item
            const existingItem = existingItems.find(existing => 
              compositeKeyFields.every(field => {
                // Handle nested fields like additionalFields.breeder
                if (field.includes('.')) {
                  const [parent, child] = field.split('.');
                  const duplicateValue = duplicate[parent as keyof Partial<DirectoryItem>]?.[child];
                  const existingValue = existing[parent as keyof DirectoryItem]?.[child];
                  return duplicateValue === existingValue;
                } else {
                  const duplicateValue = duplicate[field as keyof Partial<DirectoryItem>];
                  const existingValue = existing[field as keyof DirectoryItem];
                  return duplicateValue === existingValue;
                }
              })
            );
            
            if (existingItem) {
              // Create a variant with modified title
              const variantData = { ...duplicate };
              
              // Generate a variant suffix based on breeder or source if available
              let variantSuffix = '';
              
              if (duplicate.additionalFields?.breeder) {
                variantSuffix = ` (${duplicate.additionalFields.breeder})`;
              } else if (duplicate.additionalFields?.source) {
                variantSuffix = ` (${duplicate.additionalFields.source})`;
              } else if (duplicate.subcategory) {
                variantSuffix = ` (${duplicate.subcategory})`;
              } else {
                variantSuffix = ` (Variant ${Date.now().toString().slice(-4)})`;
              }
              
              if (typeof variantData.title === 'string') {
                variantData.title += variantSuffix;
              }
              
              // Create as a new item
              processed.push(variantData);
            }
          }
          break;
      }
    }
    
    // Create all processed items that don't have an ID (new items)
    const newItems = processed.filter(item => !item.id);
    if (newItems.length > 0) {
      await createDirectoryItems(newItems);
    }
    
    return {
      processed,
      skipped: duplicateHandlingMode === 'skip' ? duplicates : [],
      existingItems
    };
  } catch (error) {
    console.error("Error in processBatchWithDuplicateHandling:", error);
    throw error;
  }
}
