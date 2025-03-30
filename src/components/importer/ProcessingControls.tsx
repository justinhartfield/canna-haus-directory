import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, Import, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [stalledTimer, setStalledTimer] = useState<number>(0);
  const [previousProgress, setPreviousProgress] = useState<number>(progress);
  const [isStalled, setIsStalled] = useState<boolean>(false);
  
  // Monitor for stalled processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      // Reset stalled state when progress changes
      if (progress !== previousProgress) {
        setPreviousProgress(progress);
        setStalledTimer(0);
        setIsStalled(false);
      }
      
      // Monitor for stalled progress
      interval = setInterval(() => {
        if (progress === previousProgress && progress > 0 && progress < 100) {
          setStalledTimer(prev => {
            const newValue = prev + 1;
            // If stalled for more than 10 seconds, show warning
            if (newValue >= 10 && !isStalled) {
              setIsStalled(true);
              toast({
                title: "Processing may be stalled",
                description: "The process hasn't made progress in 10 seconds. You can continue waiting or cancel.",
                variant: "default"
              });
            }
            return newValue;
          });
        }
      }, 1000);
    } else {
      // Reset when processing stops
      setStalledTimer(0);
      setIsStalled(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, progress, previousProgress, isStalled]);

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span>Uploading and processing data...</span>
              {isStalled && (
                <div className="flex items-center ml-2 text-amber-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Processing may be stalled</span>
                </div>
              )}
            </div>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {isStalled && progress < 100 && (
            <div className="text-xs text-muted-foreground">
              Stalled for {stalledTimer} seconds. You can continue waiting or cancel the operation.
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing && progress > 0 && progress < 5}
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
