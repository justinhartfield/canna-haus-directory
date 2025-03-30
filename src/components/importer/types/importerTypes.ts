
import { ColumnMapping } from '@/types/directory';

export interface AIColumnMapperProps {
  file: {
    file: File;
    type: 'csv' | 'xlsx';
  };
  onComplete: (data: any[]) => void;
  onCancel: () => void;
  onImport?: () => void;
  canImport?: boolean;
  category?: string;
}

export interface MappingHeaderProps {
  title: string;
  manualMappingMode: boolean;
  onToggleMode: () => void;
  showModeToggle?: boolean;
}

export interface CategorySchemaSelectorProps {
  selectedCategory: string;
  schemaType: string;
  onCategoryChange: (category: string) => void;
  onSchemaTypeChange: (schemaType: string) => void;
  isProcessing: boolean;
  categories: string[];
  schemaTypes: string[];
}

export interface ColumnMappingTableProps {
  columnMappings: ColumnMapping[];
  availableColumns: string[];
  customFields: Record<string, string>;
  manualMappingMode: boolean;
  isProcessing: boolean;
  onMappingChange: (index: number, targetField: string) => void;
  onCustomFieldNameChange: (sourceColumn: string, customName: string) => void;
  onSourceColumnChange: (index: number, sourceColumn: string) => void;
  onRemoveMapping: (index: number) => void;
}
