
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FolderProcessingConfig, 
  createFolderConfig, 
  processFolderData,
  getSchemaTemplate,
  FolderMetadata
} from '@/utils/folderProcessingUtils';
import { DataMappingConfig } from '@/utils/mappingUtils';
import { sampleFileContent } from '@/utils/fileProcessing';

const DEFAULT_FOLDER_TYPES = [
  { name: 'Strains', schemaType: 'Product' },
  { name: 'Dispensaries', schemaType: 'LocalBusiness' },
  { name: 'Medical', schemaType: 'MedicalEntity' },
  { name: 'Extraction', schemaType: 'Article' },
  { name: 'Articles', schemaType: 'Article' },
  { name: 'Compliance', schemaType: 'Article' },
  { name: 'People', schemaType: 'Person' },
  { name: 'Organizations', schemaType: 'Organization' },
  { name: 'Products', schemaType: 'Product' },
  { name: 'Lab Data', schemaType: 'Drug' }
];

const FolderBasedImporter: React.FC = () => {
  const [selectedFolderType, setSelectedFolderType] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [incrementalMode, setIncrementalMode] = useState(false);
  const [folderConfig, setFolderConfig] = useState<FolderProcessingConfig | null>(null);
  const [customFolder, setCustomFolder] = useState('');
  const [customSchemaType, setCustomSchemaType] = useState('Product');
  const [configReady, setConfigReady] = useState(false);
  const [folderMetadata, setFolderMetadata] = useState<FolderMetadata | null>(null);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0
  });
  
  // Handle file drops
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedFolderType && !customFolder) {
      toast({
        title: "Folder Type Required",
        description: "Please select a folder type before uploading files.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFiles(acceptedFiles);
    
    // If we have files and a folder type, let's try to create a configuration
    if (acceptedFiles.length > 0) {
      try {
        // Sample the first file to detect columns
        const sampleData = await sampleFileContent(acceptedFiles[0]);
        if (sampleData.length === 0) {
          throw new Error("Could not extract sample data from file");
        }
        
        // Create default column mappings based on field names
        const columnMappings: Record<string, string> = {};
        const columns = Object.keys(sampleData[0]);
        
        // Try to intelligently map fields based on column names
        for (const column of columns) {
          const lowerColumn = column.toLowerCase();
          
          if (lowerColumn.includes('name') || lowerColumn.includes('title')) {
            columnMappings['title'] = column;
          } else if (lowerColumn.includes('desc')) {
            columnMappings['description'] = column;
          } else if (lowerColumn.includes('image') || lowerColumn.includes('photo')) {
            columnMappings['imageUrl'] = column;
          } else if (lowerColumn.includes('tag')) {
            columnMappings['tags'] = column;
          } else if (lowerColumn.includes('category') || lowerColumn.includes('type')) {
            columnMappings['subcategory'] = column;
          }
        }
        
        // Ensure we have mandatory fields mapped
        if (!columnMappings['title'] && columns.length > 0) {
          columnMappings['title'] = columns[0];
        }
        
        if (!columnMappings['description'] && columns.length > 1) {
          columnMappings['description'] = columns[1];
        }
        
        // Create a folder configuration
        const folderName = customFolder || selectedFolderType;
        const schemaType = customSchemaType || DEFAULT_FOLDER_TYPES.find(f => f.name === selectedFolderType)?.schemaType || 'Product';
        
        const config = createFolderConfig(
          folderName,
          schemaType,
          columnMappings,
          undefined,
          incrementalMode
        );
        
        setFolderConfig(config);
        setConfigReady(true);
        
        // Mock folder metadata for demonstration
        // In a real app, this would be fetched from a database
        setFolderMetadata({
          folderName,
          sourceType: 'import',
          lastProcessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          fileCount: 0,
          itemCount: 0,
          schemaType
        });
        
        toast({
          title: "Configuration Ready",
          description: `Folder configuration created for "${folderName}" using schema type "${schemaType}".`,
        });
      } catch (error) {
        console.error("Error creating folder config:", error);
        toast({
          title: "Configuration Error",
          description: error instanceof Error ? error.message : "Failed to create folder configuration",
          variant: "destructive"
        });
      }
    }
  }, [selectedFolderType, customFolder, incrementalMode, customSchemaType]);
  
  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isProcessing || (!selectedFolderType && !customFolder),
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });
  
  // Process files with the folder configuration
  const handleProcessFiles = async () => {
    if (!folderConfig || selectedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please configure the folder and select files to process.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress({
      current: 0,
      total: selectedFiles.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0
    });
    
    try {
      const result = await processFolderData(
        selectedFiles,
        folderConfig,
        folderMetadata,
        (current, total) => {
          setProgress(prev => ({
            ...prev,
            current,
            total
          }));
        }
      );
      
      setProgress({
        current: selectedFiles.length,
        total: selectedFiles.length,
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        skipped: result.skipped
      });
      
      setFolderMetadata(result.metadata);
      
      toast({
        title: "Processing Complete",
        description: `Processed ${result.processed} items: ${result.succeeded} succeeded, ${result.failed} failed, ${result.skipped} skipped.`,
        variant: result.failed > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error("Error processing folder data:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred during processing",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle folder type selection
  const handleFolderTypeSelect = (value: string) => {
    setSelectedFolderType(value);
    setCustomFolder('');
    setConfigReady(false);
  };
  
  // Handle custom folder input
  const handleCustomFolderChange = (value: string) => {
    setCustomFolder(value);
    setSelectedFolderType('');
    setConfigReady(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Folder-Based Data Importer</CardTitle>
        <CardDescription>
          Import and transform data files organized by folders with specialized schema mapping
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Folder Type Selection */}
            <div className="space-y-2">
              <Label>Select Folder Type</Label>
              <Select value={selectedFolderType} onValueChange={handleFolderTypeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder type" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_FOLDER_TYPES.map(folder => (
                    <SelectItem key={folder.name} value={folder.name}>
                      {folder.name} ({folder.schemaType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Custom Folder Input */}
            <div className="space-y-2">
              <Label>Or Enter Custom Folder Name</Label>
              <Input
                value={customFolder}
                onChange={e => handleCustomFolderChange(e.target.value)}
                placeholder="Enter custom folder name"
                disabled={!!selectedFolderType}
              />
            </div>
          </div>
          
          {/* Custom Schema Type (only for custom folders) */}
          {customFolder && (
            <div className="space-y-2">
              <Label>Schema Type for Custom Folder</Label>
              <Select value={customSchemaType} onValueChange={setCustomSchemaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a schema type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(getSchemaTemplate('Product')).map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Incremental Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="incremental-mode"
              checked={incrementalMode}
              onCheckedChange={setIncrementalMode}
            />
            <Label htmlFor="incremental-mode">Incremental Mode (Only Process New/Modified Files)</Label>
          </div>
          
          {/* Previous Import Metadata */}
          {folderMetadata && (
            <div className="p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Previous Import Metadata</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>Folder:</div>
                <div>{folderMetadata.folderName}</div>
                
                <div>Last Processed:</div>
                <div>{new Date(folderMetadata.lastProcessed).toLocaleString()}</div>
                
                <div>Files Processed:</div>
                <div>{folderMetadata.fileCount}</div>
                
                <div>Items Imported:</div>
                <div>{folderMetadata.itemCount}</div>
                
                <div>Schema Type:</div>
                <div>{folderMetadata.schemaType}</div>
              </div>
            </div>
          )}
          
          {/* File Upload Area */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600'
            } ${isProcessing || (!selectedFolderType && !customFolder) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  : 'Drag & drop CSV or Excel files for this folder, or click to select files'}
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: .csv, .xlsx, .xls
              </p>
            </div>
          </div>
          
          {/* Selected Files */}
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
          
          {/* Configuration Status */}
          {configReady && folderConfig && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-md">
              <h4 className="font-medium text-green-400 mb-2">Configuration Ready</h4>
              <div className="text-sm">
                <p>Folder: {folderConfig.folderName}</p>
                <p>Schema Type: {folderConfig.schemaType}</p>
                <p>Fields Mapped: {Object.keys(folderConfig.mappingConfig.columnMappings).length}</p>
                <p>Mode: {incrementalMode ? 'Incremental' : 'Full'}</p>
              </div>
            </div>
          )}
          
          {/* Process Button */}
          {selectedFiles.length > 0 && configReady && (
            <div className="flex justify-end">
              <Button 
                onClick={handleProcessFiles} 
                disabled={isProcessing || !folderConfig}
              >
                {isProcessing ? 'Processing...' : 'Process Files'}
              </Button>
            </div>
          )}
          
          {/* Progress Indicators */}
          {isProcessing && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Progress: {progress.current} of {progress.total} files</span>
                <span>
                  {Math.round((progress.current / progress.total) * 100)}%
                </span>
              </div>
              <Progress 
                value={(progress.current / progress.total) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          {/* Results Summary */}
          {progress.processed > 0 && !isProcessing && (
            <div className="p-4 bg-secondary/10 rounded-md">
              <h4 className="font-medium mb-2">Processing Results</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Items:</div>
                <div>{progress.processed}</div>
                
                <div>Succeeded:</div>
                <div className="text-green-400">{progress.succeeded}</div>
                
                <div>Failed:</div>
                <div className="text-red-400">{progress.failed}</div>
                
                <div>Skipped:</div>
                <div className="text-yellow-400">{progress.skipped}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedFiles([]);
              setConfigReady(false);
              setFolderConfig(null);
            }}
            disabled={isProcessing || selectedFiles.length === 0}
          >
            Clear Files
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setProgress({
                current: 0,
                total: 0,
                processed: 0,
                succeeded: 0,
                failed: 0,
                skipped: 0
              });
            }}
            disabled={isProcessing || progress.processed === 0}
          >
            Clear Results
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FolderBasedImporter;
