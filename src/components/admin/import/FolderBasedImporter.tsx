
import React, { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  FolderProcessingConfig, 
  createFolderConfig, 
  processFolderData,
  getSchemaTemplate,
  FolderMetadata
} from '@/utils/folderProcessingUtils';
import { sampleFileContent } from '@/utils/fileProcessing';
import FileDropzone from './FileDropzone';
import FolderConfigSelector from './FolderConfigSelector';
import FolderMetadataDisplay from './FolderMetadataDisplay';
import ProcessingResults from './ProcessingResults';
import ImportProgressDisplay from './ImportProgress';

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
      // Fix: Add a timeout to allow UI to update before processing starts
      setTimeout(async () => {
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
          console.error("Error in processing:", error);
          toast({
            title: "Processing Error",
            description: error instanceof Error ? error.message : "An unknown error occurred during processing",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }, 100);
    } catch (error) {
      console.error("Error starting processing:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred during processing",
        variant: "destructive"
      });
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
          {/* Folder Configuration */}
          <FolderConfigSelector 
            selectedFolderType={selectedFolderType}
            customFolder={customFolder}
            customSchemaType={customSchemaType}
            defaultFolderTypes={DEFAULT_FOLDER_TYPES}
            onFolderTypeSelect={handleFolderTypeSelect}
            onCustomFolderChange={handleCustomFolderChange}
            onSchemaTypeChange={setCustomSchemaType}
          />
          
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
          {folderMetadata && <FolderMetadataDisplay metadata={folderMetadata} />}
          
          {/* File Upload Area */}
          <FileDropzone 
            onDrop={onDrop} 
            isDisabled={isProcessing || (!selectedFolderType && !customFolder)} 
            isDragActive={false}
          />
          
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
          <ProcessingResults 
            processed={progress.processed}
            succeeded={progress.succeeded}
            failed={progress.failed}
            skipped={progress.skipped}
            isProcessing={isProcessing}
          />
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
