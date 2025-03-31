import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportAnalysis } from '@/types/directory';
import { useFileAnalysis } from './useFileAnalysis';
import { useColumnMappingState } from './useColumnMappingState';

interface UseColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  category?: string;
}

export function useColumnMapper({ file, category = 'Uncategorized' }: UseColumnMapperProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schemaType, setSchemaType] = useState('Thing');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [manualMappingMode, setManualMappingMode] = useState(false);
  
  const {
    isAnalyzing,
    analysis,
    availableColumns,
    analyzeFile,
    setAnalysis
  } = useFileAnalysis();
  
  const {
    columnMappings,
    customFields,
    setColumnMappings,
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping,
    updateMappingsFromAnalysis
  } = useColumnMappingState();

  const toggleManualMode = () => {
    // If switching to manual mode from AI mode, preserve the current mappings
    if (!manualMappingMode && analysis) {
      // Keep existing mappings
    } else if (manualMappingMode && availableColumns.length > 0) {
      // When switching back to AI mode, attempt to restore AI recommendations
      if (analysis) {
        updateMappingsFromAnalysis(analysis);
      }
    }
    
    setManualMappingMode(!manualMappingMode);
    
    toast({
      title: !manualMappingMode ? "Manual Mapping Enabled" : "AI-Assisted Mapping Enabled",
      description: !manualMappingMode 
        ? "You can now manually configure all column mappings." 
        : "AI recommendations have been restored. You can still modify these mappings."
    });
  };

  // Trigger file analysis on mount
  useEffect(() => {
    const runAnalysis = async () => {
      const result = await analyzeFile(file.file, category);
      
      if (!result.error) {
        setSelectedCategory(result.recommendedCategory);
        setSchemaType(result.schemaType);
        if (result.analysis) {
          updateMappingsFromAnalysis(result.analysis);
        }
      } else {
        // If analysis failed, enable manual mapping mode
        setManualMappingMode(true);
      }
    };
    
    runAnalysis();
  }, []);

  // Wrapper for handleAddMapping to pass in availableColumns and analysis
  const addMappingWrapper = () => {
    handleAddMapping(availableColumns, analysis?.sampleData);
  };

  // Wrapper for handleSourceColumnChange to pass in analysis
  const sourceColumnChangeWrapper = (index: number, sourceColumn: string) => {
    handleSourceColumnChange(index, sourceColumn, analysis?.sampleData);
  };

  return {
    isAnalyzing,
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
    handleSourceColumnChange: sourceColumnChangeWrapper,
    handleAddMapping: addMappingWrapper,
    handleRemoveMapping,
    toggleManualMode,
    analyzeFile: () => analyzeFile(file.file, category)
  };
}
