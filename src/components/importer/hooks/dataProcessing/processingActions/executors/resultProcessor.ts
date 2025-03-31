import { ProcessingResult } from '../../types';
import { toast } from '@/hooks/use-toast';

/**
 * Clean ingredient string by removing leading "- " if present
 */
function cleanIngredientString(str: string): string {
  if (typeof str === 'string') {
    // Check if the string starts with "- " and remove it
    if (str.startsWith('- ')) {
      return str.substring(2).trim();
    }
    // Also check for numbers with periods like "1. " which can appear in lists
    if (/^\d+\.\s/.test(str)) {
      return str.replace(/^\d+\.\s/, '').trim();
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
          .filter(item => item) // Remove empty strings
          .join(', ');
      }
      // Handle array values
      else if (Array.isArray(value)) {
        result[key] = value
          .map(item => {
            if (typeof item === 'string') {
              return cleanIngredientString(item);
            }
            return item;
          })
          .filter(Boolean); // Remove nulls/undefined/empty strings
      }
    }
    
    // Clean other fields that might contain dash-prefixed items
    if (typeof result[key] === 'string' && (result[key].includes('- ') || result[key].includes('\n'))) {
      // Check if it's likely a list (has multiple "- " occurrences or newlines)
      const dashCount = (result[key].match(/- /g) || []).length;
      const hasNewlines = result[key].includes('\n');
      
      if (dashCount > 1 || result[key].startsWith('- ') || hasNewlines) {
        // If there are newlines, split by newlines
        if (hasNewlines) {
          result[key] = result[key]
            .split('\n')
            .map(item => cleanIngredientString(item.trim()))
            .filter(item => item) // Remove empty strings
            .join(', ');
        } else {
          // Otherwise split by commas
          result[key] = result[key]
            .split(',')
            .map(item => cleanIngredientString(item.trim()))
            .filter(item => item) // Remove empty strings
            .join(', ');
        }
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

  // Log successful items for verification
  if (cleanedItems.length > 0) {
    console.log(`Cleaned ${cleanedItems.length} items. First item sample:`, 
      cleanedItems.length > 0 ? Object.keys(cleanedItems[0]).slice(0, 3).reduce((acc, key) => {
        acc[key] = cleanedItems[0][key];
        return acc;
      }, {} as Record<string, any>) : 'No items');
  }

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
