
import { DirectoryItem } from '@/types/directory';

// For creating temp items without ID, createdAt and updatedAt
export type TempDirectoryItem = Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>;

export type ProcessingResult = {
  success: DirectoryItem[];
  errors: Array<{ item: any; error: string }>;
  duplicates: Array<{ item: any; error: string }>;
};

export interface UseDataProcessingProps {
  onComplete?: (result: ProcessingResult) => void;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  results: ProcessingResult | null;
  showDuplicatesModal: boolean;
  processingError: Error | null;
  processingSteps: string[];
}

export interface ProcessingActions {
  processData: (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => Promise<ProcessingResult>;
  handleCloseDuplicatesModal: () => void;
  handleViewDuplicatesDetails: () => void;
  getDebugInfo: () => any;
}
