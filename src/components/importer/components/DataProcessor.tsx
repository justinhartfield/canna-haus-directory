
import React, { useEffect, useState } from 'react';
import { useDataProcessing } from '../hooks/dataProcessing';
import DuplicatesAlert from './DuplicatesAlert';
import MissingColumnsAlert from './MissingColumnsAlert';
import ProgressIndicator from './ProgressIndicator';

interface DataProcessorProps {
  data: Array<Record<string, any>>;
  mappings: Record<string, string>;
  category: string;
  subcategory?: string;
  onProcessComplete?: (result: any) => void;
  onProgress?: (progress: number) => void;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  data,
  mappings,
  category,
  subcategory,
  onProcessComplete,
  onProgress
}) => {
  const [processingStarted, setProcessingStarted] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  
  const {
    isProcessing,
    progress,
    results,
    showDuplicatesModal,
    handleCloseDuplicatesModal,
    processData,
    processingSteps
  } = useDataProcessing({
    onComplete: onProcessComplete
  });
  
  // Debug logging
  useEffect(() => {
    console.log("DataProcessor state:", {
      processingStarted,
      isProcessing,
      progress,
      hasResults,
      dataLength
    });
  }, [processingStarted, isProcessing, progress, hasResults, dataLength]);
  
  // Pass progress to parent component if needed
  useEffect(() => {
    if (onProgress) {
      onProgress(progress);
    }
  }, [progress, onProgress]);

  // Start processing when the component mounts and has data
  useEffect(() => {
    const startProcessing = async () => {
      if (!processingStarted && data && data.length > 0 && category && Object.keys(mappings).length > 0) {
        setProcessingStarted(true);
        setDataLength(data.length);
        
        try {
          // Only process if we have valid data and mappings
          if (!mappings.title) {
            console.error("No title mapping specified");
            return;
          }
          
          // Process the data
          const result = await processData(data, mappings, category, subcategory);
          setHasResults(true);
          console.log("Processing completed with result:", result);
        } catch (error) {
          console.error("Error processing data:", error);
        }
      }
    };
    
    startProcessing();
  }, [data, mappings, category, subcategory, processData, processingStarted]);

  // Don't render anything visible, this is a processing component
  return (
    <>
      {showDuplicatesModal && results && results.duplicates && (
        <DuplicatesAlert 
          duplicates={results.duplicates}
          onClose={handleCloseDuplicatesModal}
        />
      )}
      {results && results.missingColumns && results.missingColumns.length > 0 && (
        <MissingColumnsAlert 
          missingColumns={results.missingColumns}
        />
      )}
    </>
  );
};

export default DataProcessor;
