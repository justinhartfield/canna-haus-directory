
import { ProcessingResult, TempDirectoryItem } from '../../types';
import { enhanceRawItemWithPlaceholders } from '@/utils/transform/dataEnhancer';
import { transformDataRow } from '@/utils/transform/itemTransformer';
import { identifyMissingColumns } from '@/utils/transform/mappingHelpers';

/**
 * Process items in batches
 */
export async function batchProcessItems(
  data: Array<Record<string, any>>,
  mappings: Record<string, string>,
  category: string,
  subcategory: string | undefined,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void,
  setShowDuplicatesModal: (value: boolean) => void
): Promise<ProcessingResult> {
  const batchSize = 100;
  const totalItems = data.length;
  
  // Initialize result object
  let result: ProcessingResult = {
    success: [],
    errors: [],
    duplicates: []
  };

  // Step 3: Identify missing columns
  addProcessingStep('Step 3: Identifying missing columns');
  const firstRow = data[0] || {};
  const allColumns = Object.keys(firstRow);
  console.log('Available columns:', allColumns.join(', '));
  
  // Create a mapping of missing columns and their target fields
  const missingColumnsMap = identifyMissingColumns(firstRow, mappings);
  
  if (missingColumnsMap.size > 0) {
    addProcessingStep(`Warning: ${missingColumnsMap.size} mapped columns are missing in data`);
  }
  
  // Step 4: Create mapping configuration
  addProcessingStep('Step 4: Creating mapping configuration');
  const mappingConfig = {
    columnMappings: mappings,
    defaultValues: {
      category,
      subcategory: subcategory || ''
    },
    schemaType: 'Thing'
  };
  
  setProgress(20);
  
  // Step 5: Transform data to directory items
  addProcessingStep('Step 5: Transforming data');
  const directory: TempDirectoryItem[] = [];
  const errors: Array<{ item: any; error: string }> = [];
  const titles = new Set<string>();
  const duplicates: Array<{ item: any; error: string }> = [];
  
  // Process items in batches to avoid UI freezing
  for (let i = 0; i < totalItems; i += batchSize) {
    addProcessingStep(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(totalItems / batchSize)}`);
    
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to UI thread
    
    const batch = data.slice(i, i + batchSize);
    
    for (let j = 0; j < batch.length; j++) {
      try {
        const rawItem = batch[j];
        
        // Enhance raw item with placeholders for missing fields
        const enhancedItem = enhanceRawItemWithPlaceholders(rawItem, missingColumnsMap);
        
        // Transform the data row
        const item = transformDataRow(enhancedItem, mappingConfig, i + j);
        
        // Check for duplicates based on title (you might want a more sophisticated approach)
        if (titles.has(item.title)) {
          duplicates.push({
            item: item,
            error: 'Duplicate title'
          });
          continue;
        }
        
        titles.add(item.title);
        directory.push(item);
      } catch (error) {
        console.error(`Error processing item ${i + j}:`, error);
        errors.push({
          item: batch[j],
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    // Update progress
    setProgress(20 + Math.floor((i / totalItems) * 60));
  }
  
  if (duplicates.length > 0) {
    addProcessingStep(`Detected ${duplicates.length} potential duplicates`);
    setShowDuplicatesModal(true);
  }
  
  // Update final result - ensuring types match
  result.success = directory;
  result.errors = errors;
  result.duplicates = duplicates;
  
  setProgress(100);
  return result;
}
