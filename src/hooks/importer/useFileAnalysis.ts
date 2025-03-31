
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportAnalysis } from '@/types/directory';
import { sampleFileContent, parseFileContent } from '@/utils/dataProcessingUtils';
import { supabase } from '@/integrations/supabase/client';

export function useFileAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  const analyzeFile = async (file: File, category: string = 'Uncategorized') => {
    setIsAnalyzing(true);
    try {
      // Sample the file to get some representative data
      const sampleRows = await sampleFileContent(file, 5); // Increased sample size for better analysis
      
      if (sampleRows.length === 0) {
        throw new Error("Couldn't extract data from the file.");
      }

      // Parse the full file content for later use
      const parsedData = await parseFileContent(file);

      // Store available columns for manual mapping
      const columns = Object.keys(sampleRows[0]);
      setAvailableColumns(columns);
      console.log(`Detected ${columns.length} columns in file:`, columns.join(', '));

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
      const suggestedMappings = [];
      const aiMappings = data.mappings || {};
      
      // Get all columns from the sample data
      const mappedColumns = new Set<string>();
      
      // Add mapped columns
      for (const [targetField, sourceColumn] of Object.entries(aiMappings)) {
        if (typeof sourceColumn === 'string') {
          mappedColumns.add(sourceColumn);
          suggestedMappings.push({
            sourceColumn,
            targetField: targetField || "ignore", // Ensure targetField is never empty
            isCustomField: !['title', 'description', 'subcategory', 'tags', 'imageUrl', 'thumbnailUrl'].includes(targetField),
            sampleData: sampleRows[0][sourceColumn]
          });
        }
      }
      
      // Find unmapped columns
      const unmappedColumns = columns.filter(col => !mappedColumns.has(col));
      console.log(`Found ${unmappedColumns.length} unmapped columns:`, unmappedColumns);
      
      // Add unmapped columns with "ignore" target
      unmappedColumns.forEach(column => {
        suggestedMappings.push({
          sourceColumn: column,
          targetField: "ignore",
          isCustomField: false,
          sampleData: sampleRows[0][column]
        });
      });
      
      const aiAnalysis: ImportAnalysis = {
        suggestedMappings,
        unmappedColumns,
        sampleData: sampleRows[0],
        parsedData // Include the full parsed data
      };
      
      setAnalysis(aiAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: `AI suggests ${data.recommendedCategory} category with ${Object.keys(aiMappings).length} mapped fields and ${unmappedColumns.length} additional fields available for mapping.`,
      });

      return {
        analysis: aiAnalysis,
        recommendedCategory: data.recommendedCategory || category,
        schemaType: data.schemaType || 'Thing'
      };
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred. Switching to manual mapping mode.",
        variant: "destructive"
      });
      
      return { error };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analysis,
    availableColumns,
    analyzeFile,
    setAnalysis,
    setAvailableColumns
  };
}
