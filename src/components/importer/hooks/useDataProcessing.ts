
import { useState } from 'react';
import { DirectoryItem, ColumnMapping } from '@/types/directory';
import { processBatchWithDuplicateHandling, checkBatchForDuplicates } from '@/api/services/directoryItem/bulkOperations';
import { transformData } from '@/utils/transform';

export interface ProcessingHookResult {
  isProcessing: boolean;
  progress: {
    processed: number;
    total: number;
    current: number;
    succeeded: number;
    failed: number;
    skipped: number;
    duplicates: number;
    errors: string[];
  };
  uploadProgress: number;
  currentStatus: string;
  missingColumns: string[];
  duplicates: Partial<DirectoryItem>[];
  startProcessing: (file: File, columnMappings: ColumnMapping[], customFields: Record<string, string>, category: string, schemaType: string) => Promise<{
    items: DirectoryItem[];
    errors: string[];
    duplicates: Partial<DirectoryItem>[];
  }>;
  reset: () => void;
}

export function useDataProcessing(): ProcessingHookResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({
    processed: 0,
    total: 0,
    current: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    duplicates: 0,
    errors: [] as string[]
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<Partial<DirectoryItem>[]>([]);

  const reset = () => {
    setIsProcessing(false);
    setProgress({
      processed: 0,
      total: 0,
      current: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      duplicates: 0,
      errors: []
    });
    setUploadProgress(0);
    setCurrentStatus('');
    setMissingColumns([]);
    setDuplicates([]);
  };

  const startProcessing = async (
    file: File,
    columnMappings: ColumnMapping[],
    customFields: Record<string, string>,
    category: string,
    schemaType: string
  ) => {
    setIsProcessing(true);
    setCurrentStatus('Analyzing file');
    setProgress(prev => ({ ...prev, total: 1, current: 0 }));

    try {
      // First, check that all required mappings exist
      const requiredFields = ['title'];
      const missingRequiredFields = requiredFields.filter(field => 
        !columnMappings.some(mapping => mapping.targetField === field)
      );

      if (missingRequiredFields.length > 0) {
        setMissingColumns(missingRequiredFields);
        throw new Error(`Missing required column mappings: ${missingRequiredFields.join(', ')}`);
      }

      // Create a mapping configuration from column mappings
      const mappingConfig = {
        columnMappings: {},
        defaultValues: { category },
        schemaType
      };

      // Convert our UI representation to the format transformData expects
      columnMappings.forEach(mapping => {
        if (mapping.targetField && mapping.sourceColumn) {
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });

      // Add custom fields
      Object.entries(customFields).forEach(([field, value]) => {
        if (value) {
          mappingConfig.defaultValues[field] = value;
        }
      });

      setCurrentStatus('Transforming data');
      setUploadProgress(25);

      // Transform the data
      const transformResult = await transformData(file, mappingConfig);

      if (transformResult.success && transformResult.data) {
        setCurrentStatus('Checking for duplicates');
        setUploadProgress(50);

        // Check for duplicates
        const compositeKeyFields = ['title', 'category', 'additionalFields.breeder', 'subcategory'];
        const duplicateCheck = await checkBatchForDuplicates(transformResult.data, compositeKeyFields);

        if (duplicateCheck.duplicates.length > 0) {
          setDuplicates(duplicateCheck.duplicates);
          setProgress(prev => ({ 
            ...prev, 
            duplicates: duplicateCheck.duplicates.length 
          }));
        }

        setCurrentStatus('Processing data');
        setUploadProgress(75);

        // Process with duplicate handling
        const result = await processBatchWithDuplicateHandling(
          transformResult.data,
          'skip', // Default handling mode
          compositeKeyFields
        );

        setCurrentStatus('Complete');
        setUploadProgress(100);
        setProgress(prev => ({
          ...prev,
          processed: transformResult.data.length,
          succeeded: result.processed.length,
          skipped: result.skipped.length,
          duplicates: duplicateCheck.duplicates.length
        }));

        return {
          items: result.existingItems,
          errors: [],
          duplicates: duplicateCheck.duplicates
        };
      } else {
        throw new Error(transformResult.error || 'Unknown error during transformation');
      }
    } catch (error) {
      setCurrentStatus('Error');
      console.error('Processing error:', error);
      setProgress(prev => ({
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Unknown error']
      }));
      
      return {
        items: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duplicates: []
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    uploadProgress,
    currentStatus,
    missingColumns,
    duplicates,
    startProcessing,
    reset
  };
}
