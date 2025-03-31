
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import AIColumnMapper from './AIColumnMapper';
import { Upload, FileType, FileText } from 'lucide-react';

interface SmartImporterProps {
  onComplete?: (data: any[]) => void;
  category?: string;
}

const SmartImporter: React.FC<SmartImporterProps> = ({ 
  onComplete,
  category = 'Uncategorized'
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    type: 'csv' | 'xlsx';
  } | null>(null);
  
  const [processedData, setProcessedData] = useState<any[] | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [importInProgress, setImportInProgress] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const fileType = file.name.toLowerCase().endsWith('.csv') 
      ? 'csv' 
      : file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')
      ? 'xlsx'
      : null;
    
    if (!fileType) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a CSV or Excel (XLSX/XLS) file.',
        variant: 'destructive'
      });
      return;
    }
    
    setSelectedFile({
      file,
      type: fileType
    });
    setProcessedData(null);
    setProcessingComplete(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: !!selectedFile
  });
  
  const handleMappingComplete = (data: any[]) => {
    console.log('Processing complete, received data:', data.length);
    setProcessedData(data);
    setProcessingComplete(true);
    toast({
      title: "Processing Complete",
      description: `Successfully processed ${data.length} records. Click "Import Data" to add them to the database.`,
    });
  };
  
  const handleImport = () => {
    if (processedData && processedData.length > 0) {
      setImportInProgress(true);
      
      try {
        if (onComplete) {
          onComplete(processedData);
        }
        
        toast({
          title: "Import Complete",
          description: `Successfully imported ${processedData.length} records.`,
        });
        
        // Reset the component only after successful import
        setTimeout(() => {
          setSelectedFile(null);
          setProcessedData(null);
          setProcessingComplete(false);
          setImportInProgress(false);
        }, 1000);
      } catch (error) {
        console.error('Error during import:', error);
        setImportInProgress(false);
        
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedFile(null);
    setProcessedData(null);
    setProcessingComplete(false);
  };

  // Log state for debugging
  console.log('SmartImporter state:', { 
    hasProcessedData: !!processedData,
    dataLength: processedData?.length || 0,
    processingComplete,
    importInProgress
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Data Importer</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedFile ? (
          <AIColumnMapper 
            file={selectedFile}
            onComplete={handleMappingComplete}
            onCancel={handleCancel}
            onImport={handleImport}
            canImport={processingComplete && !!processedData && processedData.length > 0 && !importInProgress}
            category={category}
          />
        ) : (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV or Excel file to begin AI-powered column mapping
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs">CSV</p>
              </div>
              <div className="text-center">
                <FileType className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs">XLSX</p>
              </div>
            </div>
            <Button className="mt-4">
              Select File
            </Button>
          </div>
        )}
      </CardContent>
      {!selectedFile && (
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            Files will be analyzed with AI to automatically map columns to appropriate fields.
            You'll have a chance to review and adjust the mappings before importing.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default SmartImporter;
