
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportProgress } from '@/types/directory';
import { processAndImportFile } from '@/utils/importUtils';

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

const DataImporter: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    totalFiles: 0,
    processedFiles: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    status: 'idle'
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!category) {
      toast({
        title: "Category Required",
        description: "Please select a category before uploading files.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setProgress({
      totalFiles: acceptedFiles.length,
      processedFiles: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      status: 'processing'
    });

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{file: string, error: string}> = [];

    for (const [index, file] of acceptedFiles.entries()) {
      try {
        const result = await processAndImportFile(file, category);
        
        if (result.success) {
          successCount += result.count;
        } else {
          errorCount++;
          result.errors.forEach(error => {
            errors.push({ file: file.name, error });
          });
        }
        
        setProgress(prev => ({
          ...prev,
          processedFiles: index + 1,
          successCount,
          errorCount,
          errors
        }));
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errorCount++;
        errors.push({ 
          file: file.name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        
        setProgress(prev => ({
          ...prev,
          processedFiles: index + 1,
          errorCount,
          errors
        }));
      }
    }

    setProgress(prev => ({
      ...prev,
      status: errors.length > 0 ? 'error' : 'complete'
    }));
    
    setIsImporting(false);
    
    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} items with ${errorCount} errors.`,
      variant: errorCount > 0 ? "destructive" : "default"
    });
  }, [category]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isImporting || !category,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>
          Upload CSV or Excel files to import into the directory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Category</label>
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
        
        {progress.status !== 'idle' && (
          <div className="space-y-2">
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
        <div className="flex justify-end w-full">
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
            disabled={isImporting}
          >
            Clear Results
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataImporter;
