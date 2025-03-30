
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProcessingResultsProps {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  isProcessing: boolean;
  duplicates?: number;
}

const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  processed,
  succeeded,
  failed,
  skipped,
  isProcessing,
  duplicates = 0
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
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">{skipped}</span>
          {duplicates > 0 && (
            <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-400">
              {duplicates} duplicates
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingResults;
