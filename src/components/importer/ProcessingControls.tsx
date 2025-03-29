
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Check, Loader2 } from 'lucide-react';

interface ProcessingControlsProps {
  isProcessing: boolean;
  progress: number;
  onProcess: () => void;
  onCancel: () => void;
}

const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  isProcessing,
  progress,
  onProcess,
  onCancel
}) => {
  return (
    <>
      {isProcessing && (
        <div className="space-y-2">
          <Label>Processing File</Label>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-between space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={onProcess} 
          disabled={isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Process File
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ProcessingControls;
