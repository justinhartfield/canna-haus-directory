
import { DirectoryItem } from '@/types/directory';
import { DuplicateGroup, ProcessingResults } from '@/types/deduplication';
import { updateDirectoryItem } from '@/api/services/directoryItem/crudOperations';
import { mergeRecords } from '@/utils/deduplication/mergeUtils';
import { toast } from 'sonner';

/**
 * Process a batch of duplicate groups according to their selected actions
 */
export const processDuplicates = async (duplicateGroups: DuplicateGroup[]): Promise<ProcessingResults> => {
  const results: ProcessingResults = {
    processed: 0,
    merged: 0,
    variants: 0,
    kept: 0,
    errors: []
  };

  try {
    for (const group of duplicateGroups) {
      const { primaryRecord, duplicates, selectedDuplicates, action } = group;
      
      const selectedDuplicateRecords = duplicates.filter(d => 
        selectedDuplicates.includes(d.id)
      );
      
      if (selectedDuplicateRecords.length === 0) continue;
      
      results.processed++;
      
      try {
        if (action === 'merge') {
          const mergedData = mergeRecords(primaryRecord, selectedDuplicateRecords);
          await updateDirectoryItem(primaryRecord.id, mergedData);
          results.merged++;
        } else if (action === 'variant') {
          for (const duplicate of selectedDuplicateRecords) {
            const updatedFields = {
              additionalFields: {
                ...(duplicate.additionalFields || {}),
                isVariantOf: primaryRecord.id
              }
            };
            await updateDirectoryItem(duplicate.id, updatedFields);
          }
          results.variants++;
        } else {
          results.kept++;
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : (typeof err === 'object' && err !== null && 'message' in err)
            ? String((err as any).message)
            : 'Unknown error';
        
        console.error(`Error processing group with primary ${primaryRecord.id}:`, err);
        results.errors.push(`Failed to process ${primaryRecord.title}: ${errorMessage}`);
      }
    }
    
    if (results.errors.length === 0) {
      toast.success(`Successfully processed ${results.processed} duplicate groups`);
    } else {
      toast.warning(`Processed with errors: ${results.errors.length} issues found`);
    }
    
    return results;
  } catch (error) {
    console.error('Error processing duplicates:', error);
    toast.error('Failed to process duplicates');
    throw error;
  }
};
