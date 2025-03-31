
import { ProcessingResult } from '../../types';
import { toast } from '@/hooks/use-toast';

/**
 * Clean ingredient string by removing leading "- " if present
 */
function cleanIngredientString(str: string): string {
  if (typeof str === 'string') {
    // Check if the string starts with "- " and remove it
    if (str.startsWith('- ')) {
      return str.substring(2);
    }
  }
  return str;
}

/**
 * Clean item values that likely contain ingredients or lists
 */
function cleanItemValues(item: any): any {
  if (!item) return item;
  
  const result = { ...item };
  
  // Fields that are likely to contain ingredients or lists
  const ingredientFields = [
    'ingredients', 'items', 'parts', 'components', 'materials',
    'contents', 'elements', 'composition', 'makeup', 'constituents',
    'flavors', 'feelings', 'negatives', 'helps'
  ];
  
  // Process all keys in the item
  Object.keys(result).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    // Check if this is an ingredient-related field
    const isIngredientField = ingredientFields.some(field => 
      lowerKey.includes(field) || lowerKey.endsWith('list')
    );
    
    if (isIngredientField) {
      const value = result[key];
      
      // Handle string values (comma-separated lists)
      if (typeof value === 'string') {
        // Split by commas, clean each item, then rejoin
        result[key] = value
          .split(',')
          .map(item => cleanIngredientString(item.trim()))
          .join(', ');
      }
      // Handle array values
      else if (Array.isArray(value)) {
        result[key] = value.map(item => {
          if (typeof item === 'string') {
            return cleanIngredientString(item);
          }
          return item;
        });
      }
    }
    
    // Clean other fields that might contain dash-prefixed items
    if (typeof result[key] === 'string' && result[key].includes('- ')) {
      // Check if it's likely a list (has multiple "- " occurrences)
      const dashCount = (result[key].match(/- /g) || []).length;
      if (dashCount > 1 || result[key].startsWith('- ')) {
        // Split by commas, clean each item, then rejoin
        result[key] = result[key]
          .split(',')
          .map(item => cleanIngredientString(item.trim()))
          .join(', ');
      }
    }
  });
  
  return result;
}

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
  
  // Clean ingredient strings in all items
  const cleanedItems = successItems.map(cleanItemValues);
  
  const finalResults: ProcessingResult = {
    success: cleanedItems,
    errors: allErrors,
    duplicates: duplicateResults,
    missingColumns: missingColumns.size > 0 ? Array.from(missingColumns.keys()) : undefined
  };

  // Ensure progress is set to 100% when processing is complete
  setProgress(100);
  
  addProcessingStep(`Processing complete: ${cleanedItems.length} succeeded, ${allErrors.length} failed, ${duplicateResults.length} duplicates`);

  // Show toast with results
  toast({
    title: 'Processing Complete',
    description: `${cleanedItems.length} items imported, ${allErrors.length} errors, ${duplicateResults.length} duplicates`,
    variant: cleanedItems.length > 0 ? 'default' : 'destructive'
  });

  // Show duplicates modal if there are duplicates
  if (duplicateResults.length > 0) {
    setShowDuplicatesModal(true);
  }

  return finalResults;
}
