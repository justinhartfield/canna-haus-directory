
import { useState, useEffect } from 'react';
import { ColumnMapping, ImportAnalysis } from '@/types/directory';

interface UseColumnMappingStateProps {
  initialMappings?: ColumnMapping[];
  initialCustomFields?: Record<string, string>;
}

export function useColumnMappingState({
  initialMappings = [],
  initialCustomFields = {}
}: UseColumnMappingStateProps = {}) {
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(initialMappings);
  const [customFields, setCustomFields] = useState<Record<string, string>>(initialCustomFields);

  const handleMappingChange = (index: number, targetField: string) => {
    const newMappings = [...columnMappings];
    newMappings[index].targetField = targetField || "ignore"; // Ensure targetField is never empty
    newMappings[index].isCustomField = targetField === "custom";
    setColumnMappings(newMappings);
  };

  const handleCustomFieldNameChange = (sourceColumn: string, customName: string) => {
    setCustomFields({
      ...customFields,
      [sourceColumn]: customName
    });
  };

  const handleSourceColumnChange = (index: number, sourceColumn: string, sampleData?: Record<string, any>) => {
    const newMappings = [...columnMappings];
    newMappings[index].sourceColumn = sourceColumn;
    
    // Make sure to update the sample data if it exists
    if (sampleData) {
      newMappings[index].sampleData = sampleData[sourceColumn] || '';
    }
    
    setColumnMappings(newMappings);
    
    // Log the update for debugging
    console.log(`Updated source column at index ${index} to ${sourceColumn}`);
  };

  const handleAddMapping = (availableColumns: string[], sampleData?: Record<string, any>) => {
    if (availableColumns.length === 0) {
      console.warn('Cannot add mapping: no available columns');
      return;
    }
    
    console.log(`Adding new mapping with source column: ${availableColumns[0]}`);
    
    const newMapping: ColumnMapping = {
      sourceColumn: availableColumns[0],
      targetField: "ignore", // Default to "ignore" instead of empty string
      isCustomField: false,
      sampleData: sampleData?.[availableColumns[0]] || ''
    };
    
    setColumnMappings([...columnMappings, newMapping]);
  };

  const handleRemoveMapping = (index: number) => {
    const newMappings = [...columnMappings];
    newMappings.splice(index, 1);
    setColumnMappings(newMappings);
    console.log(`Removed mapping at index ${index}`);
  };

  const updateMappingsFromAnalysis = (analysis: ImportAnalysis) => {
    if (!analysis || !analysis.suggestedMappings) {
      console.warn('No valid analysis data provided for mapping update');
      return;
    }
    
    console.log(`Updating mappings from analysis. Found ${analysis.suggestedMappings.length} mappings.`);
    setColumnMappings(analysis.suggestedMappings);
  };

  // Debug log when mappings change
  useEffect(() => {
    console.log(`Column mappings updated. Current count: ${columnMappings.length}`);
  }, [columnMappings]);

  return {
    columnMappings,
    customFields,
    setColumnMappings,
    setCustomFields,
    handleMappingChange,
    handleCustomFieldNameChange,
    handleSourceColumnChange,
    handleAddMapping,
    handleRemoveMapping,
    updateMappingsFromAnalysis
  };
}
