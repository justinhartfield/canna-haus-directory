
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
}

export interface DirectoryCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  count?: number;
  iconName?: string;
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
