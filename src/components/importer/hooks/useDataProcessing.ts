
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { processFileContent } from '@/utils/dataProcessingUtils';
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig, MappingConfiguration } from '../types/importerTypes';
import { bulkInsertDirectoryItems } from '@/api/directoryService';

export interface ProcessingOptions {
  file: File;
  columnMappings: MappingConfiguration[];
  customFields: Record<string, string>;
  selectedCategory: string;
  schemaType: string;
}

export interface ProcessingResult {
  success: boolean;
  items: DirectoryItem[];
  missingColumns: string[];
}

export function useDataProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'processing' | 'uploading'>('idle');
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const validateMappings = (mappings: MappingConfiguration[]) => {
    const hasTitleMapping = mappings.some(
      mapping => mapping.targetField === 'title' && mapping.sourceColumn
    );
    
    const hasDescriptionMapping = mappings.some(
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
    
    return { hasTitleMapping, hasDescriptionMapping };
  };

  const createMappingConfig = (options: ProcessingOptions): DataMappingConfig => {
    const { columnMappings, customFields, selectedCategory, schemaType } = options;
    
    const mappingConfig: DataMappingConfig = {
      columnMappings: {},
      defaultValues: {
        category: selectedCategory,
        description: "No description provided"
      },
      schemaType
    };
    
    columnMappings.forEach(mapping => {
      if (!mapping.targetField || mapping.targetField === 'ignore') return;
      
      if (mapping.isCustomField) {
        const customFieldName = customFields[mapping.sourceColumn] || mapping.sourceColumn;
        mappingConfig.columnMappings[`additionalFields.${customFieldName}`] = mapping.sourceColumn;
      } else {
        mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
      }
    });
    
    return mappingConfig;
  };

  const processFile = async (options: ProcessingOptions): Promise<ProcessingResult> => {
    setIsProcessing(true);
    setProgress(0);
    setUploadProgress(0);
    setCurrentStatus('processing');
    setMissingColumns([]);
    
    try {
      // Validate mappings
      validateMappings(options.columnMappings);
      
      // Create mapping configuration
      const mappingConfig = createMappingConfig(options);
      
      console.log("Processing with mapping config:", mappingConfig);
      
      // Process the file with progress updates
      const result = await processFileContent(options.file, mappingConfig);
      
      setProgress(100);
      
      // Handle missing columns and show warnings
      if (result.missingColumns && result.missingColumns.length > 0) {
        setMissingColumns(result.missingColumns);
        
        toast({
          title: "Warning: Some columns not found",
          description: `${result.missingColumns.length} mapped columns were not found in your data file.`,
          variant: "destructive"
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
          console.log(`Uploading ${result.items.length} items to Supabase`);
          // Sample the first item for debugging
          console.log('Sample item:', JSON.stringify(result.items[0]));
          
          // Upload processed items to Supabase
          setUploadProgress(10);
          const uploadedItems = await bulkInsertDirectoryItems(result.items as unknown as DirectoryItem[]);
          setUploadProgress(100);
          
          toast({
            title: "Upload Complete",
            description: `Successfully uploaded ${uploadedItems.length} items to database`,
          });
          
          return {
            success: true,
            items: uploadedItems,
            missingColumns: result.missingColumns || []
          };
        } catch (uploadError) {
          console.error("Error uploading to Supabase:", uploadError);
          
          const errorMessage = uploadError instanceof Error 
            ? uploadError.message 
            : "Failed to upload data to the database";
            
          toast({
            title: "Upload Failed",
            description: errorMessage,
            variant: "destructive"
          });
          
          return {
            success: false,
            items: result.items as unknown as DirectoryItem[],
            missingColumns: result.missingColumns || []
          };
        }
      } else {
        return {
          success: true,
          items: [],
          missingColumns: result.missingColumns || []
        };
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
      
      return {
        success: false,
        items: [],
        missingColumns: []
      };
    } finally {
      setIsProcessing(false);
      setCurrentStatus('idle');
    }
  };

  return {
    isProcessing,
    progress,
    uploadProgress,
    currentStatus,
    missingColumns,
    processFile
  };
}
