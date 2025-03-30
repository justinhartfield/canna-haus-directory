
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDataProcessing } from '../hooks/useDataProcessing';
import { ColumnMapping, DirectoryItem } from '@/types/directory';
import { ProgressIndicator } from './ProgressIndicator';
import { MissingColumnsAlert } from './MissingColumnsAlert';
import { DuplicatesAlert } from './DuplicatesAlert';

interface DataProcessorProps {
  file: File;
  columnMappings: ColumnMapping[];
  customFields: Record<string, string>;
  selectedCategory: string;
  schemaType: string;
  onComplete: (data: { items: DirectoryItem[]; errors: string[] }) => void;
  onCancel: () => void;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  file,
  columnMappings,
  customFields,
  selectedCategory,
  schemaType,
  onComplete,
  onCancel
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [duplicateHandlingMode, setDuplicateHandlingMode] = useState<'skip' | 'replace' | 'merge' | 'variant'>('skip');
  
  const {
    isProcessing,
    progress,
    uploadProgress,
    currentStatus,
    missingColumns,
    duplicates,
    startProcessing,
    reset
  } = useDataProcessing();

  const handleProcessData = async () => {
    const result = await startProcessing(
      file, 
      columnMappings, 
      customFields, 
      selectedCategory, 
      schemaType
    );
    onComplete(result);
  };

  return (
    <div className="space-y-6">
      {missingColumns.length > 0 && (
        <MissingColumnsAlert missingColumns={missingColumns} />
      )}
      
      {duplicates.length > 0 && (
        <DuplicatesAlert 
          duplicates={duplicates} 
          duplicateHandlingMode={duplicateHandlingMode}
          onModeChange={setDuplicateHandlingMode}
        />
      )}
      
      <Card className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Data Processing</h3>
              <p className="text-sm text-gray-400">
                Ready to import {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? 'Hide Options' : 'Advanced Options'}
            </Button>
          </div>
          
          {isProcessing && (
            <ProgressIndicator 
              progress={uploadProgress} 
              status={currentStatus}
            />
          )}
          
          {progress.processed > 0 && !isProcessing && (
            <div className="p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Processing Results</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Items:</div>
                <div>{progress.processed}</div>
                
                <div>Succeeded:</div>
                <div className="text-green-400">{progress.succeeded}</div>
                
                <div>Failed:</div>
                <div className="text-red-400">{progress.failed}</div>
                
                <div>Skipped:</div>
                <div className="text-yellow-400">{progress.skipped}</div>
                
                <div>Duplicates:</div>
                <div className="text-blue-400">{progress.duplicates}</div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleProcessData}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Data'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataProcessor;
