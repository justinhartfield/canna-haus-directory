
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportAnalysis, ColumnMapping } from '@/types/directory';
import { sampleFileContent } from '@/utils/dataProcessingUtils';
import { supabase } from '@/integrations/supabase/client';

interface UseColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  category?: string;
}

export function useColumnMapper({ file, category = 'Uncategorized' }: UseColumnMapperProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [schemaType, setSchemaType] = useState('Thing');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [manualMappingMode, setManualMappingMode] = useState(false);

  const analyzeFile = async () => {
    setIsAnalyzing(true);
    try {
      // Sample the file to get some representative data
      const sampleRows = await sampleFileContent(file.file, 3);
      
      if (sampleRows.length === 0) {
        throw new Error("Couldn't extract data from the file.");
      }

      // Store available columns for manual mapping
      setAvailableColumns(Object.keys(sampleRows[0]));

      // Call the edge function to classify the data
      const { data, error } = await supabase.functions.invoke('classify-csv-data', {
        body: {
          sampleData: sampleRows,
          availableCategories: [
            'Strains', 'Medical', 'Extraction', 'Cultivation',
            'Dispensaries', 'Lab Data', 'Compliance', 'Products', 'Educational'
          ]
        }
      });

      if (error) {
        throw new Error(`Error calling classification function: ${error.message}`);
      }

      if (!data) {
        throw new Error("No classification data returned.");
      }

      // Convert AI response to our format
      const suggestedMappings: ColumnMapping[] = [];
      const aiMappings = data.mappings || {};
      
      // Get all columns from the sample data
      const columns = Object.keys(sampleRows[0]);
      const mappedColumns = new Set(Object.values(aiMappings));
      
      // Add mapped columns
      for (const [targetField, sourceColumn] of Object.entries(aiMappings)) {
        suggestedMappings.push({
          sourceColumn: sourceColumn as string,
          targetField,
          isCustomField: !['title', 'description', 'subcategory', 'tags', 'imageUrl', 'thumbnailUrl'].includes(targetField),
          sampleData: sampleRows[0][sourceColumn as string]
        });
      }
      
      // Add unmapped columns
      const unmappedColumns = columns.filter(col => !mappedColumns.has(col));
      
      const aiAnalysis: ImportAnalysis = {
        suggestedMappings,
        unmappedColumns,
        sampleData: sampleRows[0]
      };
      
      setAnalysis(aiAnalysis);
      setColumnMappings(suggestedMappings);
      setSelectedCategory(data.recommendedCategory || category);
      setSchemaType(data.schemaType || 'Thing');
      
      toast({
        title: "Analysis Complete",
        description: `AI suggests ${data.recommendedCategory} category with ${suggestedMappings.length} mapped fields`,
      });
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // If AI analysis fails, set up for manual mapping
      setManualMappingMode(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMappingChange = (index: number, targetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = targetField;
    newMappings[index].isCustomField = !['title', 'description', 'subcategory', 'tags', 'imageUrl', 'thumbnailUrl'].includes(targetField);
    setColumnMappings(newMappings);
  };

  const handleCustomFieldNameChange = (sourceColumn: string, customName: string) => {
    setCustomFields({
      ...customFields,
      [sourceColumn]: customName
    });
  };

  const handleSourceColumnChange = (index: number, sourceColumn: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].sourceColumn = sourceColumn;
    newMappings[index].sampleData = analysis?.sampleData[sourceColumn];
    setColumnMappings(newMappings);
  };

  const handleAddMapping = () => {
    if (availableColumns.length === 0) return;
    
    setColumnMappings([
      ...columnMappings,
      {
        sourceColumn: availableColumns[0],
        targetField: '',
        isCustomField: false,
        sampleData: analysis?.sampleData[availableColumns[0]]
      }
    ]);
  };

  const handleRemoveMapping = (index: number) => {
    const newMappings = [...columnMappings];
    newMappings.splice(index, 1);
    setColumnMappings(newMappings);
  };

  const toggleManualMode = () => {
    setManualMappingMode(!manualMappingMode);
  };

  // Trigger file analysis on mount
  useEffect(() => {
    analyzeFile();
  }, []);

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
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping,
    toggleManualMode
  };
}
