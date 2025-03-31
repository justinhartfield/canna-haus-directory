
import { ProcessingResult, TempDirectoryItem } from '../../types';
import { checkBatchForDuplicates } from '@/api/services/directoryItem/duplicateChecking';
import { bulkInsertDirectoryItems } from '@/api/services/directoryItem/bulkOperations';
import { enhanceRawItemWithPlaceholders } from '@/utils/transform/dataEnhancer';
import { transformDataRow } from '@/utils/transform/itemTransformer';
import { formatResults } from './resultProcessor';

/**
 * Process items in batches for better performance
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
  // Step 2: Check for duplicates (20% progress)
  addProcessingStep('Step 2: Checking for duplicates');
  
  // Transform data for duplicate checking - only take the first 100 items for quick checking
  const maxDuplicateCheckItems = Math.min(data.length, 100);
  const itemsForDuplicateCheck: TempDirectoryItem[] = data
    .slice(0, maxDuplicateCheckItems)
    .map(item => ({
      title: (mappings.title && item[mappings.title]) ? String(item[mappings.title]).trim() : 'Untitled',
      description: (mappings.description && item[mappings.description]) ? String(item[mappings.description]).trim() : '',
      category: category,
      subcategory: subcategory,
      tags: [],
      jsonLd: {},
      metaData: {},
      additionalFields: {}
    }));
  
  addProcessingStep(`Checking ${itemsForDuplicateCheck.length} items for duplicates`);
  setProgress(10);
  
  let duplicateResults: Array<{ item: any; error: string }> = [];
  try {
    duplicateResults = await checkBatchForDuplicates(itemsForDuplicateCheck);
    addProcessingStep(`Found ${duplicateResults.length} duplicates`);
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    addProcessingStep(`Error checking duplicates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Continue processing even if duplicate check fails
    duplicateResults = [];
  }
  
  setProgress(20);
  
  // Step 3: Map source fields to target fields and check for missing columns
  addProcessingStep('Step 3: Analyzing column mappings');
  const missingColumns = new Map<string, string>();
  
  if (data.length > 0) {
    const firstItem = data[0];
    // Check if any mapped fields are missing in the data
    for (const [targetField, sourceField] of Object.entries(mappings)) {
      if (!(sourceField in firstItem)) {
        missingColumns.set(sourceField, targetField);
        addProcessingStep(`Warning: Source field "${sourceField}" not found in data`);
      }
    }
  }
  
  setProgress(25);
  
  // Step 4: Transform data (enhanced with performance optimization)
  addProcessingStep('Step 4: Transforming data');
  setProgress(30);
  
  // Batch process for better performance
  const batchSize = 100; // Process data in chunks for better performance
  const allTransformedItems: TempDirectoryItem[] = [];
  const allErrors: Array<{ item: any; error: string }> = [];
  
  // Create a simple mapping config with category
  const basicMappingConfig = {
    columnMappings: mappings,
    defaultValues: {
      category,
      subcategory: subcategory || undefined
    },
    schemaType: 'Thing'
  };
  
  // Process in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, Math.min(i + batchSize, data.length));
    const batchStartIndex = i;
    
    try {
      const batchResult = batch.map((rawItem, index) => {
        try {
          // Enhance raw item with placeholders for missing columns
          const enhancedRawItem = enhanceRawItemWithPlaceholders(rawItem, missingColumns);
          
          // Transform the raw data to our directory item format
          return transformDataRow(enhancedRawItem, basicMappingConfig, batchStartIndex + index);
        } catch (error) {
          console.error(`Error transforming item at index ${batchStartIndex + index}:`, error);
          
          // Add to errors array
          allErrors.push({
            item: rawItem,
            error: error instanceof Error ? error.message : 'Unknown error during transformation'
          });
          
          // Return null for this item, we'll filter them out later
          return null;
        }
      });
      
      // Filter out null values (errors) and add to the transformed items
      allTransformedItems.push(...batchResult.filter(Boolean) as TempDirectoryItem[]);
      
      // Update progress
      const processedPercentage = Math.min(((i + batch.length) / data.length) * 20, 20);
      setProgress(30 + Math.round(processedPercentage));
      
    } catch (error) {
      console.error(`Error processing batch starting at index ${i}:`, error);
      addProcessingStep(`Error processing batch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  addProcessingStep(`Transformed ${allTransformedItems.length} items with ${allErrors.length} errors`);
  setProgress(50);
  
  // Step 5: Upload to database
  addProcessingStep('Step 5: Uploading to database');
  setProgress(60);
  let successItems: any[] = [];

  if (allTransformedItems.length > 0) {
    try {
      // Use smaller batch size to avoid timeout issues
      const uploadBatchSize = 10; // Smaller batch size to avoid issues
      
      // For very large datasets, limit to 300 items to avoid overwhelming the database
      const maxItemsToUpload = Math.min(allTransformedItems.length, 300);
      addProcessingStep(`Limiting upload to ${maxItemsToUpload} items to avoid database overload`);
      
      const itemsToUpload = allTransformedItems.slice(0, maxItemsToUpload);
      
      for (let i = 0; i < itemsToUpload.length; i += uploadBatchSize) {
        const batch = itemsToUpload.slice(i, i + uploadBatchSize);
        addProcessingStep(`Inserting batch ${Math.floor(i / uploadBatchSize) + 1}/${Math.ceil(itemsToUpload.length / uploadBatchSize)}`);
        
        try {
          // Add timestamps to each item
          const timestampedBatch = batch.map(item => ({
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          
          const batchResult = await bulkInsertDirectoryItems(timestampedBatch);
          successItems = [...successItems, ...batchResult.success];
          allErrors.push(...batchResult.errors);
          
          // Update progress based on how much we've processed
          const newProgress = 60 + Math.min(((i + batch.length) / itemsToUpload.length) * 30, 30);
          setProgress(Math.round(newProgress));
          
          addProcessingStep(`Batch result: ${batchResult.success.length} succeeded, ${batchResult.errors.length} failed`);
          
          // Add a small delay between batches to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (batchError) {
          console.error('Error inserting batch:', batchError);
          addProcessingStep(`Error inserting batch: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
          
          // Add all items in the failed batch to errorItems
          allErrors.push(
            ...batch.map(item => ({
              item,
              error: batchError instanceof Error ? batchError.message : 'Unknown error during batch insertion'
            }))
          );
        }
      }
      
      // If we limited the upload, notify the user
      if (allTransformedItems.length > maxItemsToUpload) {
        addProcessingStep(`Only uploaded ${maxItemsToUpload} out of ${allTransformedItems.length} items to prevent database overload`);
        
        // Add remaining items as "skipped"
        const skippedItems = allTransformedItems.length - maxItemsToUpload;
        allErrors.push({
          item: { count: skippedItems },
          error: `Skipped ${skippedItems} items to prevent database overload. Try importing in smaller batches.`
        });
      }
    } catch (error) {
      console.error('Error inserting items:', error);
      addProcessingStep(`Error inserting items: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // If the whole insertion process fails, add all items as errors
      allErrors.push(
        ...allTransformedItems.map(item => ({
          item,
          error: error instanceof Error ? error.message : 'Unknown error during insertion'
        }))
      );
    }
  } else {
    addProcessingStep('No items to insert after filtering duplicates and errors');
  }

  setProgress(90);
  
  // Format and return the results
  return formatResults(
    successItems,
    allErrors,
    duplicateResults,
    missingColumns,
    addProcessingStep,
    setProgress,
    setShowDuplicatesModal
  );
}
