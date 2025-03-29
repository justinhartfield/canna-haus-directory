
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataMappingConfig, processFileContent, processBatchFiles, sampleFileContent, createMappingConfigFromSample } from '@/utils/dataProcessingUtils';
import { ImportProgress } from '@/types/directory';

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

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

const DataImporterAdvanced: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('simple');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sampleData, setSampleData] = useState<Record<string, any>[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [schemaType, setSchemaType] = useState('Thing');
  const [batchSize, setBatchSize] = useState(100);
  
  const [progress, setProgress] = useState<ImportProgress>({
    totalFiles: 0,
    processedFiles: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    status: 'idle'
  });

  // Handle file drops
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!category) {
      toast({
        title: "Category Required",
        description: "Please select a category before uploading files.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(acceptedFiles);
    
    // Sample the first file to set up column mappings
    if (acceptedFiles.length > 0) {
      const sampleRows = await sampleFileContent(acceptedFiles[0]);
      setSampleData(sampleRows);
      
      // Auto-detect column mappings
      try {
        const autoConfig = createMappingConfigFromSample(sampleRows, category);
        const mappings: ColumnMapping[] = [];
        
        // Convert columnMappings object to array format
        for (const [targetField, sourceColumn] of Object.entries(autoConfig.columnMappings)) {
          mappings.push({
            sourceColumn,
            targetField
          });
        }
        
        setColumnMappings(mappings);
        setSchemaType(autoConfig.schemaType || 'Thing');
      } catch (error) {
        console.error('Error auto-detecting mappings:', error);
        // If auto-detection fails, create empty mappings
        if (sampleRows.length > 0) {
          const columns = Object.keys(sampleRows[0]);
          setColumnMappings(
            columns.map(col => ({
              sourceColumn: col,
              targetField: ''
            }))
          );
        }
      }
    }
  }, [category]);

  // Handle simple import (using the whole files)
  const handleSimpleImport = useCallback(async () => {
    if (!category || selectedFiles.length === 0) {
      toast({
        title: "Required Information Missing",
        description: "Please select a category and at least one file.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setProgress({
      totalFiles: selectedFiles.length,
      processedFiles: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      status: 'processing'
    });

    try {
      // Create a basic mapping config
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category
        },
        schemaType: 'Thing'
      };
      
      // Convert the column mappings array to the required format
      columnMappings.forEach(mapping => {
        if (mapping.targetField) {
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });
      
      // Set the schema type
      mappingConfig.schemaType = schemaType;
      
      // Process all files
      const result = await processBatchFiles(
        selectedFiles,
        mappingConfig,
        batchSize,
        (current, total) => {
          setProgress(prev => ({
            ...prev,
            processedFiles: current
          }));
        }
      );
      
      setProgress(prev => ({
        ...prev,
        successCount: result.successRows,
        errorCount: result.errorCount,
        errors: result.errors.map(err => ({
          file: err.file,
          error: err.errors.map(e => `Row ${e.row}: ${e.message}`).join(', ')
        })),
        status: result.errors.length > 0 ? 'error' : 'complete'
      }));
      
      // Show toast notification
      toast({
        title: "Import Complete",
        description: `Successfully imported ${result.successRows} items with ${result.errorCount} errors.`,
        variant: result.errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error during import:', error);
      
      setProgress(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        errors: [
          ...prev.errors,
          {
            file: 'Import Process',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        ],
        status: 'error'
      }));
      
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Unknown error during import',
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  }, [category, selectedFiles, columnMappings, schemaType, batchSize]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isImporting || !category,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  // Handle changes to column mappings
  const handleMappingChange = (index: number, targetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = targetField;
    setColumnMappings(newMappings);
  };

  // Available target fields for mapping
  const availableTargetFields = [
    { value: 'title', label: 'Title' },
    { value: 'description', label: 'Description' },
    { value: 'subcategory', label: 'Subcategory' },
    { value: 'tags', label: 'Tags' },
    { value: 'imageUrl', label: 'Image URL' },
    { value: 'thumbnailUrl', label: 'Thumbnail URL' },
    { value: 'metaData', label: 'Meta Data' }
  ];

  // Schema type options
  const schemaTypeOptions = [
    'Thing', 'Product', 'Event', 'Organization', 'Person', 'Place', 
    'CreativeWork', 'Article', 'MedicalEntity', 'Drug', 'Store'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Data Importer</CardTitle>
        <CardDescription>
          Import and transform data from CSV or Excel files into your directory
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="simple">Simple Import</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-visual-500 bg-visual-500/10' : 'border-gray-600'
              } ${isImporting || !category ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    ? 'Drop the files here...'
                    : 'Drag & drop CSV or Excel files here, or click to select files'}
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: .csv, .xlsx, .xls
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              {/* Schema type selection */}
              <div className="space-y-2">
                <Label>Schema Type</Label>
                <Select value={schemaType} onValueChange={setSchemaType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select schema type" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemaTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Defines the Schema.org type for the JSON-LD structure
                </p>
              </div>
              
              {/* Batch size setting */}
              <div className="space-y-2">
                <Label>Batch Size</Label>
                <Input 
                  type="number" 
                  value={batchSize} 
                  onChange={e => setBatchSize(parseInt(e.target.value) || 100)} 
                  min={10} 
                  max={1000}
                />
                <p className="text-xs text-muted-foreground">
                  Number of items to process in each batch (10-1000)
                </p>
              </div>
              
              {/* Column mappings */}
              {sampleData.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Column Mappings</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Map columns from your data file to fields in the directory
                  </p>
                  
                  <div className="max-h-60 overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source Column</TableHead>
                          <TableHead>Target Field</TableHead>
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
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {sampleData[0]?.[mapping.sourceColumn]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* Sample data preview */}
              {sampleData.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Data Preview</Label>
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(sampleData[0], null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-secondary/20 rounded">
            <Label>Selected Files ({selectedFiles.length}):</Label>
            <ul className="text-sm mt-2 space-y-1 max-h-28 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li key={index} className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
              ))}
            </ul>
          </div>
        )}
        
        {selectedFiles.length > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSimpleImport} 
              disabled={isImporting || !category || selectedFiles.length === 0}
            >
              {isImporting ? 'Importing...' : 'Start Import'}
            </Button>
          </div>
        )}
        
        {progress.status !== 'idle' && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Progress: {progress.processedFiles} of {progress.totalFiles} files</span>
              <span>
                {Math.round((progress.processedFiles / progress.totalFiles) * 100)}%
              </span>
            </div>
            <Progress 
              value={(progress.processedFiles / progress.totalFiles) * 100} 
              className="h-2"
            />
            
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-400">Success: {progress.successCount} items</span>
              {progress.errorCount > 0 && (
                <span className="text-red-400">Errors: {progress.errorCount}</span>
              )}
            </div>
            
            {progress.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-red-400 mb-2">Errors:</h4>
                <div className="max-h-40 overflow-y-auto text-xs bg-gray-800/50 rounded p-2">
                  {progress.errors.map((error, index) => (
                    <div key={index} className="mb-1 pb-1 border-b border-gray-700">
                      <span className="font-medium">{error.file}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedFiles([]);
              setSampleData([]);
              setColumnMappings([]);
            }}
            disabled={isImporting || selectedFiles.length === 0}
          >
            Clear Files
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setProgress({
                totalFiles: 0,
                processedFiles: 0,
                successCount: 0,
                errorCount: 0,
                errors: [],
                status: 'idle'
              });
            }}
            disabled={isImporting || progress.status === 'idle'}
          >
            Clear Results
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataImporterAdvanced;
