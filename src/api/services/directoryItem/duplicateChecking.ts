
import { DirectoryItem } from "@/types/directory";
import { apiClient } from "../../core/supabaseClient";

const TABLE_NAME = 'directory_items' as const;

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
 * Checks if an item with the same title and category already exists
 * Now with enhanced logic to check for breeder/source and subcategory
 * @returns true if a duplicate exists, false otherwise
 */
export async function checkForDuplicate(
  title: string, 
  category: string, 
  additionalFields?: Record<string, any>,
  subcategory?: string
): Promise<boolean> {
  try {
    // Base query with title and category
    const filters: Record<string, any> = { title, category };
    
    // Add subcategory filter if provided
    if (subcategory) {
      filters.subcategory = subcategory;
    }
    
    const { data, error } = await apiClient.select(TABLE_NAME, {
      filters
    });
    
    if (error) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
    
    // If no results found by basic filters, return false
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    // If additionalFields contains breeder/source, do more specific matching
    const breederSource = additionalFields ? 
      getBreederSource({ additionalFields }) : 
      null;
    
    if (breederSource) {
      // Check if any of the found items have the same breeder/source
      return data.some(item => {
        const itemBreederSource = getBreederSource({
          additionalFields: item.additionalfields
        });
        
        return itemBreederSource === breederSource;
      });
    }
    
    // If we got here, we found items with matching title/category but didn't need 
    // or couldn't check breeder/source, so consider it a duplicate
    return true;
    
  } catch (err) {
    console.error("Error in checkForDuplicate:", err);
    // If there's an error checking, assume no duplicates instead of blocking the flow
    return false;
  }
}

/**
 * Check for duplicates in a batch of items
 * Returns an array of duplicate items with error messages
 * Enhanced to use breeder/source and subcategory for more precise matching
 */
export async function checkBatchForDuplicates(
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Array<{item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, error: string}>> {
  const duplicates: Array<{
    item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, 
    error: string
  }> = [];
  
  try {
    // Fix: Add early return for empty items array
    if (!items || items.length === 0) {
      return [];
    }
    
    // First check for duplicates within the batch itself
    const titleCategoryMap = new Map<string, Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>();
    
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
      const subcategory = item.subcategory ? String(item.subcategory).toLowerCase() : '';
      const breederSource = getBreederSource(item);
      
      // Create a composite key for more precise duplicate detection
      const key = breederSource ? 
        `${title}-${category}-${breederSource}` : 
        `${title}-${category}${subcategory ? `-${subcategory}` : ''}`;
      
      if (titleCategoryMap.has(key)) {
        duplicates.push({
          item,
          error: `Duplicate item in batch: "${item.title}" in category "${item.category}"${
            breederSource ? ` by "${breederSource}"` : ''
          }`
        });
      } else {
        titleCategoryMap.set(key, item);
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
        // Use enhanced duplicate check with breeder/source and subcategory
        if (await checkForDuplicate(
          String(item.title), 
          String(item.category), 
          item.additionalFields, 
          item.subcategory
        )) {
          const breederSource = getBreederSource(item);
          return {
            item,
            error: `An item with title "${item.title}" in category "${item.category}"${
              breederSource ? ` by "${breederSource}"` : ''
            } already exists in the database`
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
    duplicates.push(...results.filter(Boolean) as Array<{
      item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>, 
      error: string
    }>);
    
    return duplicates;
  } catch (error) {
    console.error("Fatal error in checkBatchForDuplicates:", error);
    // Return empty array to allow the flow to continue
    return [];
  }
}
