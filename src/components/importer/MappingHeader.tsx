
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MappingHeaderProps {
  title: string;
  manualMappingMode: boolean;
  onToggleMode: () => void;
  showModeToggle?: boolean;
}

const MappingHeader: React.FC<MappingHeaderProps> = ({
  title,
  manualMappingMode,
  onToggleMode,
  showModeToggle = true
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {showModeToggle && (
        <Button variant="outline" size="sm" onClick={onToggleMode} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {manualMappingMode ? "Use AI Suggestions" : "Manual Override"}
        </Button>
      )}
    </div>
  );
};

export default MappingHeader;
