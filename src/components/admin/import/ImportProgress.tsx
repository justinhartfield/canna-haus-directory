
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ImportProgress } from '@/types/directory';

interface ImportProgressDisplayProps {
  progress: ImportProgress;
}

const ImportProgressDisplay: React.FC<ImportProgressDisplayProps> = ({ progress }) => {
  if (progress.status === 'idle') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress: {progress.processedFiles} of {progress.totalFiles} files</span>
        <span>
          {Math.round((progress.processedFiles / progress.totalFiles) * 100)}%
        </span>
      </div>
      <Progress 
        value={(progress.processedFiles / progress.totalFiles) * 100} 
        className="h-2"
      />
      
      <div className="flex justify-between text-sm mt-2">
        <span className="text-green-400">Success: {progress.successCount} items</span>
        {progress.errorCount > 0 && (
          <span className="text-red-400">Errors: {progress.errorCount}</span>
        )}
      </div>
      
      {progress.errors.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-red-400 mb-2">Errors:</h4>
          <div className="max-h-40 overflow-y-auto text-xs bg-gray-800/50 rounded p-2">
            {progress.errors.map((error, index) => (
              <div key={index} className="mb-1 pb-1 border-b border-gray-700">
                <span className="font-medium">{error.file}:</span> {error.error}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportProgressDisplay;
