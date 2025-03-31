
import { useState } from 'react';
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
    newMappings[index].sampleData = sampleData?.[sourceColumn] || '';
    setColumnMappings(newMappings);
  };

  const handleAddMapping = (availableColumns: string[], sampleData?: Record<string, any>) => {
    if (availableColumns.length === 0) return;
    
    setColumnMappings([
      ...columnMappings,
      {
        sourceColumn: availableColumns[0],
        targetField: "ignore", // Default to "ignore" instead of empty string
        isCustomField: false,
        sampleData: sampleData?.[availableColumns[0]] || ''
      }
    ]);
  };

  const handleRemoveMapping = (index: number) => {
    const newMappings = [...columnMappings];
    newMappings.splice(index, 1);
    setColumnMappings(newMappings);
  };

  const updateMappingsFromAnalysis = (analysis: ImportAnalysis) => {
    setColumnMappings(analysis.suggestedMappings);
  };

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
