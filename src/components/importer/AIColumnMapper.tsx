
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
    parsedData
  } = useColumnMapper({ file, category });

  // Handle completion of data processing
  const handleProcessComplete = (results: {
    success: any[];
    errors: Array<{ item: any; error: string }>;
    duplicates: Array<{ item: any; error: string }>;
  }) => {
    // Convert the success results to the expected format
    onComplete(results.success);
    
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
    
    // Start processing
    setIsProcessing(true);
  };

  // Debug logging
  useEffect(() => {
    console.log("AIColumnMapper state:", { 
      isProcessing, 
      progress, 
      selectedCategory,
      parsedDataLength: parsedData?.length || 0,
      mappingsCount: columnMappings.length
    });
  }, [isProcessing, progress, selectedCategory, parsedData, columnMappings]);

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
      if (mapping.targetField && mapping.sourceColumn) {
        mappingsObj[mapping.targetField] = mapping.sourceColumn;
      }
    });
    return mappingsObj;
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
        onAddMapping={handleAddMapping}
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
        canImport={canImport}
      />
    </div>
  );
};

export default AIColumnMapper;
