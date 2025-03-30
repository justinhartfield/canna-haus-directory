
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SelectedFileInfoProps {
  fileName: string;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isImporting: boolean;
}

const SelectedFileInfo: React.FC<SelectedFileInfoProps> = ({
  fileName,
  onAnalyze,
  isAnalyzing,
  isImporting
}) => {
  return (
    <div className="bg-secondary/20 p-3 rounded">
      <p className="text-sm font-medium">Selected file: {fileName}</p>
      <div className="mt-2 flex space-x-2">
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || isImporting}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : 'Analyze with AI'}
        </Button>
      </div>
    </div>
  );
};

export default SelectedFileInfo;
