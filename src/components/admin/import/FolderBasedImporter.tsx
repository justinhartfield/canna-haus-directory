
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ImportProgress } from '@/types/directory';

// Simplified version
const FolderBasedImporter = () => {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{
    success: any[];
    errors: any[];
    duplicates: any[];
  } | null>(null);

  return (
    <div className="space-y-8">
      <div className="bg-secondary/20 rounded-md p-4 text-center">
        <h3 className="text-lg font-medium mb-2">Folder-Based Import</h3>
        <p className="text-sm text-muted-foreground">
          This feature allows you to import data from a folder structure.
          Please select a folder to import from.
        </p>
      </div>

      {processingStatus === 'processing' && (
        <div className="bg-primary/10 rounded-md p-4">
          <h4 className="font-medium">Processing...</h4>
          <div className="w-full bg-secondary h-2 mt-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {processingStatus === 'error' && processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Processing Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {processingStatus === 'idle' && (
        <Button disabled={processingStatus !== 'idle'}>
          Select Folder
        </Button>
      )}
      
      {results && results.duplicates && results.duplicates.length > 0 && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-800">Duplicates Detected</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {results.duplicates.length} {results.duplicates.length === 1 ? 'item was' : 'items were'} skipped because they already exist in the database.
          </AlertDescription>
        </Alert>
      )}

      {results && processingStatus === 'complete' && (
        <div className="p-4 bg-secondary/10 rounded-md">
          <h4 className="font-medium mb-2">Processing Results</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total Items:</div>
            <div>{(results.success.length + results.errors.length + results.duplicates.length)}</div>
            
            <div>Succeeded:</div>
            <div className="text-green-400">{results.success.length}</div>
            
            <div>Failed:</div>
            <div className="text-red-400">{results.errors.length}</div>
            
            <div>Skipped:</div>
            <div className="text-yellow-400">{results.duplicates.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderBasedImporter;
