
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sampleFileContent } from '@/utils/dataProcessingUtils';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Take the first file for analysis
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isAnalyzing || isImporting,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

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
      
      // Update parent component with the classification results
      if (data.recommendedCategory) {
        onCategorySelect(data.recommendedCategory);
      }
      
      if (data.mappings) {
        onMappingsGenerated(data.mappings, data.schemaType || 'Thing');
      }
      
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
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
          } ${isAnalyzing || isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm text-gray-300">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a CSV or Excel file for AI analysis, or click to select a file'}
            </p>
            <p className="text-xs text-gray-400">
              The AI will analyze the file and recommend the appropriate category and field mappings
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="bg-secondary/20 p-3 rounded">
            <p className="text-sm font-medium">Selected file: {selectedFile.name}</p>
            <div className="mt-2 flex space-x-2">
              <Button 
                onClick={handleAnalyzeFile} 
                disabled={isAnalyzing || isImporting}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : 'Analyze with AI'}
              </Button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="bg-secondary/20 p-4 rounded space-y-3">
            <div>
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground">{analysisResult.explanation}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Recommended Category:</span>
                <span className="text-sm bg-primary/20 px-2 py-1 rounded">{analysisResult.recommendedCategory}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Recommended Schema Type:</span>
                <span className="text-sm bg-primary/20 px-2 py-1 rounded">{analysisResult.schemaType}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium">Suggested Mappings:</span>
                <div className="mt-1 text-sm border border-border rounded overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-1 px-2">Field</th>
                        <th className="text-left py-1 px-2">Source Column</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analysisResult.mappings).map(([field, column]) => (
                        <tr key={field} className="border-t border-border">
                          <td className="py-1 px-2">{field}</td>
                          <td className="py-1 px-2">{column}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <Button 
                onClick={applyRecommendations} 
                className="w-full mt-2"
                variant="default"
              >
                Apply Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataImporterAI;
