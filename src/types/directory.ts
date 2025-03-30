
/**
 * Core data types for the directory
 */

export interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  jsonLd: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  metaData?: Record<string, any>;
  // New field to store additional data that doesn't match existing fields
  additionalFields?: Record<string, any>;
}

export interface DirectoryCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  count?: number;
  iconName?: string;
}

export interface DirectoryFilter {
  category?: string;
  subcategory?: string;
  categories?: boolean[];
  searchTerm?: string;
}

export interface ImportProgress {
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    file: string;
    error: string;
  }>;
  status: 'idle' | 'processing' | 'complete' | 'error';
}

// The structure for column mapping
export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  isCustomField: boolean;
  sampleData?: any;
}

// The import analysis result
export interface ImportAnalysis {
  suggestedMappings: ColumnMapping[];
  unmappedColumns: string[];
  sampleData: Record<string, any>;
  parsedData?: Array<Record<string, any>>; // Added this property
}
