
import React, { useEffect } from 'react';
import { DirectoryItem } from '@/types/directory';
import { useDataProcessing } from '@/components/importer/hooks/useDataProcessing';

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
  const { processData, progress } = useDataProcessing({
    onComplete: onProcessComplete
  });

  useEffect(() => {
    // Update parent component with progress
    onProgress(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    // Only process data if there's actual data to process
    if (data && data.length > 0) {
      processData(data, mappings, category, subcategory);
    }
  }, [data, mappings, category, subcategory, processData]);

  // This component is used to process data in the background
  // It doesn't render anything visible to the user
  return null;
};

export default DataProcessor;
