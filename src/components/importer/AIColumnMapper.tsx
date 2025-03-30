
import React from 'react';
import { DataMappingConfig, processFileContent } from '@/utils/dataProcessingUtils';
import { DirectoryItem } from '@/types/directory';
import { toast } from '@/hooks/use-toast';
import { useColumnMapper } from '@/hooks/importer/useColumnMapper';

// Import the extracted components
import MappingHeader from './MappingHeader';
import CategorySchemaSelector from './CategorySchemaSelector';
import ColumnMappingSection from './ColumnMappingSection';
import ProcessingControls from './ProcessingControls';
import AnalyzingState from './AnalyzingState';
import AnalysisErrorState from './AnalysisErrorState';

interface AIColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  onComplete: (data: any[]) => void;
  onCancel: () => void;
  category?: string;
}

// Schema type options
const SCHEMA_TYPE_OPTIONS = [
  'Thing', 'Product', 'Event', 'Organization', 'Person', 'Place',
  'CreativeWork', 'Article', 'MedicalEntity', 'Drug', 'Store'
];

// Default category options
const DEFAULT_CATEGORIES = [
  'Strains', 'Medical', 'Extraction', 'Cultivation',
  'Dispensaries', 'Lab Data', 'Compliance', 'Products', 'Educational'
];

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

  const handleProcessFile = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Validate mappings
      const hasTitleMapping = columnMappings.some(
        mapping => mapping.targetField === 'title' && mapping.sourceColumn
      );
      
      const hasDescriptionMapping = columnMappings.some(
        mapping => mapping.targetField === 'description' && mapping.sourceColumn
      );
      
      if (!hasTitleMapping) {
        throw new Error("You must map a column to the Title field");
      }
      
      if (!hasDescriptionMapping) {
        toast({
          title: "Warning: No Description Field",
          description: "No column is mapped to Description. A default value will be used.",
          variant: "default" // Changed from "warning" to "default"
        });
      }
      
      // Create mapping configuration from the user's selections
      const mappingConfig: DataMappingConfig = {
        columnMappings: {},
        defaultValues: {
          category: selectedCategory,
          description: "No description provided" // Default description for missing values
        },
        schemaType
      };
      
      // Process column mappings, handling custom fields
      columnMappings.forEach(mapping => {
        if (!mapping.targetField || mapping.targetField === 'ignore') return; // Skip unmapped columns
        
        if (mapping.isCustomField) {
          // For custom fields, use the custom name or the source column
          const customFieldName = customFields[mapping.sourceColumn] || mapping.sourceColumn;
          mappingConfig.columnMappings[`additionalFields.${customFieldName}`] = mapping.sourceColumn;
        } else {
          // For standard fields, use the target field directly
          mappingConfig.columnMappings[mapping.targetField] = mapping.sourceColumn;
        }
      });
      
      console.log("Processing with mapping config:", mappingConfig);
      
      // Process the file with progress updates
      const result = await processFileContent(file.file, mappingConfig);
      
      setProgress(100);
      
      if (!result.success && result.processedRows === 0) {
        throw new Error(`File processing failed with ${result.errorCount} errors: ${result.errors.map(e => e.message).join(', ')}`);
      }
      
      // Show success or partial success message
      if (result.errorCount > 0) {
        toast({
          title: "Processing Completed with Warnings",
          description: `Processed ${result.processedRows} of ${result.totalRows} rows. ${result.errorCount} rows had issues but were processed with fallback values.`,
          variant: "default" // Changed from "warning" to "default"
        });
      } else {
        toast({
          title: "Processing Complete",
          description: `Successfully processed ${result.processedRows} of ${result.totalRows} rows`,
        });
      }
      
      // Return processed items to the parent component
      onComplete(result.items as unknown as DirectoryItem[]);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

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
      
      <ProcessingControls
        isProcessing={isProcessing}
        progress={progress}
        onProcess={handleProcessFile}
        onCancel={onCancel}
      />
    </div>
  );
};

export default AIColumnMapper;
