
import { DirectoryItem } from '@/types/directory';

/**
 * Import progress tracking interface
 */
export interface ImportProgress {
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  errorCount: number;
  errors: Array<{file: string, error: string}>;
  status: 'idle' | 'processing' | 'error' | 'complete';
}

/**
 * Result of batch processing
 */
export interface BatchProcessResult {
  success: boolean;
  totalFiles: number;
  processedFiles: number;
  totalRows: number;
  successRows: number;
  errorCount: number;
  errors: Array<{ file: string; errors: Array<{ row: number; message: string }> }>;
  validationFailures?: number;
}
