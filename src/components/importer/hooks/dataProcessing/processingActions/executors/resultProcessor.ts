
import { ProcessingResult } from '../../types';
import { toast } from '@/hooks/use-toast';

/**
 * Format and finalize processing results
 */
export function formatResults(
  successItems: any[],
  allErrors: Array<{ item: any; message: string }>,
  duplicateResults: Array<{ item: any; error: string }>,
  missingColumns: Map<string, string>,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void,
  setShowDuplicatesModal: (value: boolean) => void
): ProcessingResult {
  // Step 6: Finalize results
  addProcessingStep('Step 6: Finalizing results');
  
  // Clean up ingredient items by removing "- " prefixes
  const cleanedSuccessItems = successItems.map(item => {
    // If item has additionalFields with ingredients
    if (item.additionalFields && typeof item.additionalFields === 'object') {
      Object.keys(item.additionalFields).forEach(fieldKey => {
        const fieldValue = item.additionalFields[fieldKey];
        
        // Check if this might be an ingredient field (contains "ingredient" in the key or value)
        const isIngredientField = 
          fieldKey.toLowerCase().includes('ingredient') || 
          (typeof fieldValue === 'string' && fieldValue.toLowerCase().includes('ingredient'));
        
        // If it's a string value and likely an ingredient field, remove "- " prefixes
        if (typeof fieldValue === 'string' && isIngredientField) {
          // Replace "- " at the beginning of lines
          item.additionalFields[fieldKey] = fieldValue.replace(/^- |(?:\n|\\n)- /g, '$&'.replace('- ', ''));
        }
      });
    }
    
    // Clean tags if they exist
    if (item.tags && Array.isArray(item.tags)) {
      item.tags = item.tags.map(tag => 
        typeof tag === 'string' ? tag.replace(/^- /, '') : tag
      );
    }
    
    return item;
  });
  
  const finalResults: ProcessingResult = {
    success: cleanedSuccessItems,
    errors: allErrors,
    duplicates: duplicateResults,
    missingColumns: missingColumns.size > 0 ? Array.from(missingColumns.keys()) : undefined
  };

  // Ensure progress is set to 100% when processing is complete
  setProgress(100);
  
  addProcessingStep(`Processing complete: ${cleanedSuccessItems.length} succeeded, ${allErrors.length} failed, ${duplicateResults.length} duplicates`);

  // Show toast with results
  toast({
    title: 'Processing Complete',
    description: `${cleanedSuccessItems.length} items imported, ${allErrors.length} errors, ${duplicateResults.length} duplicates`,
    variant: cleanedSuccessItems.length > 0 ? 'default' : 'destructive'
  });

  // Show duplicates modal if there are duplicates
  if (duplicateResults.length > 0) {
    setShowDuplicatesModal(true);
  }

  return finalResults;
}
