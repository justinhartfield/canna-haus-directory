
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AnalysisErrorStateProps {
  onRetry: () => void;
  onManualMapping: () => void;
  onCancel: () => void;
}

const AnalysisErrorState: React.FC<AnalysisErrorStateProps> = ({
  onRetry,
  onManualMapping,
  onCancel
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p>Failed to analyze file. Please try again or use manual mapping.</p>
      <div className="flex space-x-4">
        <Button onClick={onRetry}>Retry Analysis</Button>
        <Button onClick={onManualMapping} variant="secondary">Manual Mapping</Button>
        <Button onClick={onCancel} variant="outline">Go Back</Button>
      </div>
    </div>
  );
};

export default AnalysisErrorState;
