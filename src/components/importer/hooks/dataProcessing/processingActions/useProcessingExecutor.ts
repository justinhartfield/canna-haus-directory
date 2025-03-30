
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { bulkInsertDirectoryItems } from '@/api/services/directoryItem/bulkOperations';
import { checkBatchForDuplicates } from '@/api/services/directoryItem/duplicateChecking';
import { ProcessingResult, TempDirectoryItem } from '../types';

/**
 * Hook providing the main data processing logic
 */
export function useProcessingExecutor(
  setIsProcessing: (value: boolean) => void,
  setProgress: (value: number) => void,
  setResults: (value: ProcessingResult | null) => void,
  setProcessingError: (value: Error | null) => void,
  setShowDuplicatesModal: (value: boolean) => void,
  addProcessingStep: (step: string) => void
) {
  const processData = useCallback(async (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => {
    setIsProcessing(true);
    setProgress(0);
    setResults(null);
    setProcessingError(null);
    addProcessingStep("Starting processing of " + data.length + " items");

    try {
      // Handle empty data case
      if (!data || data.length === 0) {
        addProcessingStep('No data to process');
        throw new Error('No data to process');
      }

      // Step 1: Check for duplicates (20% progress)
      const duplicateResults = await checkForDuplicates(
        data, 
        mappings, 
        category, 
        subcategory, 
        addProcessingStep, 
        setProgress
      );
      
      // Step 2: Filter out duplicates
      const nonDuplicates = filterOutDuplicates(
        data, 
        duplicateResults, 
        mappings, 
        category, 
        addProcessingStep
      );
      
      // Step 3: Process and transform data (40% progress)
      const transformedItems = transformData(
        nonDuplicates, 
        mappings, 
        category, 
        subcategory, 
        addProcessingStep, 
        setProgress
      );
      
      // Step 4: Upload to database (30% progress)
      const { successItems, errorItems } = await uploadToDatabase(
        transformedItems, 
        addProcessingStep, 
        setProgress
      );

      // Step 5: Finalize results
      return finalizeResults(
        successItems, 
        errorItems, 
        duplicateResults, 
        addProcessingStep, 
        setProgress, 
        setResults, 
        setShowDuplicatesModal
      );
    } catch (error) {
      return handleProcessingError(
        error, 
        addProcessingStep, 
        setProgress, 
        setProcessingError, 
        setResults
      );
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, setProgress, setResults, setProcessingError, addProcessingStep, setShowDuplicatesModal]);

  return { processData };
}

// Helper function to check for duplicates
async function checkForDuplicates(
  data: Array<Record<string, any>>,
  mappings: Record<string, string>,
  category: string,
  subcategory: string | undefined,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void
) {
  addProcessingStep('Step 1: Checking for duplicates');
  setProgress(5);
  
  // Transform data for duplicate checking
  const itemsForDuplicateCheck: TempDirectoryItem[] = data.map(item => ({
    title: (mappings.title && item[mappings.title]) ? String(item[mappings.title]) : 'Untitled',
    description: (mappings.description && item[mappings.description]) ? String(item[mappings.description]) : '',
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
  return duplicateResults;
}

// Helper function to filter out duplicates
function filterOutDuplicates(
  data: Array<Record<string, any>>,
  duplicateResults: Array<{ item: any; error: string }>,
  mappings: Record<string, string>,
  category: string,
  addProcessingStep: (step: string) => void
) {
  const nonDuplicates = data.filter(item => 
    !duplicateResults.some(dup => 
      dup.item.title === (mappings.title ? String(item[mappings.title]) : 'Untitled') &&
      dup.item.category === category
    )
  );
  
  addProcessingStep(`After filtering: ${nonDuplicates.length} non-duplicate items`);
  return nonDuplicates;
}

// Helper function to transform data
function transformData(
  nonDuplicates: Array<Record<string, any>>,
  mappings: Record<string, string>,
  category: string,
  subcategory: string | undefined,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void
) {
  addProcessingStep('Step 3: Transforming data');
  setProgress(30);
  
  // Transform the data to DirectoryItem format
  const transformedItems: TempDirectoryItem[] = nonDuplicates.map(rawItem => {
    const title = mappings.title ? String(rawItem[mappings.title] || 'Untitled') : 'Untitled';
    const description = mappings.description ? String(rawItem[mappings.description] || '') : '';
    const tags = mappings.tags ? 
      (typeof rawItem[mappings.tags] === 'string' 
        ? rawItem[mappings.tags].split(',').map((tag: string) => tag.trim()) 
        : Array.isArray(rawItem[mappings.tags]) 
          ? rawItem[mappings.tags] 
          : []) 
      : [];
    
    return {
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      tags,
      imageUrl: mappings.imageUrl ? String(rawItem[mappings.imageUrl] || '') : undefined,
      thumbnailUrl: mappings.thumbnailUrl ? String(rawItem[mappings.thumbnailUrl] || '') : undefined,
      jsonLd: {},
      additionalFields: {},
      metaData: {}
    };
  });
  
  addProcessingStep(`Transformed ${transformedItems.length} items`);
  setProgress(40);
  return transformedItems;
}

// Helper function to upload data to database
async function uploadToDatabase(
  transformedItems: TempDirectoryItem[],
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void
) {
  addProcessingStep('Step 4: Uploading to database');
  setProgress(50);
  let successItems = [];
  let errorItems: Array<{ item: any; error: string }> = [];

  if (transformedItems.length > 0) {
    try {
      // Insert in batches of 25 items
      const batchSize = 25;
      for (let i = 0; i < transformedItems.length; i += batchSize) {
        const batch = transformedItems.slice(i, i + batchSize);
        addProcessingStep(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedItems.length / batchSize)}`);
        
        try {
          const batchResult = await bulkInsertDirectoryItems(batch);
          successItems = [...successItems, ...batchResult.success];
          errorItems = [...errorItems, ...batchResult.errors];
          
          // Update progress based on how much we've processed
          const newProgress = 50 + Math.min(((i + batch.length) / transformedItems.length) * 30, 30);
          setProgress(Math.round(newProgress));
          
          addProcessingStep(`Batch result: ${batchResult.success.length} succeeded, ${batchResult.errors.length} failed`);
        } catch (batchError) {
          console.error('Error inserting batch:', batchError);
          addProcessingStep(`Error inserting batch: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
          
          // Add all items in the failed batch to errorItems
          errorItems = [
            ...errorItems,
            ...batch.map(item => ({
              item,
              error: batchError instanceof Error ? batchError.message : 'Unknown error during batch insertion'
            }))
          ];
        }
      }
    } catch (error) {
      console.error('Error inserting items:', error);
      addProcessingStep(`Error inserting items: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // If the whole insertion process fails, add all items as errors
      errorItems = transformedItems.map(item => ({
        item,
        error: error instanceof Error ? error.message : 'Unknown error during insertion'
      }));
    }
  } else {
    addProcessingStep('No items to insert after filtering duplicates');
  }

  setProgress(80);
  return { successItems, errorItems };
}

// Helper function to finalize results
function finalizeResults(
  successItems: any[],
  errorItems: Array<{ item: any; error: string }>,
  duplicateResults: Array<{ item: any; error: string }>,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void,
  setResults: (value: ProcessingResult | null) => void,
  setShowDuplicatesModal: (value: boolean) => void
) {
  addProcessingStep('Step 5: Finalizing results');
  const finalResults: ProcessingResult = {
    success: successItems,
    errors: errorItems,
    duplicates: duplicateResults
  };

  setResults(finalResults);
  setProgress(100);
  addProcessingStep(`Processing complete: ${successItems.length} succeeded, ${errorItems.length} failed, ${duplicateResults.length} duplicates`);

  // Show toast with results
  toast({
    title: 'Processing Complete',
    description: `${successItems.length} items imported, ${errorItems.length} errors, ${duplicateResults.length} duplicates`,
    variant: successItems.length > 0 ? 'default' : 'destructive'
  });

  // Show duplicates modal if there are duplicates
  if (duplicateResults.length > 0) {
    setShowDuplicatesModal(true);
  }

  return finalResults;
}

// Helper function to handle processing errors
function handleProcessingError(
  error: unknown,
  addProcessingStep: (step: string) => void,
  setProgress: (value: number) => void,
  setProcessingError: (value: Error | null) => void,
  setResults: (value: ProcessingResult | null) => void
) {
  console.error('Error processing data:', error);
  addProcessingStep(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  setProcessingError(error instanceof Error ? error : new Error('Unknown error'));
  setProgress(100);
  
  // Create error result
  const errorResult: ProcessingResult = {
    success: [],
    errors: [{
      item: null,
      error: error instanceof Error ? error.message : 'Unknown error during processing'
    }],
    duplicates: []
  };
  
  setResults(errorResult);
  
  // Show error toast
  toast({
    title: 'Processing Failed',
    description: error instanceof Error ? error.message : 'Unknown error occurred',
    variant: 'destructive'
  });
  
  return errorResult;
}
