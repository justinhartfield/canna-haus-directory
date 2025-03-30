
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataImporterAI from './DataImporterAI';
import { useDataImporter } from '@/hooks/admin/useDataImporter';

// Import refactored components
import CategorySelector from './importer/CategorySelector';
import FileUploadSection from './importer/FileUploadSection';
import SelectedFilesDisplay from './importer/SelectedFilesDisplay';
import AdvancedOptionsTab from './importer/AdvancedOptionsTab';
import ImportProgressDisplay from './importer/ImportProgress';
import ImporterFooter from './importer/ImporterFooter';
import { DEFAULT_CATEGORIES, SCHEMA_TYPE_OPTIONS, AVAILABLE_TARGET_FIELDS } from './importer/constants';

const DataImporterAdvanced: React.FC = () => {
  const {
    category,
    setCategory,
    isImporting,
    activeTab,
    setActiveTab,
    selectedFiles,
    sampleData,
    columnMappings,
    schemaType,
    setSchemaType,
    batchSize,
    setBatchSize,
    progress,
    onDrop,
    handleSimpleImport,
    handleMappingChange,
    handleAiCategorySelect,
    handleAiMappingsGenerated,
    clearFiles,
    clearResults
  } = useDataImporter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isImporting || !category,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Data Importer</CardTitle>
        <CardDescription>
          Import and transform data from CSV or Excel files into your directory
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CategorySelector 
          category={category}
          setCategory={setCategory}
          categories={DEFAULT_CATEGORIES}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="simple">Simple Import</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple">
            <FileUploadSection 
              onDrop={onDrop}
              isImporting={isImporting}
              category={category}
              isDragActive={isDragActive}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedOptionsTab 
              schemaType={schemaType}
              setSchemaType={setSchemaType}
              schemaTypeOptions={SCHEMA_TYPE_OPTIONS}
              batchSize={batchSize}
              setBatchSize={setBatchSize}
              columnMappings={columnMappings}
              sampleData={sampleData}
              handleMappingChange={handleMappingChange}
              availableTargetFields={AVAILABLE_TARGET_FIELDS}
            />
          </TabsContent>
          
          <TabsContent value="ai">
            <DataImporterAI 
              onCategorySelect={handleAiCategorySelect}
              onMappingsGenerated={handleAiMappingsGenerated}
              isImporting={isImporting}
            />
          </TabsContent>
        </Tabs>
        
        <SelectedFilesDisplay selectedFiles={selectedFiles} />
        
        {selectedFiles.length > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSimpleImport} 
              disabled={isImporting || !category || selectedFiles.length === 0}
            >
              {isImporting ? 'Importing...' : 'Start Import'}
            </Button>
          </div>
        )}
        
        <ImportProgressDisplay progress={progress} />
      </CardContent>
      
      <CardFooter>
        <ImporterFooter
          isImporting={isImporting}
          hasSelectedFiles={selectedFiles.length > 0}
          onClearFiles={clearFiles}
          onClearResults={clearResults}
          hasResults={progress.status !== 'idle'}
        />
      </CardFooter>
    </Card>
  );
};

export default DataImporterAdvanced;
