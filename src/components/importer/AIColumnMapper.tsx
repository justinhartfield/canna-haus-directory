
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { sampleFileContent, processFileContent, DataMappingConfig } from '@/utils/dataProcessingUtils';
import { ImportAnalysis, ColumnMapping, DirectoryItem } from '@/types/directory';
import { supabase } from '@/integrations/supabase/client';

interface AIColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  onComplete: (data: any[]) => void;
  onCancel: () => void;
  category?: string;
}

const AIColumnMapper: React.FC<AIColumnMapperProps> = ({
  file,
  onComplete,
  onCancel,
  category = 'Uncategorized'
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [schemaType, setSchemaType] = useState('Thing');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const DEFAULT_CATEGORIES = [
    'Strains', 'Medical', 'Extraction', 'Cultivation',
    'Dispensaries', 'Lab Data', 'Compliance', 'Products', 'Educational'
  ];

  // Available target fields for mapping
  const availableTargetFields = [
    { value: 'title', label: 'Title' },
    { value: 'description', label: 'Description' },
    { value: 'subcategory', label: 'Subcategory' },
    { value: 'tags', label: 'Tags' },
    { value: 'imageUrl', label: 'Image URL' },
    { value: 'thumbnailUrl', label: 'Thumbnail URL' }
  ];

  // Schema type options
  const schemaTypeOptions = [
    'Thing', 'Product', 'Event', 'Organization', 'Person', 'Place',
    'CreativeWork', 'Article', 'MedicalEntity', 'Drug', 'Store'
  ];

  // Analyze file on component mount
  useEffect(() => {
    analyzeFile();
  }, []);

  const analyzeFile = async () => {
    setIsAnalyzing(true);
    try {
      // Sample the file to get some representative data
      const sampleRows = await sampleFileContent(file.file, 3);
      
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
          isCustomField: !availableTargetFields.some(f => f.value === targetField),
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
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMappingChange = (index: number, targetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = targetField;
    newMappings[index].isCustomField = !availableTargetFields.some(f => f.value === targetField);
    setColumnMappings(newMappings);
  };

  const handleCustomFieldNameChange = (sourceColumn: string, customName: string) => {
    setCustomFields({
      ...customFields,
      [sourceColumn]: customName
    });
  };

  const handleProcessFile = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Create mapping configuration from the user's selections
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category: selectedCategory
        },
        schemaType
      };
      
      // Process column mappings, handling custom fields
      columnMappings.forEach(mapping => {
        if (!mapping.targetField) return; // Skip unmapped columns
        
        if (mapping.isCustomField) {
          // For custom fields, use the custom name or the source column
          const customFieldName = customFields[mapping.sourceColumn] || mapping.sourceColumn;
          mappingConfig.columnMappings[`additionalFields.${customFieldName}`] = mapping.sourceColumn;
        } else {
          // For standard fields, use the target field directly
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });
      
      // Process the file
      const result = await processFileContent(file.file, mappingConfig);
      
      if (!result.success) {
        throw new Error(`File processing failed with ${result.errorCount} errors`);
      }
      
      setProgress(100);
      
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${result.processedRows} of ${result.totalRows} rows`,
      });
      
      // Return processed items to the parent component
      onComplete(result.items as unknown as DirectoryItem[]);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Analyzing file with AI...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p>Failed to analyze file. Please try again or use manual mapping.</p>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            disabled={isProcessing}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="schemaType">Schema Type</Label>
          <Select 
            value={schemaType} 
            onValueChange={setSchemaType}
            disabled={isProcessing}
          >
            <SelectTrigger id="schemaType">
              <SelectValue placeholder="Select schema type" />
            </SelectTrigger>
            <SelectContent>
              {schemaTypeOptions.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Column Mappings</Label>
        <p className="text-sm text-muted-foreground">
          Review AI-suggested mappings and adjust if needed
        </p>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Column</TableHead>
                    <TableHead>Map To</TableHead>
                    <TableHead>Custom Field Name</TableHead>
                    <TableHead>Sample Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columnMappings.map((mapping, index) => (
                    <TableRow key={index}>
                      <TableCell>{mapping.sourceColumn}</TableCell>
                      <TableCell>
                        <Select
                          value={mapping.targetField}
                          onValueChange={(value) => handleMappingChange(index, value)}
                          disabled={isProcessing}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Ignore --</SelectItem>
                            {availableTargetFields.map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Custom Field</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {mapping.isCustomField && (
                          <Input
                            value={customFields[mapping.sourceColumn] || ''}
                            onChange={(e) => handleCustomFieldNameChange(mapping.sourceColumn, e.target.value)}
                            placeholder="Field name"
                            disabled={isProcessing}
                          />
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {mapping.sampleData}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isProcessing && (
        <div className="space-y-2">
          <Label>Processing File</Label>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-between space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={handleProcessFile} 
          disabled={isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Process File
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIColumnMapper;
