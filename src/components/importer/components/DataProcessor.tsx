
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDataProcessing } from '../hooks/useDataProcessing';
import { ProgressIndicator } from './ProgressIndicator';
import { MissingColumnsAlert } from './MissingColumnsAlert';
import { DuplicatesAlert } from './DuplicatesAlert';
import { DataMappingConfig, MappingConfiguration } from '../types/importerTypes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [skipDuplicates, setSkipDuplicates] = useState(false);
  
  const {
    isProcessing,
    progress,
    uploadProgress,
    currentStatus,
    missingColumns,
    duplicates,
    processFile
  } = useDataProcessing();

  const handleProcessFile = async () => {
    const result = await processFile({
      file,
      columnMappings,
      customFields,
      selectedCategory,
      schemaType,
      skipDuplicates
    });
    
    onComplete(result.items);
  };

  return (
    <div className="space-y-4">
      <MissingColumnsAlert missingColumns={missingColumns} />
      
      {duplicates && duplicates.length > 0 && (
        <DuplicatesAlert 
          duplicates={duplicates} 
          onContinue={() => {
            setSkipDuplicates(true);
            handleProcessFile();
          }}
        />
      )}
      
      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="skip-duplicates"
          checked={skipDuplicates}
          onCheckedChange={setSkipDuplicates}
        />
        <Label htmlFor="skip-duplicates">Skip duplicate items during import</Label>
      </div>
      
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
            (currentStatus === 'processing' ? "Processing..." : 
             currentStatus === 'checking-duplicates' ? "Checking Duplicates..." :
             "Uploading...") 
            : "Upload Data"}
        </Button>
      </div>
    </div>
  );
};
