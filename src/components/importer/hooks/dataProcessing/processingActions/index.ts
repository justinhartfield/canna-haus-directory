
import { useProcessingExecutor } from './useProcessingExecutor';
import { useDebugInfo } from './useDebugInfo';
import { ProcessingActionsResult } from './types';

/**
 * Hook that provides actions for data processing
 */
export function useProcessingActions(
  isProcessing: boolean,
  progress: number,
  processingError: Error | null,
  processingSteps: string[],
  results: import('../types').ProcessingResult | null,
  setIsProcessing: (value: boolean) => void,
  setProgress: (value: number) => void,
  setResults: (value: import('../types').ProcessingResult | null) => void,
  setProcessingError: (value: Error | null) => void,
  setShowDuplicatesModal: (value: boolean) => void,
  addProcessingStep: (step: string) => void
): ProcessingActionsResult {
  // Get debug info functionality
  const { getDebugInfo } = useDebugInfo(
    processingSteps,
    processingError,
    progress,
    results
  );

  // Get process data functionality
  const { processData } = useProcessingExecutor(
    setIsProcessing,
    setProgress,
    setResults,
    setProcessingError,
    setShowDuplicatesModal,
    addProcessingStep
  );

  return {
    processData,
    getDebugInfo
  };
}

export type { ProcessingActionsResult };
