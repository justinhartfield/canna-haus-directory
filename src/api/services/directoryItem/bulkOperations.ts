
import { DirectoryItem } from '@/types/directory';
import { apiClient } from '../../core/supabaseClient';
import { stripAdditionalFieldsIfNeeded, transformDirectoryItemToDatabaseRow } from '@/api/transformers/directoryTransformer';
import { toast } from '@/hooks/use-toast';

const TABLE_NAME = 'directory_items' as const;

/**
 * Bulk insert directory items with proper error handling
 */
export async function bulkInsertDirectoryItems(
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{
  success: DirectoryItem[];
  errors: Array<{ item: any; error: string }>;
}> {
  if (!items || items.length === 0) {
    return { success: [], errors: [] };
  }

  console.log(`Attempting to bulk insert ${items.length} items`);
  
  try {
    // Transform items to database format
    const dbRows = items.map(item => {
      // Transform to database format
      const dbItem = transformDirectoryItemToDatabaseRow(item);
      // Strip additionalFields if they might cause issues
      return stripAdditionalFieldsIfNeeded(dbItem);
    });

    console.log(`Transformed ${dbRows.length} items for database insertion`);
    
    // Try first with a subset to test for schema issues
    const testBatch = dbRows.slice(0, 1);
    
    try {
      const testResult = await apiClient.bulkInsert(TABLE_NAME, testBatch, { returning: true });
      
      if (testResult.error) {
        // If there's an error with the test batch, try alternate approach
        console.error('Test batch failed:', testResult.error);
        throw new Error(`Test batch failed: ${testResult.error.message}`);
      }
      
      // If test succeeds, continue with all items
      const { data, error } = await apiClient.bulkInsert(TABLE_NAME, dbRows, { returning: true });
      
      if (error) {
        console.error('Bulk insert error:', error);
        return { 
          success: [], 
          errors: dbRows.map(item => ({
            item,
            error: error.message
          }))
        };
      }
      
      // Return successfully inserted items
      return {
        success: Array.isArray(data) ? data : [],
        errors: []
      };
    } catch (testError) {
      console.warn('Schema compatibility issue detected, trying fallback insertion method');
      
      // Fall back to individual inserts to work around schema issues
      const results = {
        success: [] as DirectoryItem[],
        errors: [] as Array<{ item: any; error: string }>
      };
      
      // Process items one by one
      for (const item of dbRows) {
        try {
          // Use insertWithColumnFilter to handle schema mismatches
          const { data, error } = await insertWithColumnFilter(TABLE_NAME, item);
          
          if (error) {
            results.errors.push({
              item,
              error: error.message
            });
          } else if (data) {
            // Fix: Ensure we're pushing a single item, not an array
            results.success.push(data as DirectoryItem);
          }
        } catch (itemError: any) {
          results.errors.push({
            item,
            error: itemError.message || 'Unknown error during item insertion'
          });
        }
      }
      
      return results;
    }
  } catch (error: any) {
    console.error('Error in bulkInsertDirectoryItems:', error);
    
    return {
      success: [],
      errors: [{
        item: items[0],
        error: error.message || 'Unknown error during bulk insertion'
      }]
    };
  }
}

/**
 * Special insert function that handles schema mismatches by filtering columns
 */
async function insertWithColumnFilter(table: string, item: any) {
  try {
    // First attempt: try with just the basic columns that we know exist
    const safeColumns = ['title', 'description', 'category', 'subcategory', 'tags', 'jsonLd', 'metaData'];
    const safeItem: any = {};
    
    // Only include fields that are in our safe list
    for (const key of safeColumns) {
      if (key in item) {
        safeItem[key] = item[key];
      }
    }
    
    console.log('Trying insertion with safe columns:', Object.keys(safeItem).join(', '));
    
    // Fix: Cast the table name to TableNames type to satisfy TypeScript
    return await apiClient.insert(table as 'directory_items', safeItem, { returning: true });
  } catch (error) {
    console.error('Error in insertWithColumnFilter:', error);
    throw error;
  }
}
