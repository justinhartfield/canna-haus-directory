
import React from 'react';
import { Loader2 } from 'lucide-react';

const AnalyzingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Analyzing file with AI...</p>
    </div>
  );
};

export default AnalyzingState;
