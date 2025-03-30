
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, FileCheck, AlertCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  isProcessing: boolean;
  currentStatus: 'idle' | 'processing' | 'uploading' | 'checking-duplicates';
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
    <div className="space-y-4 my-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          {currentStatus === 'processing' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Processing file...</span>
            </>
          )}
          {currentStatus === 'checking-duplicates' && (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>Checking for duplicates...</span>
            </>
          )}
          {currentStatus === 'uploading' && (
            <>
              <Upload className="h-4 w-4 text-primary" />
              <span>Uploading to database...</span>
            </>
          )}
        </div>
        <span className="text-sm">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {currentStatus === 'uploading' && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-green-500" />
              <span>Upload progress</span>
            </div>
            <span className="text-sm">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};
