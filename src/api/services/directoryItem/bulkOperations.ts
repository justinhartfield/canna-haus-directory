import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../../core/supabaseClient";
import { transformDirectoryItemToDatabaseRow } from "../../transformers/directoryTransformer";
import { checkBatchForDuplicates } from "./duplicateChecking";
import { getDirectoryItemById } from "./crudOperations";

const TABLE_NAME = 'directory_items' as const;

// Define type for database insertion compatible with Supabase types
// Use 'any' temporarily since directory_items is not in the Database type yet
type DirectoryItemInsert = any; // This would normally be Database['public']['Tables']['directory_items']['Insert']

/**
 * Get the breeder/source from additionalFields
 */
function getBreederSource(item: Partial<DirectoryItem>): string | null {
  if (!item.additionalFields) return null;
  
  // Check different possible field names for breeder/source
  return item.additionalFields.breeder || 
         item.additionalFields.source || 
         item.additionalFields.breedBy || 
         item.additionalFields.producedBy || 
         null;
}

/**
 * Merge two directory items, keeping values from both where possible
 */
function mergeItems(
  existingItem: DirectoryItem, 
  newItem: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>
): Partial<DirectoryItem> {
  // Create a base merged item
  const mergedItem: Partial<DirectoryItem> = {
    // Keep existing ID and timestamps
    id: existingItem.id,
    // For text fields, prefer the longer/newer content if available
    title: existingItem.title,
    description: newItem.description && newItem.description.length > existingItem.description.length 
      ? newItem.description 
      : existingItem.description,
    category: existingItem.category,
    subcategory: newItem.subcategory || existingItem.subcategory,
    // Combine tags from both items, removing duplicates
    tags: Array.from(new Set([...(existingItem.tags || []), ...(newItem.tags || [])])),
    // Prefer new image URLs if they exist
    imageUrl: newItem.imageUrl || existingItem.imageUrl,
    thumbnailUrl: newItem.thumbnailUrl || existingItem.thumbnailUrl,
    // Combine JSON-LD data
    jsonLd: {
      ...existingItem.jsonLd,
      ...newItem.jsonLd
    },
    // Merge metadata
    metaData: {
      ...existingItem.metaData,
      ...newItem.metaData,
      mergedAt: new Date().toISOString(),
      mergeHistory: [
        ...(existingItem.metaData?.mergeHistory || []),
        {
          date: new Date().toISOString(),
          source: 'bulk-import'
        }
      ]
    },
    // Merge additional fields
    additionalFields: {
      ...existingItem.additionalFields,
      ...newItem.additionalFields
    }
  };
  
  return mergedItem;
}

/**
 * Create a variant of an item with a modified title to avoid duplicate conflicts
 */
function createVariant(
  item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, 
  variantInfo: string
): Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> {
  const breederSource = getBreederSource(item);
  
  // Create a variant title based on available information
  let variantTitle = item.title;
  if (breederSource) {
    variantTitle = `${item.title} (${breederSource})`;
  } else if (variantInfo) {
    variantTitle = `${item.title} (${variantInfo})`;
  } else {
    // If no distinguishing info is available, add a timestamp to make it unique
    variantTitle = `${item.title} (Variant ${Date.now()})`;
  }
  
  // Add variant metadata
  const variant: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
    ...item,
    title: variantTitle,
    metaData: {
      ...(item.metaData || {}),
      isVariant: true,
      originalTitle: item.title,
      variantCreatedAt: new Date().toISOString()
    }
  };
  
  return variant;
}

/**
 * Process item based on duplicate handling mode
 */
