
import { useState, useCallback } from 'react';
import { DirectoryItem } from '@/types/directory';
import { bulkInsertDirectoryItems, checkBatchForDuplicates } from '@/api/services/directoryItem/bulkOperations';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { read, utils } from 'xlsx';

interface ProcessingHookResult {
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
  processFile: (
    file: File,
    columnMappings: any[],
    customFields: any[],
    category: string,
    schemaType: string
  ) => Promise<DirectoryItem[]>;
}

export const useDataProcessing = (): ProcessingHookResult => {
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

  const processFile = useCallback(async (
    file: File,
    columnMappings: any[],
    customFields: any[],
    category: string,
    schemaType: string
  ): Promise<DirectoryItem[]> => {
    setIsProcessing(true);
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

    try {
      // Parse the file based on its type
      let data: any[] = [];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: resolve,
            error: reject
          });
        });
        data = result.data;
      } else if (
        file.name.toLowerCase().endsWith('.xlsx') || 
        file.name.toLowerCase().endsWith('.xls')
      ) {
        const buffer = await file.arrayBuffer();
        const workbook = read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = utils.sheet_to_json(worksheet);
      }

      // Update progress total
      setProgress(prev => ({
        ...prev,
        total: data.length
      }));

      // Apply column mappings to create directory items
      const items: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>[] = data.map((row, index) => {
        // Create the base item
        const item: Partial<DirectoryItem> = {
          title: '',
          description: '',
          category,
          jsonLd: { '@type': schemaType },
          additionalFields: {},
          metaData: { importSource: file.name }
        };

        // Apply standard field mappings
        columnMappings.forEach(mapping => {
          if (mapping.sourceColumn && mapping.targetField && !mapping.isCustomField) {
            const value = row[mapping.sourceColumn];
            if (value !== undefined && value !== null) {
              if (mapping.targetField.includes('.')) {
                // Handle nested fields (e.g., jsonLd.name)
                const [parent, child] = mapping.targetField.split('.');
                if (parent === 'jsonLd') {
                  item.jsonLd = { ...item.jsonLd, [child]: value };
                }
              } else {
                // Handle top-level fields
                (item as any)[mapping.targetField] = value;
              }
            }
          }
        });

        // Apply custom field mappings
        customFields.forEach(customField => {
          if (customField.sourceColumn && customField.fieldName) {
            const value = row[customField.sourceColumn];
            if (value !== undefined && value !== null) {
              if (!item.additionalFields) {
                item.additionalFields = {};
              }
              item.additionalFields[customField.fieldName] = value;
            }
          }
        });

        // Update progress
        setProgress(prev => ({
          ...prev,
          current: index + 1
        }));

        return item as Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>;
      });

      // Check for duplicates
      const duplicates = await checkBatchForDuplicates(items);
      setProgress(prev => ({
        ...prev,
        duplicates: duplicates.length
      }));

      // Insert the items to the database
      const insertedItems = await bulkInsertDirectoryItems(items, {
        duplicateHandlingMode: 'skip',
        batchSize: 10
      });

      // Update final progress
      setProgress(prev => ({
        ...prev,
        processed: items.length,
        succeeded: insertedItems.length,
        failed: items.length - insertedItems.length - duplicates.length,
        skipped: duplicates.length,
      }));

      toast.success(`Processed ${items.length} items: ${insertedItems.length} imported, ${duplicates.length} skipped as duplicates`);
      return insertedItems;
    } catch (error) {
      console.error('Error processing file:', error);
      setProgress(prev => ({
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : String(error)]
      }));
      toast.error(error instanceof Error ? error.message : 'An error occurred while processing the file');
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    progress,
    processFile
  };
};

export default useDataProcessing;
