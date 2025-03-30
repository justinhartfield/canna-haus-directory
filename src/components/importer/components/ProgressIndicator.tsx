
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  progress: number;
  status: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, status }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{status}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressIndicator;
