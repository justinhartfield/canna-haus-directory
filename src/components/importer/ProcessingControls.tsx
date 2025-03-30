
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, Import } from 'lucide-react';

interface ProcessingControlsProps {
  isProcessing: boolean;
  progress: number;
  onProcess: () => void;
  onCancel: () => void;
  onImport?: () => void;
  canImport?: boolean;
}

const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  isProcessing,
  progress,
  onProcess,
  onCancel,
  onImport,
  canImport = false
}) => {
  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading and processing data...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        {onImport && (
          <Button
            onClick={onImport}
            disabled={!canImport || isProcessing}
            variant="success"
            className="bg-green-600 hover:bg-green-700"
          >
            <Import className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        )}
        
        <Button
          onClick={onProcess}
          disabled={isProcessing}
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Upload Data"}
        </Button>
      </div>
    </div>
  );
};

export default ProcessingControls;
