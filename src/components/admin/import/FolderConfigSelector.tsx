
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getSchemaTemplate } from '@/utils/folderProcessingUtils';

interface FolderConfigSelectorProps {
  selectedFolderType: string;
  customFolder: string;
  customSchemaType: string;
  defaultFolderTypes: Array<{ name: string; schemaType: string }>;
  onFolderTypeSelect: (value: string) => void;
  onCustomFolderChange: (value: string) => void;
  onSchemaTypeChange: (value: string) => void;
}

const FolderConfigSelector: React.FC<FolderConfigSelectorProps> = ({
  selectedFolderType,
  customFolder,
  customSchemaType,
  defaultFolderTypes,
  onFolderTypeSelect,
  onCustomFolderChange,
  onSchemaTypeChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Folder Type Selection */}
        <div className="space-y-2">
          <Label>Select Folder Type</Label>
          <Select value={selectedFolderType} onValueChange={onFolderTypeSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a folder type" />
            </SelectTrigger>
            <SelectContent>
              {defaultFolderTypes.map(folder => (
                <SelectItem key={folder.name} value={folder.name}>
                  {folder.name} ({folder.schemaType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Custom Folder Input */}
        <div className="space-y-2">
          <Label>Or Enter Custom Folder Name</Label>
          <Input
            value={customFolder}
            onChange={e => onCustomFolderChange(e.target.value)}
            placeholder="Enter custom folder name"
            disabled={!!selectedFolderType}
          />
        </div>
      </div>
      
      {/* Custom Schema Type (only for custom folders) */}
      {customFolder && (
        <div className="space-y-2">
          <Label>Schema Type for Custom Folder</Label>
          <Select value={customSchemaType} onValueChange={onSchemaTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a schema type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(getSchemaTemplate('Product')).map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FolderConfigSelector;
