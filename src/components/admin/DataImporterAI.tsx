
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { sampleFileContent } from '@/utils/dataProcessingUtils';
import { supabase } from '@/integrations/supabase/client';
import FileUploader from './importer/FileUploader';
import SelectedFileInfo from './importer/SelectedFileInfo';
import AnalysisResult from './importer/AnalysisResult';

interface DataImporterAIProps {
  onCategorySelect: (category: string) => void;
  onMappingsGenerated: (mappings: Record<string, string>, schemaType: string) => void;
  isImporting: boolean;
}

const DataImporterAI: React.FC<DataImporterAIProps> = ({ 
  onCategorySelect, 
  onMappingsGenerated,
  isImporting
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    recommendedCategory: string;
    explanation: string;
    mappings: Record<string, string>;
    schemaType: string;
  } | null>(null);

  const DEFAULT_CATEGORIES = [
    'Strains',
    'Medical',
    'Extraction',
    'Cultivation',
    'Dispensaries',
    'Lab Data',
    'Compliance',
    'Products',
    'Educational'
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Sample the file to get some representative data
      const sampleRows = await sampleFileContent(selectedFile, 3);
      
      if (sampleRows.length === 0) {
        throw new Error("Couldn't extract data from the file.");
      }

      // Call the edge function to classify the data
      const { data, error } = await supabase.functions.invoke('classify-csv-data', {
        body: {
          sampleData: sampleRows,
          availableCategories: DEFAULT_CATEGORIES
        }
      });

      if (error) {
        throw new Error(`Error calling classification function: ${error.message}`);
      }

      if (!data) {
        throw new Error("No classification data returned.");
      }

      setAnalysisResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Recommended category: ${data.recommendedCategory}`,
      });
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyRecommendations = () => {
    if (!analysisResult) return;
    
    onCategorySelect(analysisResult.recommendedCategory);
    onMappingsGenerated(analysisResult.mappings, analysisResult.schemaType);
    
    toast({
      title: "Recommendations Applied",
      description: "The AI recommendations have been applied to your import settings."
    });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FileUploader 
          onFileSelect={handleFileSelect}
          isAnalyzing={isAnalyzing}
          isImporting={isImporting}
        />

        {selectedFile && (
          <SelectedFileInfo
            fileName={selectedFile.name}
            onAnalyze={handleAnalyzeFile}
            isAnalyzing={isAnalyzing}
            isImporting={isImporting}
          />
        )}

        {analysisResult && (
          <AnalysisResult
            result={analysisResult}
            onApplyRecommendations={applyRecommendations}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DataImporterAI;
