
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ImportAnalysis, ColumnMapping } from '@/types/directory';
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

      // Extract all possible columns by scanning all rows
      const allColumnsSet = new Set<string>();
      
      // First check the sample rows
      sampleRows.forEach(row => {
        Object.keys(row).forEach(key => allColumnsSet.add(key));
      });
      
      // Then scan the first 100 rows of the full parsed data for any additional columns
      // This ensures we catch columns that might not appear in the first few rows
      const scanLimit = Math.min(parsedData.length, 100);
      for (let i = 0; i < scanLimit; i++) {
        Object.keys(parsedData[i]).forEach(key => allColumnsSet.add(key));
      }
      
      const columns = Array.from(allColumnsSet);
      setAvailableColumns(columns);
      console.log(`Detected ${columns.length} unique columns in file:`, columns.join(', '));

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
      
      // Track mapped columns
      const mappedColumns = new Set<string>();
      
      // Add mapped columns
      for (const [targetField, sourceColumn] of Object.entries(aiMappings)) {
        if (typeof sourceColumn === 'string') {
          mappedColumns.add(sourceColumn);
          
          // Find a sample value for this column
          let sampleValue = '';
          for (const row of sampleRows) {
            if (row[sourceColumn] !== undefined) {
              sampleValue = row[sourceColumn];
              break;
            }
          }
          
          suggestedMappings.push({
            sourceColumn,
            targetField: targetField || "ignore", // Ensure targetField is never empty
            isCustomField: !['title', 'description', 'subcategory', 'tags', 'imageUrl', 'thumbnailUrl'].includes(targetField),
            sampleData: sampleValue
          });
        }
      }
      
      // Find unmapped columns
      const unmappedColumns = columns.filter(col => !mappedColumns.has(col));
      console.log(`Found ${unmappedColumns.length} unmapped columns:`, unmappedColumns);
      
      // Create the analysis object with all required properties
      const aiAnalysis: ImportAnalysis = {
        suggestedMappings,
        unmappedColumns,
        sampleData: sampleRows[0],
        parsedData, // Include the full parsed data
        schemaType: data.schemaType || 'Thing',
        category: data.recommendedCategory || category
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
