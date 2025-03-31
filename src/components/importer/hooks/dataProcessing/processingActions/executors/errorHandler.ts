
import { ProcessingResult } from '../../types';
import { toast } from '@/hooks/use-toast';

/**
 * Handle processing errors
 */
export function handleProcessingError(
  error: unknown,
  addProcessingStep: (step: string) => void
): ProcessingResult {
  console.error('Error processing data:', error);
  addProcessingStep(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  
  // Create error result
  const errorResult: ProcessingResult = {
    success: [],
    errors: [{
      item: null,
      error: error instanceof Error ? error.message : 'Unknown error during processing'
    }],
    duplicates: []
  };
  
  // Show error toast
  toast({
    title: 'Processing Failed',
    description: error instanceof Error ? error.message : 'Unknown error occurred',
    variant: 'destructive'
  });
  
  return errorResult;
}
