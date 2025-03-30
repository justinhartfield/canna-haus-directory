
import { useState, useCallback } from 'react';
import { DirectoryItem } from '@/types/directory';
import { toast } from '@/hooks/use-toast';
import { bulkInsertDirectoryItems } from '@/api/services/directoryItem/bulkOperations';
import { checkBatchForDuplicates } from '@/api/services/directoryItem/duplicateChecking';

type ProcessingResult = {
  success: DirectoryItem[];
  errors: Array<{ item: any; error: string }>;
  duplicates: Array<{ item: any; error: string }>;
};

interface UseDataProcessingProps {
  onComplete?: (result: ProcessingResult) => void;
}

export const useDataProcessing = ({ onComplete }: UseDataProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);

  const processData = useCallback(async (
    data: Array<Record<string, any>>,
    mappings: Record<string, string>,
    category: string,
    subcategory?: string
  ) => {
    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      // Step 1: Check for duplicates (20% progress)
      setProgress(10);
      const duplicateResults = await checkBatchForDuplicates(
        data.map(item => ({
          title: item.title || '',
          description: item.description || '',
          category: category,
          subcategory: subcategory,
          jsonLd: {}
        }))
      );
      setProgress(20);

      // Step 2: Filter out duplicates
      const nonDuplicates = data.filter(item => 
        !duplicateResults.some(dup => dup.item === item)
      );

      // Step 3: Process and transform data (40% progress)
      setProgress(30);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(40);

      // Step 4: Upload to database (30% progress)
      setProgress(50);
      let successItems: DirectoryItem[] = [];
      let errorItems: Array<{ item: any; error: string }> = [];

      if (nonDuplicates.length > 0) {
        try {
          // Prepare items with category and subcategory
          const itemsToInsert = nonDuplicates.map(item => ({
            title: item.title || 'Untitled',
            description: item.description || 'No description',
            category,
            subcategory: subcategory || undefined,
            jsonLd: {}
          }));

          // Insert in batches
          const insertResult = await bulkInsertDirectoryItems(itemsToInsert);
          successItems = insertResult.success;
          errorItems = insertResult.errors;
        } catch (error) {
          console.error('Error inserting items:', error);
          errorItems = nonDuplicates.map(item => ({
            item,
            error: error instanceof Error ? error.message : 'Unknown error during insertion'
          }));
        }
      }

      setProgress(80);

      // Step 5: Finalize results
      const finalResults: ProcessingResult = {
        success: successItems,
        errors: errorItems,
        duplicates: duplicateResults
      };

      setResults(finalResults);
      setProgress(100);

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(finalResults);
      }

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
    } catch (error) {
      console.error('Error processing data:', error);
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
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(errorResult);
      }
      
      // Show error toast
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [onComplete]);

  const handleCloseDuplicatesModal = useCallback(() => {
    setShowDuplicatesModal(false);
  }, []);

  const handleViewDuplicatesDetails = useCallback(() => {
    setShowDuplicatesModal(true);
  }, []);

  return {
    isProcessing,
    progress,
    results,
    showDuplicatesModal,
    processData,
    handleCloseDuplicatesModal,
    handleViewDuplicatesDetails
  };
};
