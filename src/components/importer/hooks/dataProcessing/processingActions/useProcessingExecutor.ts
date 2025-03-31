
import { useCallback } from 'react';
import { processData } from './executors';
import { ProcessingResult } from '../types';

/**
 * Hook providing the main data processing logic
 */
export function useProcessingExecutor(
  setIsProcessing: (value: boolean) => void,
  setProgress: (value: number) => void,
  setResults: (value: ProcessingResult | null) => void,
  setProcessingError: (value: Error | null) => void,
  setShowDuplicatesModal: (value: boolean) => void,
  addProcessingStep: (step: string) => void
) {
  const processDataCallback = useCallback(async (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ): Promise<ProcessingResult> => {
    // Initialize state and error handling
    setIsProcessing(true);
    setProgress(0);
    setResults(null);
    setProcessingError(null);
    addProcessingStep("Starting processing of " + data.length + " items");

    try {
      // Process the data using the refactored processing function
      const result = await processData(
        data, 
        mappings, 
        category, 
        subcategory, 
        addProcessingStep, 
        setProgress, 
        setShowDuplicatesModal
      );
      
      // Update state with results
      setResults(result);
      setIsProcessing(false);
      return result;
    } catch (error) {
      // Handle any uncaught errors
      console.error('Uncaught error in processing:', error);
      setProcessingError(error instanceof Error ? error : new Error('Unknown error'));
      
      // Create an error result
      const errorResult: ProcessingResult = {
        success: [],
        errors: [{
          item: null,
          error: error instanceof Error ? error.message : 'Unknown error during processing'
        }],
        duplicates: []
      };
      
      // Update UI state
      setResults(errorResult);
      setProgress(100);
      setIsProcessing(false);
      return errorResult;
    }
  }, [setIsProcessing, setProgress, setResults, setProcessingError, addProcessingStep, setShowDuplicatesModal]);

  return { processData: processDataCallback };
}
