
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportProgress } from '@/types/directory';
import { DataMappingConfig, processFileContent, processBatchFiles, sampleFileContent, createMappingConfigFromSample } from '@/utils/dataProcessingUtils';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

export function useDataImporter() {
  const [category, setCategory] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('simple');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sampleData, setSampleData] = useState<Record<string, any>[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [schemaType, setSchemaType] = useState('Thing');
  const [batchSize, setBatchSize] = useState(100);
  
  const [progress, setProgress] = useState<ImportProgress>({
    totalFiles: 0,
    processedFiles: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    status: 'idle'
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!category) {
      toast({
        title: "Category Required",
        description: "Please select a category before uploading files.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(acceptedFiles);
    
    if (acceptedFiles.length > 0) {
      const sampleRows = await sampleFileContent(acceptedFiles[0]);
      setSampleData(sampleRows);
      
      try {
        const autoConfig = createMappingConfigFromSample(sampleRows, category);
        const mappings: ColumnMapping[] = [];
        
        for (const [targetField, sourceColumn] of Object.entries(autoConfig.columnMappings)) {
          mappings.push({
            sourceColumn,
            targetField
          });
        }
        
        setColumnMappings(mappings);
        setSchemaType(autoConfig.schemaType || 'Thing');
      } catch (error) {
        console.error('Error auto-detecting mappings:', error);
        if (sampleRows.length > 0) {
          const columns = Object.keys(sampleRows[0]);
          setColumnMappings(
            columns.map(col => ({
              sourceColumn: col,
              targetField: ''
            }))
          );
        }
      }
    }
  }, [category]);

  const handleSimpleImport = useCallback(async () => {
    if (!category || selectedFiles.length === 0) {
      toast({
        title: "Required Information Missing",
        description: "Please select a category and at least one file.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setProgress({
      totalFiles: selectedFiles.length,
      processedFiles: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      status: 'processing'
    });

    try {
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category
        },
        schemaType: 'Thing'
      };
      
      columnMappings.forEach(mapping => {
        if (mapping.targetField) {
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });
      
      mappingConfig.schemaType = schemaType;
      
      const result = await processBatchFiles(
        selectedFiles,
        mappingConfig,
        batchSize,
        (current, total) => {
          setProgress(prev => ({
            ...prev,
            processedFiles: current
          }));
        }
      );
      
      setProgress(prev => ({
        ...prev,
        successCount: result.successRows,
        errorCount: result.errorCount,
        errors: result.errors.map(err => ({
          file: err.file,
          error: err.errors.map(e => `Row ${e.row}: ${e.message}`).join(', ')
        })),
        status: result.errors.length > 0 ? 'error' : 'complete'
      }));
      
      toast({
        title: "Import Complete",
        description: `Successfully imported ${result.successRows} items with ${result.errorCount} errors.`,
        variant: result.errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error during import:', error);
      
      setProgress(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        errors: [
          ...prev.errors,
          {
            file: 'Import Process',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        ],
        status: 'error'
      }));
      
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Unknown error during import',
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  }, [category, selectedFiles, columnMappings, schemaType, batchSize]);

  const handleMappingChange = (index: number, targetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = targetField;
    setColumnMappings(newMappings);
  };

  const handleAiCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };
  
  const handleAiMappingsGenerated = (mappings: Record<string, string>, aiSchemaType: string) => {
    const newColumnMappings: ColumnMapping[] = [];
    
    if (sampleData.length > 0) {
      const columns = Object.keys(sampleData[0]);
      
      for (const column of columns) {
        let mapped = false;
        for (const [field, mappedColumn] of Object.entries(mappings)) {
          if (mappedColumn === column) {
            newColumnMappings.push({
              sourceColumn: column,
              targetField: field
            });
            mapped = true;
            break;
          }
        }
        
        if (!mapped) {
          newColumnMappings.push({
            sourceColumn: column,
            targetField: ''
          });
        }
      }
    }
    
    setColumnMappings(newColumnMappings);
    setSchemaType(aiSchemaType);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setSampleData([]);
    setColumnMappings([]);
  };

  const clearResults = () => {
    setProgress({
      totalFiles: 0,
      processedFiles: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      status: 'idle'
    });
  };

  return {
    category,
    setCategory,
    isImporting,
    activeTab,
    setActiveTab,
    selectedFiles,
    sampleData,
    columnMappings,
    schemaType,
    setSchemaType,
    batchSize,
    setBatchSize,
    progress,
    onDrop,
    handleSimpleImport,
    handleMappingChange,
    handleAiCategorySelect,
    handleAiMappingsGenerated,
    clearFiles,
    clearResults
  };
}
