
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDataProcessing } from '../hooks/useDataProcessing';
import { ProgressIndicator } from './ProgressIndicator';
import { MissingColumnsAlert } from './MissingColumnsAlert';
import { DataMappingConfig, MappingConfiguration } from '../types/importerTypes';

interface DataProcessorProps {
  file: File;
  columnMappings: MappingConfiguration[];
  customFields: Record<string, string>;
  selectedCategory: string;
  schemaType: string;
  onComplete: (data: any[]) => void;
  onCancel: () => void;
}

export const DataProcessor: React.FC<DataProcessorProps> = ({
  file,
  columnMappings,
  customFields,
  selectedCategory,
  schemaType,
  onComplete,
  onCancel
}) => {
  const {
    isProcessing,
    progress,
    uploadProgress,
    currentStatus,
    missingColumns,
    processFile
  } = useDataProcessing();

  const handleProcessFile = async () => {
    const result = await processFile({
      file,
      columnMappings,
      customFields,
      selectedCategory,
      schemaType
    });
    
    onComplete(result.items);
  };

  return (
    <div className="space-y-4">
      <MissingColumnsAlert missingColumns={missingColumns} />
      
      <ProgressIndicator 
        isProcessing={isProcessing}
        currentStatus={currentStatus}
        progress={progress}
        uploadProgress={uploadProgress}
      />
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleProcessFile}
          disabled={isProcessing}
        >
          {isProcessing ? 
            (currentStatus === 'processing' ? "Processing..." : "Uploading...") 
            : "Upload Data"}
        </Button>
      </div>
    </div>
  );
};
