// This import assumes we'll fix the processing function to have the correct parameter count
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FolderConfigSelector from './FolderConfigSelector';
import FolderMetadataDisplay from './FolderMetadataDisplay';
import ImportProgress from './ImportProgress';
import ProcessingResults from './ProcessingResults';
import { processFolderData } from '@/utils/folder/folderProcessCore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Add other required imports

const FolderBasedImporter = () => {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [folderData, setFolderData] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [processingResults, setProcessingResults] = useState<any | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleFolderSelect = (path: string, data: any[]) => {
    setFolderPath(path);
    setFolderData(data);
    setProcessingResults(null);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setProcessingError(null);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleStartProcessing = async () => {
    if (!folderData || folderData.length === 0) {
      alert('No folder data available to process.');
      return;
    }

    if (!selectedTemplate) {
      alert('Please select a template.');
      return;
    }

    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }

    setProcessingResults(null);
    setProcessingProgress(0);
    setProcessingError(null);

    const totalFiles = folderData.length;
    let processedCount = 0;

    const progressCallback = (progress: number) => {
      setProcessingProgress(progress);
    };

    const errorCallback = (error: string) => {
      setProcessingError(error);
      setProcessingStatus('error');
    };
    
    try {
      setProcessingStatus('processing');
      
      // Fix the call to processFolderData by removing the extra parameter
      const result = await processFolderData(
        folderData,
        selectedTemplate,
        {
          category: selectedCategory,
          subcategory: selectedSubcategory
        },
        progressCallback,
        errorCallback
      );
      
      setProcessingStatus('complete');
      setProcessingResults(result);
    } catch (error) {
      console.error('Processing error:', error);
      setProcessingStatus('error');
      setProcessingError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  const canStartProcessing = folderData && selectedTemplate && selectedCategory && processingStatus === 'idle';

  return (
    <div className="space-y-8">
      <FolderConfigSelector onFolderSelect={handleFolderSelect} />

      {folderPath && (
        <FolderMetadataDisplay
          folderPath={folderPath}
          onTemplateSelect={handleTemplateSelect}
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          selectedTemplate={selectedTemplate}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
        />
      )}

      {processingStatus === 'processing' && (
        <ImportProgress progress={processingProgress} status="Processing folder data..." />
      )}

      {processingStatus === 'error' && processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Processing Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {canStartProcessing && (
        <Button onClick={handleStartProcessing} disabled={processingStatus !== 'idle'}>
          Start Processing
        </Button>
      )}
      
      {processingResults && processingResults.duplicates && processingResults.duplicates.length > 0 && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-800">Duplicates Detected</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {processingResults.duplicates.length} {processingResults.duplicates.length === 1 ? 'item was' : 'items were'} skipped because they already exist in the database.
          </AlertDescription>
        </Alert>
      )}

      {processingResults && processingStatus === 'complete' && (
        <ProcessingResults results={processingResults} />
      )}
    </div>
  );
};

export default FolderBasedImporter;
