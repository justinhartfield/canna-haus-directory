
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { UseDataProcessingProps, ProcessingResult } from './types';
import { useProcessingSteps } from './useProcessingSteps';
import { useDuplicateHandling } from './useDuplicateHandling';
import { useProcessingActions } from './useProcessingActions';

export const useDataProcessing = ({ onComplete }: UseDataProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  // Extract processing steps functionality
  const { addProcessingStep: addStep } = useProcessingSteps();
  
  // Create a wrapper for addStep that updates our state
  const addProcessingStep = useCallback((step: string) => {
    addStep(step, (newStep) => {
      setProcessingSteps(prev => [...prev, newStep]);
    });
  }, [addStep]);
  
  // Extract duplicate handling functionality
  const { 
    handleCloseDuplicatesModal, 
    handleViewDuplicatesDetails 
  } = useDuplicateHandling(setShowDuplicatesModal);
  
  // Extract processing actions functionality
  const { 
    processData: processDataAction, 
    getDebugInfo 
  } = useProcessingActions(
    isProcessing,
    progress,
    processingError,
    processingSteps,
    results,
    setIsProcessing,
    setProgress,
    setResults,
    setProcessingError,
    setShowDuplicatesModal,
    addProcessingStep
  );
  
  // Wrap processData to call onComplete when processing is done
  const processData = useCallback(async (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => {
    const result = await processDataAction(data, mappings, category, subcategory);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(result);
    }
    
    return result;
  }, [processDataAction, onComplete]);

  return {
    isProcessing,
    progress,
    results,
    processingError,
    showDuplicatesModal,
    processData,
    handleCloseDuplicatesModal,
    handleViewDuplicatesDetails,
    getDebugInfo,
    processingSteps
  };
};
