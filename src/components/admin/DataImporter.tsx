
import React, { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportProgress } from '@/types/directory';
import { processAndImportFile } from '@/utils/importUtils';
import { useDropzone } from 'react-dropzone';

// Import the new components
import CategorySelector from './import/CategorySelector';
import FileDropzone from './import/FileDropzone';
import ImportProgressDisplay from './import/ImportProgress';

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

  const { isDragActive } = useDropzone({ 
    onDrop,
    disabled: isImporting || !category,
    noClick: true, // We'll use our own dropzone component
    noKeyboard: true
  });

  const handleClearResults = () => {
    setProgress({
      totalFiles: 0,
      processedFiles: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      status: 'idle'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>
          Upload CSV or Excel files to import into the directory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CategorySelector 
          categories={DEFAULT_CATEGORIES}
          selectedCategory={category}
          onChange={setCategory}
        />
        
        <FileDropzone 
          onDrop={onDrop}
          isDisabled={isImporting || !category}
          isDragActive={isDragActive}
        />
        
        <ImportProgressDisplay progress={progress} />
      </CardContent>
      <CardFooter>
        <div className="flex justify-end w-full">
          <Button 
            variant="outline" 
            onClick={handleClearResults}
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
