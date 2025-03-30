
import React from 'react';
import SchemaTypeSelector from './SchemaTypeSelector';
import BatchSizeInput from './BatchSizeInput';
import ColumnMappingTable from './ColumnMappingTable';
import DataPreview from './DataPreview';

interface AdvancedOptionsTabProps {
  schemaType: string;
  setSchemaType: (value: string) => void;
  schemaTypeOptions: string[];
  batchSize: number;
  setBatchSize: (value: number) => void;
  columnMappings: Array<{
    sourceColumn: string;
    targetField: string;
  }>;
  sampleData: Record<string, any>[];
  handleMappingChange: (index: number, targetField: string) => void;
  availableTargetFields: Array<{
    value: string;
    label: string;
  }>;
}

const AdvancedOptionsTab: React.FC<AdvancedOptionsTabProps> = ({
  schemaType,
  setSchemaType,
  schemaTypeOptions,
  batchSize,
  setBatchSize,
  columnMappings,
  sampleData,
  handleMappingChange,
  availableTargetFields
}) => {
  return (
    <div className="space-y-4">
      <SchemaTypeSelector 
        schemaType={schemaType} 
        setSchemaType={setSchemaType} 
        schemaTypeOptions={schemaTypeOptions} 
      />
      
      <BatchSizeInput 
        batchSize={batchSize} 
        setBatchSize={setBatchSize} 
      />
      
      {sampleData.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium">Column Mappings</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Map columns from your data file to fields in the directory
          </p>
          
          <ColumnMappingTable 
            columnMappings={columnMappings}
            sampleData={sampleData}
            handleMappingChange={handleMappingChange}
            availableTargetFields={availableTargetFields}
          />
        </div>
      )}
      
      <DataPreview sampleData={sampleData} />
    </div>
  );
};

export default AdvancedOptionsTab;
