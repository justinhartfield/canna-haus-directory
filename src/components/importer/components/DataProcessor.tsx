
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { processFileContent } from '@/utils/dataProcessingUtils';
import { DirectoryItem } from '@/types/directory';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DataMappingConfig, MappingConfiguration } from '../types/importerTypes';
import { bulkInsertDirectoryItems } from '@/api/directoryService';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'processing' | 'uploading'>('idle');
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const handleProcessFile = async () => {
    setIsProcessing(true);
    setProgress(0);
    setUploadProgress(0);
    setCurrentStatus('processing');
    setMissingColumns([]);
    
    try {
      // Validate mappings
      const hasTitleMapping = columnMappings.some(
        mapping => mapping.targetField === 'title' && mapping.sourceColumn
      );
      
      const hasDescriptionMapping = columnMappings.some(
        mapping => mapping.targetField === 'description' && mapping.sourceColumn
      );
      
      if (!hasTitleMapping) {
        throw new Error("You must map a column to the Title field");
      }
      
      if (!hasDescriptionMapping) {
        toast({
          title: "Warning: No Description Field",
          description: "No column is mapped to Description. A default value will be used.",
          variant: "default" // Changed from "warning" to "default"
        });
      }
      
      // Create mapping configuration from the user's selections
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category: selectedCategory,
          description: "No description provided" // Default description for missing values
        },
        schemaType
      };
      
      // Process column mappings, handling custom fields
      columnMappings.forEach(mapping => {
        if (!mapping.targetField || mapping.targetField === 'ignore') return; // Skip unmapped columns
        
        if (mapping.isCustomField) {
          // For custom fields, use the custom name or the source column
          const customFieldName = customFields[mapping.sourceColumn] || mapping.sourceColumn;
          mappingConfig.columnMappings[`additionalFields.${customFieldName}`] = mapping.sourceColumn;
        } else {
          // For standard fields, use the target field directly
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });
      
      console.log("Processing with mapping config:", mappingConfig);
      
      // Process the file with progress updates
      const result = await processFileContent(file, mappingConfig);
      
      setProgress(100);
      
      // Handle missing columns and show warnings
      if (result.missingColumns && result.missingColumns.length > 0) {
        setMissingColumns(result.missingColumns);
        
        toast({
          title: "Warning: Some columns not found",
          description: `${result.missingColumns.length} mapped columns were not found in your data file.`,
          variant: "destructive" // Changed from "warning" to "destructive" since it's more critical
        });
      }
      
      if (!result.success && result.processedRows === 0) {
        throw new Error(`File processing failed with ${result.errorCount} errors: ${result.errors.map(e => e.message).join(', ')}`);
      }
      
      // Now upload to Supabase
      setCurrentStatus('uploading');
      
      // Batch upload to Supabase if there are successful items
      if (result.items.length > 0) {
        try {
          // Upload processed items to Supabase
          setUploadProgress(10);
          const uploadedItems = await bulkInsertDirectoryItems(result.items as unknown as DirectoryItem[]);
          setUploadProgress(100);
          
          toast({
            title: "Upload Complete",
            description: `Successfully uploaded ${uploadedItems.length} items to database`,
          });
          
          // Return processed and uploaded items to the parent component
          onComplete(uploadedItems);
        } catch (uploadError) {
          console.error("Error uploading to Supabase:", uploadError);
          toast({
            title: "Upload Failed",
            description: uploadError instanceof Error ? uploadError.message : "Failed to upload data to the database",
            variant: "destructive"
          });
          // Still return the processed items so they're not lost
          onComplete(result.items as unknown as DirectoryItem[]);
        }
      } else {
        onComplete([]);
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setProgress(0);
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
      setCurrentStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      {missingColumns.length > 0 && (
        <Alert variant="default"> {/* Changed from "warning" to "default" */}
          <AlertTitle>Missing Columns</AlertTitle>
          <AlertDescription>
            <p>The following columns were not found in your data file:</p>
            <ul className="list-disc pl-5 mt-2">
              {missingColumns.map((column, index) => (
                <li key={index}>{column}</li>
              ))}
            </ul>
            <p className="mt-2">Your data will be imported without these fields.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {isProcessing && (
        <div className="space-y-4">
          {currentStatus === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {currentStatus === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading to database...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
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
