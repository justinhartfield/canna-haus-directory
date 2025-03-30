
import React from 'react';

interface ProcessingResultsProps {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  isProcessing: boolean;
}

const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  processed,
  succeeded,
  failed,
  skipped,
  isProcessing
}) => {
  if (processed === 0 || isProcessing) return null;
  
  return (
    <div className="p-4 bg-secondary/10 rounded-md">
      <h4 className="font-medium mb-2">Processing Results</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Total Items:</div>
        <div>{processed}</div>
        
        <div>Succeeded:</div>
        <div className="text-green-400">{succeeded}</div>
        
        <div>Failed:</div>
        <div className="text-red-400">{failed}</div>
        
        <div>Skipped:</div>
        <div className="text-yellow-400">{skipped}</div>
      </div>
    </div>
  );
};

export default ProcessingResults;
