
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
  const { analysis, analyzeFile, isAnalyzing: isFileAnalyzing } = useFileAnalysis();

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
        
        // Extract column names from the first row
        if (data.length > 0) {
          const firstRow = data[0];
          setAvailableColumns(Object.keys(firstRow));
        }
        
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
