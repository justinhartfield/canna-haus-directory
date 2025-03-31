
import { useState, useEffect } from 'react';
import { parseFileContent } from '@/utils/fileProcessing';
import { toast } from '@/hooks/use-toast';
import { useFileAnalysis } from './useFileAnalysis';
import { useColumnMappingState } from './useColumnMappingState';

interface UseColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  category?: string;
}

export const useColumnMapper = ({ file, category = 'Uncategorized' }: UseColumnMapperProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [parsedData, setParsedData] = useState<Array<Record<string, any>> | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [manualMappingMode, setManualMappingMode] = useState(false);
  const [schemaType, setSchemaType] = useState('');

  // Use the file analysis hook
  const { analysis, analyzeFile, isAnalyzing: isFileAnalyzing, availableColumns: detectedColumns } = useFileAnalysis();

  // Use the column mapping hook
  const {
    columnMappings,
    setColumnMappings,
    customFields,
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping
  } = useColumnMappingState();

  // Initialize data parsing when component loads
  useEffect(() => {
    const loadFileData = async () => {
      try {
        // Parse file content using the correct utility function
        const data = await parseFileContent(file.file);

        // Store the parsed data
        setParsedData(data);
        
        // Extract all possible columns by scanning all rows
        const allColumnsSet = new Set<string>();
        
        // Scan through all rows (up to a limit) to collect all possible columns
        const scanLimit = Math.min(data.length, 100);
        for (let i = 0; i < scanLimit; i++) {
          Object.keys(data[i]).forEach(key => allColumnsSet.add(key));
        }
        
        const allColumns = Array.from(allColumnsSet);
        setAvailableColumns(allColumns);
        console.log(`Detected ${allColumns.length} unique columns in file:`, allColumns.join(', '));
        
        // Start the analysis of the file
        analyzeFile(file.file);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: 'File Parsing Error',
          description: error instanceof Error ? error.message : 'Failed to parse the file',
          variant: 'destructive'
        });
        
        setManualMappingMode(true);
        setIsAnalyzing(false);
      }
    };

    loadFileData();
  }, [file]);

  // Sync available columns from file analysis
  useEffect(() => {
    if (detectedColumns.length > 0) {
      setAvailableColumns(detectedColumns);
    }
  }, [detectedColumns]);

  // Update mappings when analysis completes
  useEffect(() => {
    if (analysis) {
      // Set the schema type from analysis
      if (analysis.schemaType) {
        setSchemaType(analysis.schemaType);
      }
      
      // Set the suggested mappings from analysis
      if (analysis.suggestedMappings && analysis.suggestedMappings.length > 0) {
        setColumnMappings(analysis.suggestedMappings);
      }
      
      setIsAnalyzing(false);
    }
  }, [analysis]);

  // Function to toggle between manual and AI mode
  const toggleManualMode = () => {
    setManualMappingMode(!manualMappingMode);
  };

  return {
    isAnalyzing: isAnalyzing || isFileAnalyzing,
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    analysis,
    columnMappings,
    schemaType,
    setSchemaType,
    selectedCategory,
    setSelectedCategory,
    customFields,
    availableColumns,
    manualMappingMode,
    setManualMappingMode,
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping,
    toggleManualMode,
    analyzeFile: () => {
      setIsAnalyzing(true);
      analyzeFile(file.file);
    },
    parsedData,
    processingComplete,
    setProcessingComplete
  };
};
