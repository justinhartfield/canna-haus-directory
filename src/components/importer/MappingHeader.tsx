
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
      <h3 className="text-lg font-medium">{title}</h3>
      
      {showModeToggle && (
        <div className="flex items-center space-x-2">
          <Label htmlFor="mapping-mode" className="text-sm">
            {manualMappingMode ? "Manual Mapping" : "AI-Assisted Mapping"}
          </Label>
          <Switch
            id="mapping-mode"
            checked={manualMappingMode}
            onCheckedChange={onToggleMode}
            aria-label="Toggle manual mapping mode"
          />
        </div>
      )}
    </div>
  );
};

export default MappingHeader;
