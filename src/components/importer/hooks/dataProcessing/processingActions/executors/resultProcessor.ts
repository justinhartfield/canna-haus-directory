
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
  const finalResults: ProcessingResult = {
    success: successItems,
    errors: allErrors,
    duplicates: duplicateResults,
    missingColumns: missingColumns.size > 0 ? Array.from(missingColumns.keys()) : undefined
  };

  // Ensure progress is set to 100% when processing is complete
  setProgress(100);
  
  addProcessingStep(`Processing complete: ${successItems.length} succeeded, ${allErrors.length} failed, ${duplicateResults.length} duplicates`);

  // Show toast with results
  toast({
    title: 'Processing Complete',
    description: `${successItems.length} items imported, ${allErrors.length} errors, ${duplicateResults.length} duplicates`,
    variant: successItems.length > 0 ? 'default' : 'destructive'
  });

  // Show duplicates modal if there are duplicates
  if (duplicateResults.length > 0) {
    setShowDuplicatesModal(true);
  }

  return finalResults;
}
