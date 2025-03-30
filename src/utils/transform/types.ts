
/**
 * Type definitions for the transform module
 */

// Export the ProcessingResult interface so it can be imported elsewhere
export interface ProcessingResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  processedFiles: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: any;
  }>;
  items: any[];
  missingColumns?: string[];
}
