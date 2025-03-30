
import { DirectoryItem } from '@/types/directory';

/**
 * Processing results
 */
export interface ProcessingResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  processedFiles?: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: Record<string, any>;
  }>;
  items: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>[];
  missingColumns?: string[]; // Track missing columns
}
