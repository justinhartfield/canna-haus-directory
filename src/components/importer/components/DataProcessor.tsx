
import React, { useEffect, useState } from 'react';
import { DirectoryItem } from '@/types/directory';
import { useDataProcessing } from '@/components/importer/hooks/useDataProcessing';
import { toast } from '@/hooks/use-toast';

interface DataProcessorProps {
  data: Array<Record<string, any>>;
  mappings: Record<string, string>;
  category: string;
  subcategory?: string;
  onProcessComplete: (results: {
    success: DirectoryItem[];
    errors: Array<{ item: any; error: string }>;
    duplicates: Array<{ item: any; error: string }>;
  }) => void;
  onProgress: (progress: number) => void;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  data,
  mappings,
  category,
  subcategory,
  onProcessComplete,
  onProgress
}) => {
  const [processingStarted, setProcessingStarted] = useState(false);
  const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { processData, progress, results, isProcessing } = useDataProcessing({
    onComplete: onProcessComplete
  });

  useEffect(() => {
    // Update parent component with progress
    onProgress(progress);
    
    // Reset timeout if progress is being made
    if (processingStarted && processingTimeout && progress > 0) {
      clearTimeout(processingTimeout);
      setProcessingTimeout(null);
    }
  }, [progress, onProgress, processingStarted, processingTimeout]);

  useEffect(() => {
    // Only process data if there's actual data to process
    if (!processingStarted && data && data.length > 0) {
      setProcessingStarted(true);
      
      console.log('Starting data processing with', data.length, 'items');
      
      // Set timeout to detect if processing doesn't start within 10 seconds
      const timeout = setTimeout(() => {
        console.log('Processing timeout triggered');
        if (progress === 0) {
          toast({
            title: 'Processing Issue',
            description: 'Processing seems to be taking longer than expected. You can wait or try again.',
            variant: 'default'
          });
        }
      }, 10000);
      
      setProcessingTimeout(timeout);
      
      // Start processing
      processData(data, mappings, category, subcategory)
        .catch(error => {
          console.error('Error in processing data:', error);
          toast({
            title: 'Processing Error',
            description: error instanceof Error ? error.message : 'An unknown error occurred',
            variant: 'destructive'
          });
        });
    }
    
    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [data, mappings, category, subcategory, processData, processingStarted, progress]);

  // Log processing state for debugging
  useEffect(() => {
    console.log('DataProcessor state:', {
      processingStarted,
      isProcessing,
      progress,
      hasResults: !!results,
      dataLength: data.length
    });
  }, [processingStarted, isProcessing, progress, results, data]);

  // This component is used to process data in the background
  // It doesn't render anything visible to the user
  return null;
};

export default DataProcessor;