async function processItemByMode(
  item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>,
  duplicateHandlingMode: string = 'skip',
  isDuplicate: boolean = false,
  variantInfo: string = ''
): Promise<{ action: string; item: DirectoryItem | null }> {
  // If it's not a duplicate, just insert it
  if (!isDuplicate) {
    try {
      const databaseRow = transformDirectoryItemToDatabaseRow(item) as DirectoryItemInsert;
      const { data, error } = await apiClient.insert(TABLE_NAME, databaseRow);
      
      if (error) throw error;
      return { action: 'inserted', item: data };
    } catch (error) {
      console.error("Error inserting item:", error);
      throw error;
    }
  }
  
  // Handle based on duplicate mode
  switch (duplicateHandlingMode) {
    case 'skip':
      return { action: 'skipped', item: null };
      
    case 'replace':
      try {
        // Get the existing item to get its ID
        const title = String(item.title);
        const category = String(item.category);
        const { data: existingItems, error } = await apiClient.select(TABLE_NAME, {
          filters: { title, category }
        });
        
        if (error) throw error;
        if (!existingItems || existingItems.length === 0) {
          throw new Error(`Could not find existing item to replace: ${title} in ${category}`);
        }
        
        // Replace the first matching item
        const existingId = existingItems[0].id;
        const updateData = transformDirectoryItemToDatabaseRow(item);
        
        const { data, error: updateError } = await apiClient.update(TABLE_NAME, existingId, updateData);
        
        if (updateError) throw updateError;
        return { action: 'replaced', item: data };
      } catch (error) {
        console.error("Error replacing item:", error);
        throw error;
      }
      
    case 'merge':
      try {
        // Get the existing item to merge with
        const title = String(item.title);
        const category = String(item.category);
        const { data: existingItems, error } = await apiClient.select(TABLE_NAME, {
          filters: { title, category }
        });
        
        if (error) throw error;
        if (!existingItems || existingItems.length === 0) {
          throw new Error(`Could not find existing item to merge with: ${title} in ${category}`);
        }
        
        // Merge with the first matching item
        const existingItem = existingItems[0];
        const mergedItem = mergeItems(existingItem, item);
        
        const updateData = transformDirectoryItemToDatabaseRow(mergedItem);
        const { data, error: updateError } = await apiClient.update(TABLE_NAME, existingItem.id, updateData);
        
        if (updateError) throw updateError;
        return { action: 'merged', item: data };
      } catch (error) {
        console.error("Error merging item:", error);
        throw error;
      }
      
    case 'variant':
      try {
        // Create a variant with modified title
        const variant = createVariant(item, variantInfo);
        const databaseRow = transformDirectoryItemToDatabaseRow(variant) as DirectoryItemInsert;
        
        const { data, error } = await apiClient.insert(TABLE_NAME, databaseRow);
        
        if (error) throw error;
        return { action: 'variant-created', item: data };
      } catch (error) {
        console.error("Error creating variant:", error);
        throw error;
      }
      
    default:
      return { action: 'skipped', item: null };
  }
}

/**
 * Bulk inserts directory items with duplicate handling
 */
export async function bulkInsertDirectoryItems(
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>,
  options: {
    duplicateHandlingMode?: string;
    batchSize?: number;
  } = {}
): Promise<DirectoryItem[]> {
  const { 
    duplicateHandlingMode = 'skip',
    batchSize = 50
  } = options;
  
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
    
    // Skip duplicate check if in replace or variant mode since we're going to process them anyway
    let duplicates: Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}> = [];
    
    if (duplicateHandlingMode === 'skip') {
      // Check for duplicates with a timeout to avoid hanging
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
        console.log(`Found ${duplicates.length} duplicate items. Skipping them.`);
      }
    } else {
      // For other modes, we need to check each item individually during processing
      console.log(`Using ${duplicateHandlingMode} mode for duplicate handling.`);
    }
    
    // Get a set of duplicate items for quick lookup
    const duplicateItemSet = new Set(duplicates.map(d => d.item.title + '-' + d.item.category));
    
    // Process items based on duplicate handling mode
    const processedItems: DirectoryItem[] = [];
    let successCount = 0;
    let skipCount = 0;
    let replaceCount = 0;
    let mergeCount = 0;
    let variantCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async item => {
          try {
            // Check if this item is in our duplicate set
            const itemKey = item.title + '-' + item.category;
            const isDuplicate = duplicateItemSet.has(itemKey);
            
            // If we're not in skip mode, we need to check for duplicates individually
            let itemIsDuplicate = isDuplicate;
            if (!isDuplicate && duplicateHandlingMode !== 'skip') {
              itemIsDuplicate = await checkForDuplicate(
                String(item.title), 
                String(item.category),
                item.additionalFields,
                item.subcategory
              );
            }
            
            // Get variant info (e.g., breeder/source)
            const variantInfo = getBreederSource(item) || '';
            
            const result = await processItemByMode(
              item, 
              duplicateHandlingMode, 
              itemIsDuplicate,
              variantInfo
            );
            
            // Track stats based on action
            switch (result.action) {
              case 'inserted':
                successCount++;
                if (result.item) processedItems.push(result.item);
                break;
              case 'skipped':
                skipCount++;
                break;
              case 'replaced':
                replaceCount++;
                if (result.item) processedItems.push(result.item);
                break;
              case 'merged':
                mergeCount++;
                if (result.item) processedItems.push(result.item);
                break;
              case 'variant-created':
                variantCount++;
                if (result.item) processedItems.push(result.item);
                break;
            }
            
            return result;
            
          } catch (error) {
            errorCount++;
            console.error(`Error processing item ${i}:`, error);
            return { error, item };
          }
        })
      );
      
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
      console.log(`Stats so far: ${successCount} inserted, ${skipCount} skipped, ${replaceCount} replaced, ${mergeCount} merged, ${variantCount} variants, ${errorCount} errors`);
    }
    
    return processedItems;
    
  } catch (error) {
    console.error("Error in bulk insert:", error);
    throw error;
  }
}
