
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sampleFileContent } from '@/utils/dataProcessingUtils';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Edit2, Plus, X, ArrowRight, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processFileContent, processBatchFiles, DataMappingConfig } from '@/utils/dataProcessingUtils';
import { Progress } from '@/components/ui/progress';

export interface DataImporterAIProps {
  onCategorySelect: (category: string) => void;
  onMappingsGenerated: (mappings: Record<string, string>, schemaType: string) => void;
  isImporting: boolean;
  onDone: () => void;
}

const DataImporterAI: React.FC<DataImporterAIProps> = ({ 
  onCategorySelect, 
  onMappingsGenerated,
  isImporting,
  onDone
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    recommendedCategory: string;
    explanation: string;
    mappings: Record<string, string>;
    schemaType: string;
  } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customSchemaType, setCustomSchemaType] = useState('');
  const [customMappings, setCustomMappings] = useState<Record<string, string>>({});
  const [newFieldName, setNewFieldName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [settingsApplied, setSettingsApplied] = useState(false);
  
  // Additional states for direct upload functionality
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isDirectlyUploading, setIsDirectlyUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errorCount: number;
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

  const SCHEMA_TYPES = [
    'Thing', 'Product', 'Event', 'Organization', 'Person', 'Place', 
    'CreativeWork', 'Article', 'MedicalEntity', 'Drug', 'Store'
  ];

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setAnalysisResult(null);
    setIsEditing(false);
    setCustomCategory('');
    setCustomSchemaType('');
    setCustomMappings({});
    setSettingsApplied(false);
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
  
  // For direct upload functionality
  const onUploadDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadFiles(acceptedFiles);
    }
  }, []);

  const { getRootProps: getUploadRootProps, getInputProps: getUploadInputProps, isDragActive: isUploadDragActive } = useDropzone({
    onDrop: onUploadDrop,
    disabled: isDirectlyUploading || !settingsApplied,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
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
      const sampleRows = await sampleFileContent(selectedFile, 3);
      
      if (sampleRows.length === 0) {
        throw new Error("Couldn't extract data from the file.");
      }

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
      
      setCustomCategory(data.recommendedCategory);
      setCustomSchemaType(data.schemaType || 'Thing');
      setCustomMappings({...data.mappings});
      
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

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateMapping = (field: string, column: string) => {
    setCustomMappings(prev => ({
      ...prev,
      [field]: column
    }));
  };

  const handleAddNewMapping = () => {
    if (!newFieldName.trim() || !newColumnName.trim()) {
      toast({
        title: "Invalid Input",
        description: "Both field name and column name are required",
        variant: "destructive"
      });
      return;
    }

    setCustomMappings(prev => ({
      ...prev,
      [newFieldName.trim()]: newColumnName.trim()
    }));

    setNewFieldName('');
    setNewColumnName('');

    toast({
      title: "Mapping Added",
      description: `${newFieldName} ➝ ${newColumnName} added to mappings`
    });
  };

  const handleRemoveMapping = (field: string) => {
    setCustomMappings(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });

    toast({
      title: "Mapping Removed",
      description: `${field} mapping has been removed`
    });
  };

  const applyRecommendations = () => {
    if (!analysisResult && !isEditing) return;
    
    const categoryToApply = isEditing ? customCategory : analysisResult?.recommendedCategory || '';
    const schemaTypeToApply = isEditing ? customSchemaType : analysisResult?.schemaType || 'Thing';
    const mappingsToApply = isEditing ? customMappings : (analysisResult?.mappings || {});
    
    onCategorySelect(categoryToApply);
    onMappingsGenerated(mappingsToApply, schemaTypeToApply);
    setSettingsApplied(true);
    
    toast({
      title: "Recommendations Applied",
      description: isEditing ? 
        "Your custom settings have been applied to your import settings." :
        "The AI recommendations have been applied to your import settings.",
      variant: "default"
    });
  };

  const handleContinueToImport = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onDone callback provided by the parent component
    onDone();
    
    toast({
      title: "Continuing to Import",
      description: "Moving to the import step with your configured settings.",
      variant: "default"
    });
  };
  
  // Handle direct uploading from this component
  const handleDirectUpload = async () => {
    if (!uploadFiles.length || !settingsApplied) {
      toast({
        title: "Upload Failed",
        description: "Please select files and apply AI recommendations first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDirectlyUploading(true);
    setUploadProgress(0);
    setImportResult(null);
    
    try {
      const categoryToUse = isEditing ? customCategory : analysisResult?.recommendedCategory || '';
      const schemaTypeToUse = isEditing ? customSchemaType : analysisResult?.schemaType || 'Thing';
      const mappingsToUse = isEditing ? customMappings : (analysisResult?.mappings || {});
      
      // Create mapping config for the import process
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category: categoryToUse
        },
        schemaType: schemaTypeToUse
      };
      
      // Convert our mappings format to the expected format
      Object.entries(mappingsToUse).forEach(([field, column]) => {
        mappingConfig.columnMappings[field] = column;
      });
      
      // Process the files
      const result = await processBatchFiles(
        uploadFiles,
        mappingConfig,
        100, // Default batch size
        (current, total) => {
          setUploadProgress(Math.round((current / total) * 100));
        }
      );
      
      setImportResult({
        success: result.success,
        count: result.successRows,
        errorCount: result.errorCount
      });
      
      toast({
        title: result.success ? "Import Successful" : "Import Completed with Issues",
        description: `Imported ${result.successRows} items with ${result.errorCount} errors.`,
        variant: result.errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error("Error importing files:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDirectlyUploading(false);
    }
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

        {(analysisResult || isEditing) && (
          <div className="bg-secondary/20 p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Recommendations' : 'AI Recommendations'}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleEditMode}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                {isEditing ? 'View AI Recommendations' : 'Override'}
              </Button>
            </div>
            
            {!isEditing && analysisResult && (
              <p className="text-sm text-muted-foreground">{analysisResult.explanation}</p>
            )}
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-category">Category</Label>
                  <Select value={customCategory} onValueChange={setCustomCategory}>
                    <SelectTrigger id="custom-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-schema">Schema Type</Label>
                  <Select value={customSchemaType} onValueChange={setCustomSchemaType}>
                    <SelectTrigger id="custom-schema">
                      <SelectValue placeholder="Select schema type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEMA_TYPES.map(schema => (
                        <SelectItem key={schema} value={schema}>{schema}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Field Mappings</Label>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {Object.entries(customMappings).map(([field, column]) => (
                      <div key={field} className="grid grid-cols-12 gap-2 items-center">
                        <Label className="col-span-4">{field}:</Label>
                        <Input 
                          className="col-span-7"
                          value={column}
                          onChange={(e) => handleUpdateMapping(field, e.target.value)}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="col-span-1"
                          onClick={() => handleRemoveMapping(field)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t mt-2">
                    <Label className="mb-2 block">Add New Field Mapping</Label>
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Input 
                        className="col-span-4"
                        placeholder="Field name"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                      />
                      <Input 
                        className="col-span-7"
                        placeholder="Column name"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                      />
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="col-span-1"
                        onClick={handleAddNewMapping}
                      >
                        <Plus className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              analysisResult && (
                <div className="space-y-3">
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
                </div>
              )
            )}
            
            <Button 
              onClick={applyRecommendations} 
              className="w-full mt-2"
              variant="default"
              disabled={settingsApplied}
            >
              {isEditing ? 'Apply Custom Settings' : 'Apply AI Recommendations'}
            </Button>

            {settingsApplied && (
              <>
                {/* Direct file upload area */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your files using the AI recommended settings.
                  </p>
                  
                  <div 
                    {...getUploadRootProps()} 
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                      isUploadDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
                    } ${isDirectlyUploading || !settingsApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getUploadInputProps()} />
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-300">
                        {isUploadDragActive
                          ? 'Drop the files here...'
                          : 'Drag & drop files here, or click to select files'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Upload multiple files with the same structure
                      </p>
                    </div>
                  </div>
                  
                  {uploadFiles.length > 0 && (
                    <div className="mt-4 p-3 bg-secondary/10 rounded">
                      <p className="text-sm font-medium">Selected files: {uploadFiles.length}</p>
                      <ul className="text-xs mt-1 space-y-1 max-h-28 overflow-y-auto">
                        {uploadFiles.map((file, index) => (
                          <li key={index} className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                        ))}
                      </ul>
                      
                      <Button 
                        onClick={handleDirectUpload} 
                        className="w-full mt-3"
                        disabled={isDirectlyUploading || !settingsApplied}
                      >
                        {isDirectlyUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Importing... ({uploadProgress}%)
                          </>
                        ) : 'Start Import'}
                      </Button>
                    </div>
                  )}
                  
                  {isDirectlyUploading && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  {importResult && (
                    <div className={`mt-4 p-3 rounded ${importResult.success ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'} border`}>
                      <h4 className="font-medium">Import {importResult.success ? 'Successful' : 'Completed'}</h4>
                      <p className="text-sm mt-1">
                        Successfully imported {importResult.count} items
                        {importResult.errorCount > 0 && ` with ${importResult.errorCount} errors`}.
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleContinueToImport} 
                  className="w-full mt-2"
                  variant="outline"
                  type="button"
                >
                  Continue to Advanced Import <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataImporterAI;
