
import { useCallback } from 'react';
import { ProcessingResult } from '../types';

/**
 * Hook to provide debugging information for the processing state
 */
export function useDebugInfo(
  processingSteps: string[],
  processingError: Error | null,
  progress: number,
  results: ProcessingResult | null
) {
  // Export debug info for diagnosing processing issues
  const getDebugInfo = useCallback(() => {
    return {
      processingSteps,
      error: processingError,
      progressValue: progress,
      hasResults: !!results,
      resultSummary: results ? {
        successCount: results.success.length,
        errorCount: results.errors.length,
        duplicateCount: results.duplicates.length
      } : null
    };
  }, [processingSteps, processingError, progress, results]);

  return { getDebugInfo };
}
