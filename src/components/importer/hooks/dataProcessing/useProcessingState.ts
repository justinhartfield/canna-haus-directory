
import { useState } from 'react';
import { ProcessingState, ProcessingResult } from './types';

export function useProcessingState(): ProcessingState {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  return {
    isProcessing,
    progress,
    results,
    showDuplicatesModal,
    processingError,
    processingSteps,
  };
}

// Export these setter functions to be used in other hooks
export function createStateSetters(setState: React.Dispatch<React.SetStateAction<ProcessingState>>) {
  return {
    setIsProcessing: (value: boolean) => 
      setState(prev => ({ ...prev, isProcessing: value })),
    
    setProgress: (value: number) => 
      setState(prev => ({ ...prev, progress: value })),
    
    setResults: (value: ProcessingResult | null) => 
      setState(prev => ({ ...prev, results: value })),
    
    setShowDuplicatesModal: (value: boolean) => 
      setState(prev => ({ ...prev, showDuplicatesModal: value })),
    
    setProcessingError: (value: Error | null) => 
      setState(prev => ({ ...prev, processingError: value })),
    
    setProcessingSteps: (value: string[]) => 
      setState(prev => ({ ...prev, processingSteps: value })),
    
    addProcessingStep: (step: string) => 
      setState(prev => ({ 
        ...prev, 
        processingSteps: [...prev.processingSteps, step] 
      }))
  };
}
