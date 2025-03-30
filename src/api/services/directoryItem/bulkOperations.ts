
import { supabase } from '@/integrations/supabase/client';
import { DirectoryItem } from '@/types/directory';
import { v4 as uuidv4 } from 'uuid';

/**
 * Insert multiple directory items in a single batch operation
 */
export const bulkInsertDirectoryItems = async (
  items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{
  success: DirectoryItem[];
  errors: Array<{ item: any; error: string }>;
}> => {
  const now = new Date().toISOString();
  const preparedItems = items.map(item => ({
    ...item,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }));

  try {
    // Insert items in batches of 50
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < preparedItems.length; i += batchSize) {
      batches.push(preparedItems.slice(i, i + batchSize));
    }
    
    const successItems: DirectoryItem[] = [];
    const errorItems: Array<{ item: any; error: string }> = [];
    
    // Process each batch
    for (const batch of batches) {
      const { data, error } = await supabase
        .from('directory_items')
        .insert(batch)
        .select();
      
      if (error) {
        // If batch insert fails, try inserting items individually
        for (const item of batch) {
          const { data: individualData, error: individualError } = await supabase
            .from('directory_items')
            .insert(item)
            .select();
          
          if (individualError) {
            errorItems.push({
              item: item,
              error: individualError.message
            });
          } else if (individualData && individualData.length > 0) {
            successItems.push(individualData[0] as DirectoryItem);
          }
        }
      } else if (data) {
        // Add successfully inserted items
        successItems.push(...data as DirectoryItem[]);
      }
    }
    
    return {
      success: successItems,
      errors: errorItems
    };
  } catch (error) {
    console.error('Error in bulk insert operation:', error);
    return {
      success: [],
      errors: items.map(item => ({
        item,
        error: error instanceof Error ? error.message : 'Unknown error during bulk insert'
      }))
    };
  }
};
