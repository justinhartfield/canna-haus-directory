
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  isProcessing: boolean;
  currentStatus: 'idle' | 'processing' | 'uploading';
  progress: number;
  uploadProgress: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isProcessing,
  currentStatus,
  progress,
  uploadProgress
}) => {
  if (!isProcessing) return null;
  
  return (
    <div className="space-y-4">
      {currentStatus === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing data...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {currentStatus === 'uploading' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading to database...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};
