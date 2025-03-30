
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { processFileContent } from '@/utils/dataProcessingUtils';
import { DirectoryItem } from '@/types/directory';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcessFile = async () => {
    setIsProcessing(true);
    setProgress(0);
    
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
          variant: "default" 
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
      
      if (!result.success && result.processedRows === 0) {
        throw new Error(`File processing failed with ${result.errorCount} errors: ${result.errors.map(e => e.message).join(', ')}`);
      }
      
      // Show success or partial success message
      if (result.errorCount > 0) {
        toast({
          title: "Processing Completed with Warnings",
          description: `Processed ${result.processedRows} of ${result.totalRows} rows. ${result.errorCount} rows had issues but were processed with fallback values.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Processing Complete",
          description: `Successfully processed ${result.processedRows} of ${result.totalRows} rows`,
        });
      }
      
      // Return processed items to the parent component
      onComplete(result.items as unknown as DirectoryItem[]);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading and processing data...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
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
          {isProcessing ? "Processing..." : "Upload Data"}
        </Button>
      </div>
    </div>
  );
};
