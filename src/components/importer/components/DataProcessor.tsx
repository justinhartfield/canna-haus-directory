
import React from 'react';
import { DirectoryItem } from '@/types/directory';

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
  // This component is used to process data in the background
  // It doesn't render anything visible to the user
  return null;
};

export default DataProcessor;
