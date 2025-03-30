
import { ProcessingResult } from '../types';

export interface ProcessingActionsResult {
  processData: (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => Promise<ProcessingResult>;
  getDebugInfo: () => any;
}
