
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ColumnMapping, ImportAnalysis } from '@/types/directory';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Upload } from 'lucide-react';

interface AIColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  onComplete?: (data: any[]) => void;
  onCancel?: () => void;
  existingFields?: string[];
  category?: string;
}

const DEFAULT_FIELDS = [
  'title', 
  'description', 
  'category', 
  'subcategory', 
  'tags', 
  'imageUrl',
  'thumbnailUrl'
];

const AIColumnMapper: React.FC<AIColumnMapperProps> = ({ 
  file, 
  onComplete, 
  onCancel,
  existingFields = DEFAULT_FIELDS,
  category = 'Uncategorized'
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawData, setRawData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  // Read and parse the file contents
  useEffect(() => {
    if (!file.file) return;
    
    const parseFile = async () => {
      setIsAnalyzing(true);
      try {
        let data: any[] = [];
        
        if (file.type === 'csv') {
          const text = await file.file.text();
          const result = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
          });
          
          if (result.errors && result.errors.length > 0) {
            throw new Error(`CSV parsing error: ${result.errors[0].message}`);
          }
          
          data = result.data as any[];
        } else if (file.type === 'xlsx') {
          const buffer = await file.file.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        }
        
        if (data.length === 0) {
          throw new Error('No data found in file');
        }
        
        setRawData(data);
        
        // Auto-analyze columns using AI
        await analyzeColumnsWithAI(data);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to parse file',
          variant: 'destructive'
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    parseFile();
  }, [file]);

  // Analyze columns using AI
  const analyzeColumnsWithAI = async (data: any[]) => {
    try {
      // Take a sample of the data (first row)
      const sampleData = data[0];
      
      // Call the GPT analysis function
      const { data: aiData, error } = await supabase.functions.invoke('classify-csv-data', {
        body: {
          sampleData: [sampleData],
          availableFields: existingFields
        }
      });
      
      if (error) {
        throw new Error(`AI analysis error: ${error.message}`);
      }
      
      if (!aiData?.mappings) {
        throw new Error('AI analysis returned no mappings');
      }
      
      // Convert AI mappings to our format
      const suggestedMappings: ColumnMapping[] = [];
      const sourceColumns = Object.keys(sampleData);
      const mappedColumns = new Set<string>();
      
      // First process the AI suggested mappings
      for (const [targetField, sourceColumn] of Object.entries(aiData.mappings)) {
        if (sourceColumn && typeof sourceColumn === 'string' && sourceColumn in sampleData) {
          suggestedMappings.push({
            sourceColumn,
            targetField,
            isCustomField: !existingFields.includes(targetField),
            sampleData: String(sampleData[sourceColumn]).substring(0, 50)
          });
          mappedColumns.add(sourceColumn);
        }
      }
      
      // Add any unmapped columns as custom fields
      const unmappedColumns = sourceColumns.filter(col => !mappedColumns.has(col));
      
      // Generate analysis result
      const analysisResult: ImportAnalysis = {
        suggestedMappings,
        unmappedColumns,
        sampleData
      };
      
      setAnalysis(analysisResult);
      setColumnMappings(suggestedMappings);
      
      toast({
        title: 'Analysis Complete',
        description: `AI mapped ${suggestedMappings.length} columns. ${unmappedColumns.length} columns remain unmapped.`,
      });
    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: 'AI Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze columns with AI',
        variant: 'destructive'
      });
      
      // Fallback: create basic mappings based on column names
      createFallbackMappings(data[0]);
    }
  };
  
  // Create fallback mappings when AI fails
  const createFallbackMappings = (sampleData: Record<string, any>) => {
    const sourceColumns = Object.keys(sampleData);
    const mappings: ColumnMapping[] = [];
    const mappedColumns = new Set<string>();
    
    // Try to match columns by name similarity
    for (const field of existingFields) {
      const lowerField = field.toLowerCase();
      
      // Find a column that matches this field
      const matchingColumn = sourceColumns.find(col => {
        const lowerCol = col.toLowerCase();
        return !mappedColumns.has(col) && (
          lowerCol === lowerField || 
          lowerCol.includes(lowerField) || 
          lowerField.includes(lowerCol)
        );
      });
      
      if (matchingColumn) {
        mappings.push({
          sourceColumn: matchingColumn,
          targetField: field,
          isCustomField: false,
          sampleData: String(sampleData[matchingColumn]).substring(0, 50)
        });
        mappedColumns.add(matchingColumn);
      }
    }
    
    // Add unmapped columns as custom fields
    const unmappedColumns = sourceColumns.filter(col => !mappedColumns.has(col));
    
    const analysisResult: ImportAnalysis = {
      suggestedMappings: mappings,
      unmappedColumns,
      sampleData
    };
    
    setAnalysis(analysisResult);
    setColumnMappings(mappings);
    
    toast({
      title: 'Basic Mapping Applied',
      description: `${mappings.length} columns mapped automatically. ${unmappedColumns.length} columns remain unmapped.`,
    });
  };
  
  // Handle mapping changes
  const updateMapping = (index: number, newTargetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = newTargetField;
    newMappings[index].isCustomField = !existingFields.includes(newTargetField);
    setColumnMappings(newMappings);
  };
  
  // Add unmapped column to mappings
  const addUnmappedColumn = (sourceColumn: string) => {
    // Generate a target field name
    const targetField = sourceColumn.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    setColumnMappings([
      ...columnMappings,
      {
        sourceColumn,
        targetField,
        isCustomField: true,
        sampleData: String(analysis?.sampleData[sourceColumn]).substring(0, 50)
      }
    ]);
  };
  
  // Remove a mapping
  const removeMapping = (index: number) => {
    const newMappings = [...columnMappings];
    newMappings.splice(index, 1);
    setColumnMappings(newMappings);
  };
  
  // Start the import process
  const startImport = async () => {
    if (!rawData.length || !columnMappings.length) {
      toast({
        title: 'Cannot Import',
        description: 'No data or column mappings available',
        variant: 'destructive'
      });
      return;
    }
    
    setIsImporting(true);
    setProgress(0);
    setImportedCount(0);
    setErrors([]);
    
    try {
      // Process the data based on mappings
      const processedData = rawData.map((row) => {
        const result: Record<string, any> = {
          category, // Always set the provided category
          additionalFields: {} // For custom fields
        };
        
        // Apply each mapping
        for (const mapping of columnMappings) {
          const { sourceColumn, targetField, isCustomField } = mapping;
          const value = row[sourceColumn];
          
          if (value !== undefined) {
            if (isCustomField) {
              // Store custom fields separately
              result.additionalFields[targetField] = value;
            } else {
              // Handle special cases
              if (targetField === 'tags' && typeof value === 'string') {
                result[targetField] = value.split(',').map(tag => tag.trim());
              } else {
                result[targetField] = value;
              }
            }
          }
        }
        
        // Create JSON-LD from all available data
        result.jsonLd = {
          "@context": "https://schema.org",
          "@type": aiData?.schemaType || "Thing",
          ...Object.entries(result).reduce((acc, [key, val]) => {
            if (key !== 'jsonLd' && key !== 'additionalFields') {
              acc[key] = val;
            }
            return acc;
          }, {} as Record<string, any>),
          ...result.additionalFields
        };
        
        return result;
      });
      
      // Import in batches
      const BATCH_SIZE = 50;
      let successCount = 0;
      const newErrors: string[] = [];
      
      for (let i = 0; i < processedData.length; i += BATCH_SIZE) {
        const batch = processedData.slice(i, i + BATCH_SIZE);
        
        try {
          // Process the batch
          await processImportBatch(batch);
          successCount += batch.length;
        } catch (error) {
          console.error('Batch import error:', error);
          newErrors.push(`Batch ${i/BATCH_SIZE + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Update progress
        const newProgress = Math.floor(((i + batch.length) / processedData.length) * 100);
        setProgress(newProgress);
        setImportedCount(successCount);
        setErrors(newErrors);
      }
      
      // Complete
      setProgress(100);
      
      if (newErrors.length === 0) {
        toast({
          title: 'Import Complete',
          description: `Successfully imported ${successCount} records`,
          variant: 'default'
        });
      } else {
        toast({
          title: 'Import Completed with Errors',
          description: `Imported ${successCount} of ${processedData.length} records with ${newErrors.length} errors`,
          variant: 'destructive'
        });
      }
      
      // Call the onComplete callback with the processed data
      if (onComplete) {
        onComplete(processedData);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Process a batch of data for import
  const processImportBatch = async (batch: any[]) => {
    // Validate the data
    for (const item of batch) {
      if (!item.title) {
        throw new Error('Title is required for all items');
      }
      if (!item.description) {
        throw new Error('Description is required for all items');
      }
    }
    
    // Here you would typically call your API to import the data
    // For now we'll just simulate success after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>AI Column Mapper</div>
          <div className="text-sm font-normal">
            {file.file.name} ({(file.file.size / 1024).toFixed(1)} KB)
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing file contents with AI...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">AI Suggested Mappings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Review and adjust the column mappings suggested by AI.
              </p>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Column</TableHead>
                      <TableHead>Maps To</TableHead>
                      <TableHead>Sample Data</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columnMappings.map((mapping, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{mapping.sourceColumn}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={mapping.targetField}
                              onValueChange={(value) => updateMapping(index, value)}
                              disabled={isImporting}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="description">Description</SelectItem>
                                <SelectItem value="subcategory">Subcategory</SelectItem>
                                <SelectItem value="tags">Tags</SelectItem>
                                <SelectItem value="imageUrl">Image URL</SelectItem>
                                <SelectItem value="thumbnailUrl">Thumbnail URL</SelectItem>
                                {/* Allow custom field names */}
                                <SelectItem value={mapping.sourceColumn}>
                                  Custom: {mapping.sourceColumn}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {mapping.isCustomField && (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                Custom
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[200px]">
                          {mapping.sampleData || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMapping(index)}
                            disabled={isImporting}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-destructive"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {analysis.unmappedColumns.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Unmapped Columns</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The following columns were not automatically mapped. Click to add them as custom fields.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.unmappedColumns.map((column) => (
                    <Button
                      key={column}
                      variant="outline"
                      size="sm"
                      onClick={() => addUnmappedColumn(column)}
                      disabled={isImporting}
                    >
                      + {column}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isImporting ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing...</span>
                    <span>{importedCount} of {rawData.length} records</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {errors.length > 0 && (
                  <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                      <AlertCircle size={16} />
                      <span>{errors.length} errors encountered</span>
                    </div>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      {errors.slice(0, 3).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {errors.length > 3 && (
                        <li>...and {errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => analyzeColumnsWithAI(rawData)}
                    disabled={isImporting}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-analyze
                  </Button>
                  <Button
                    onClick={startImport}
                    disabled={isImporting || columnMappings.length === 0}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Start Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">File analysis failed. Please try again.</p>
            <Button className="mt-4" onClick={() => analyzeColumnsWithAI(rawData)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIColumnMapper;
