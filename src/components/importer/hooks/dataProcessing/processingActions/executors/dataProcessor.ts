
import { ProcessingResult, TempDirectoryItem } from '../../types';
import { enhanceRawItemWithPlaceholders } from '@/utils/transform/dataEnhancer';
import { transformDataRow } from '@/utils/transform/itemTransformer';
import { batchProcessItems } from './batchProcessor';
import { handleProcessingError } from './errorHandler';

/**
 * Process data with the provided configuration
 */
export async function processData(
  data: Array<Record<string, any>>,
  mappings: Record<string, string>,
  category: string,
  subcategory: string | undefined,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void,
  setShowDuplicatesModal: (value: boolean) => void
): Promise<ProcessingResult> {
  if (!data || data.length === 0) {
    addProcessingStep('No data to process');
    const emptyResult: ProcessingResult = { success: [], errors: [], duplicates: [] };
    return emptyResult;
  }

  // Step 1: Check required mappings
  addProcessingStep('Step 1: Checking required mappings');
  const missingRequiredMappings: string[] = [];
  
  // Title is always required
  if (!mappings.title) {
    missingRequiredMappings.push('title');
  }
  
  // Description is strongly recommended
  if (!mappings.description) {
    missingRequiredMappings.push('description');
  }
  
  if (missingRequiredMappings.length > 0) {
    addProcessingStep(`Missing required mappings: ${missingRequiredMappings.join(', ')}`);
    
    // If we're missing critical mappings, we should stop processing
    if (missingRequiredMappings.includes('title')) {
      const result: ProcessingResult = { 
        success: [], 
        errors: [], 
        duplicates: [],
        missingColumns: missingRequiredMappings 
      };
      return result;
    }
  }
  
  setProgress(5);

  try {
    // Step 2: Transform and process all data
    const result = await batchProcessItems(
      data,
      mappings,
      category,
      subcategory,
      addProcessingStep,
      setProgress,
      setShowDuplicatesModal
    );
    
    return result;
  } catch (error) {
    return handleProcessingError(error, addProcessingStep);
  }
}
