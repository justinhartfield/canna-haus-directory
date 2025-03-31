
import { useState, useCallback, useEffect } from 'react';
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

  // Make sure processing state is properly reset when errors occur
  useEffect(() => {
    if (processingError) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [processingError]);
  
  // Ensure processing state is properly handled when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, isProcessing]);
  
  // Wrap processData to call onComplete when processing is done
  const processData = useCallback(async (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => {
    const result = await processDataAction(data, mappings, category, subcategory);
    
    // Set progress to 100% to indicate completion
    setProgress(100);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(result);
    }
    
    return result;
  }, [processDataAction, onComplete, setProgress]);

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
