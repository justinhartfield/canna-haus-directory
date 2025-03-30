
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImporterFooterProps {
  isImporting: boolean;
  hasSelectedFiles: boolean;
  onClearFiles: () => void;
  onClearResults: () => void;
  hasResults: boolean;
}

const ImporterFooter: React.FC<ImporterFooterProps> = ({
  isImporting,
  hasSelectedFiles,
  onClearFiles,
  onClearResults,
  hasResults
}) => {
  return (
    <div className="flex justify-between w-full">
      <Button 
        variant="outline" 
        onClick={onClearFiles}
        disabled={isImporting || !hasSelectedFiles}
      >
        Clear Files
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onClearResults}
        disabled={isImporting || !hasResults}
      >
        Clear Results
      </Button>
    </div>
  );
};

export default ImporterFooter;
