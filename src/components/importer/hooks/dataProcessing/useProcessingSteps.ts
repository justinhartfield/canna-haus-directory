
import { useCallback } from 'react';

export function useProcessingSteps() {
  // Add processing step with timestamp for debugging
  const addProcessingStep = useCallback((step: string, addToSteps: (step: string) => void) => {
    const timestamp = new Date().toISOString();
    const stepWithTimestamp = `[${timestamp}] ${step}`;
    console.log(stepWithTimestamp);
    addToSteps(stepWithTimestamp);
  }, []);

  return { addProcessingStep };
}
