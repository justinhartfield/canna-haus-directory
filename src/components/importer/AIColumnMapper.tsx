
import React from 'react';
import { DirectoryItem } from '@/types/directory';
import { useColumnMapper } from '@/hooks/importer/useColumnMapper';
import DataProcessor from './components/DataProcessor';
import { AIColumnMapperProps } from './types/importerTypes';
import { DEFAULT_CATEGORIES, SCHEMA_TYPE_OPTIONS } from './constants/importerConstants';

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
    analyzeFile
  } = useColumnMapper({ file, category });

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
      
      <DataProcessor
        data={[]}
        mappings={{}}
        category={selectedCategory}
        subcategory={undefined}
        onProcessComplete={onComplete}
        onProgress={setProgress}
      />
    </div>
  );
};

export default AIColumnMapper;
