
import React, { useEffect } from 'react';
import { useColumnMapper } from '@/hooks/importer/useColumnMapper';
import DataProcessor from './components/DataProcessor';
import { AIColumnMapperProps } from './types/importerTypes';
import { DEFAULT_CATEGORIES, SCHEMA_TYPE_OPTIONS } from './constants/importerConstants';
import ProcessingControls from './ProcessingControls';
import { toast } from '@/hooks/use-toast';

// Import the extracted components
import MappingHeader from './MappingHeader';
import CategorySchemaSelector from './CategorySchemaSelector';
import ColumnMappingSection from './ColumnMappingSection';
import AnalyzingState from './AnalyzingState';
import AnalysisErrorState from './AnalysisErrorState';

const AIColumnMapper: React.FC<AIColumnMapperProps> = ({
  file,
  onComplete,
  onCancel,
  onImport,
  canImport = false,
  category = 'Uncategorized'
}) => {
  // Use our custom hook for most of the component's logic
  const {
    isAnalyzing,
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    analysis,
    columnMappings,
    schemaType,
    setSchemaType,
    selectedCategory,
    setSelectedCategory,
    customFields,
    availableColumns,
    manualMappingMode,
    setManualMappingMode,
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping,
    toggleManualMode,
    analyzeFile,
    parsedData,
    processingComplete,
    setProcessingComplete
  } = useColumnMapper({ file, category });

  // Handle completion of data processing
  const handleProcessComplete = (results: {
    success: any[];
    errors: Array<{ item: any; message: string }>;
    duplicates: Array<{ item: any; error: string }>;
    missingColumns?: string[];
  }) => {
    // Explicitly set processing complete state
    setProcessingComplete(true);
    setIsProcessing(false);
    
    // Convert the success results to the expected format
    if (onComplete) {
      onComplete(results.success);
    }
    
    // Show summary toast
    const totalCount = results.success.length + results.errors.length + results.duplicates.length;
    toast({
      title: 'Processing Complete',
      description: `Successfully processed ${results.success.length} of ${totalCount} items.` +
                 `${results.errors.length > 0 ? ` ${results.errors.length} errors.` : ''}` + 
                 `${results.duplicates.length > 0 ? ` ${results.duplicates.length} duplicates.` : ''}`,
      variant: results.success.length > 0 ? 'default' : 'destructive'
    });
  };

  const handleStartProcessing = () => {
    // Validate mappings before starting
    if (columnMappings.length === 0) {
      toast({
        title: 'No Mappings Defined',
        description: 'Please define at least one column mapping before processing.',
        variant: 'destructive'
      });
      return;
    }
    
    // Check for required fields
    const hasTitleMapping = columnMappings.some(mapping => mapping.targetField === 'title');
    
    if (!hasTitleMapping) {
      toast({
        title: 'Required Mapping Missing',
        description: 'You must map at least one column to "title" field.',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if we have data to process
    if (!parsedData || parsedData.length === 0) {
      toast({
        title: 'No Data To Process',
        description: 'There is no data available to process. Please try re-uploading your file.',
        variant: 'destructive'
      });
      return;
    }
    
    // Reset the processing complete state when starting a new process
    setProcessingComplete(false);
    
    // Start processing
    setIsProcessing(true);
    setProgress(0); // Start at 0%
  };

  // Debug logging
  useEffect(() => {
    console.log("AIColumnMapper state:", { 
      isProcessing, 
      progress, 
      selectedCategory,
      parsedDataLength: parsedData?.length || 0,
      mappingsCount: columnMappings.length,
      availableColumns,
      processingComplete,
      canImportProp: canImport
    });
  }, [isProcessing, progress, selectedCategory, parsedData, columnMappings, availableColumns, processingComplete, canImport]);

  if (isAnalyzing) {
    return <AnalyzingState />;
  }

  if (!analysis && !manualMappingMode) {
    return (
      <AnalysisErrorState 
        onRetry={analyzeFile}
        onManualMapping={() => setManualMappingMode(true)}
        onCancel={onCancel}
      />
    );
  }

  // Prepare mappings for processing in the required format
  const prepareMappingsForProcessing = () => {
    const mappingsObj: Record<string, string> = {};
    columnMappings.forEach(mapping => {
      if (mapping.targetField && mapping.targetField !== 'ignore' && mapping.sourceColumn) {
        mappingsObj[mapping.targetField] = mapping.sourceColumn;
      }
    });
    return mappingsObj;
  };

  // Function to add a new mapping using the first available column
  const handleAddNewMapping = () => {
    if (availableColumns.length > 0 && parsedData && parsedData.length > 0) {
      handleAddMapping(availableColumns, parsedData.slice(0, 5)); // Use first 5 rows for better sampling
    }
  };

  return (
    <div className="space-y-6">
      <MappingHeader 
        title="Data Mapping Configuration"
        manualMappingMode={manualMappingMode}
        onToggleMode={toggleManualMode}
        showModeToggle={true} // Always show mode toggle to allow overriding AI recommendations
      />
      
      <CategorySchemaSelector
        selectedCategory={selectedCategory}
        schemaType={schemaType}
        onCategoryChange={setSelectedCategory}
        onSchemaTypeChange={setSchemaType}
        isProcessing={isProcessing}
        categories={DEFAULT_CATEGORIES}
        schemaTypes={SCHEMA_TYPE_OPTIONS}
      />
      
      <ColumnMappingSection
        columnMappings={columnMappings}
        availableColumns={availableColumns}
        customFields={customFields}
        manualMappingMode={manualMappingMode}
        isProcessing={isProcessing}
        onMappingChange={handleMappingChange}
        onCustomFieldNameChange={handleCustomFieldNameChange}
        onSourceColumnChange={handleSourceColumnChange}
        onRemoveMapping={handleRemoveMapping}
        onAddMapping={handleAddNewMapping}
      />
      
      {isProcessing && parsedData && parsedData.length > 0 && (
        <DataProcessor
          data={parsedData}
          mappings={prepareMappingsForProcessing()}
          category={selectedCategory}
          subcategory={undefined}
          onProcessComplete={handleProcessComplete}
          onProgress={setProgress}
        />
      )}
      
      <ProcessingControls 
        isProcessing={isProcessing}
        progress={progress}
        onProcess={handleStartProcessing}
        onCancel={onCancel}
        onImport={onImport}
        canImport={canImport || processingComplete}
      />
    </div>
  );
};

export default AIColumnMapper;
