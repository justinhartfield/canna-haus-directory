
export interface DataMappingConfig {
  columnMappings: Record<string, string>;
  defaultValues: Record<string, any>;
  schemaType: string;
}

export interface FileInfo {
  file: File;
  type: 'csv' | 'xlsx';
}

export interface AIColumnMapperProps {
  file: FileInfo;
  onComplete: (data: any[]) => void;
  onCancel: () => void;
  category?: string;
}

export interface MappingConfiguration {
  sourceColumn: string;
  targetField: string;
  isCustomField: boolean;
  sampleData?: any;
}
