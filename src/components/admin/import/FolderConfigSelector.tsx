
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getSchemaTemplate } from '@/utils/folderProcessingUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface FolderConfigSelectorProps {
  selectedFolderType: string;
  customFolder: string;
  customSchemaType: string;
  defaultFolderTypes: Array<{ name: string; schemaType: string }>;
  onFolderTypeSelect: (value: string) => void;
  onCustomFolderChange: (value: string) => void;
  onSchemaTypeChange: (value: string) => void;
  duplicateHandlingMode?: string;
  onDuplicateHandlingChange?: (mode: string) => void;
}

const DUPLICATE_HANDLING_OPTIONS = [
  { value: 'skip', label: 'Skip duplicates (default)' },
  { value: 'replace', label: 'Replace existing records' },
  { value: 'merge', label: 'Merge with existing data' },
  { value: 'variant', label: 'Create as variants' }
];

const FolderConfigSelector: React.FC<FolderConfigSelectorProps> = ({
  selectedFolderType,
  customFolder,
  customSchemaType,
  defaultFolderTypes,
  onFolderTypeSelect,
  onCustomFolderChange,
  onSchemaTypeChange,
  duplicateHandlingMode = 'skip',
  onDuplicateHandlingChange = () => {}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        {/* Duplicate Handling Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label>Duplicate Handling</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={14} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    How to handle duplicate items when importing. 
                    Items are considered duplicates if they have the same title, category, and breeder/source.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={duplicateHandlingMode} onValueChange={onDuplicateHandlingChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select handling mode" />
            </SelectTrigger>
            <SelectContent>
              {DUPLICATE_HANDLING_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {duplicateHandlingMode === 'variant' && (
        <Card className="border-yellow-400/30 bg-yellow-400/5">
          <CardContent className="pt-4 text-xs">
            <p className="text-yellow-400">
              <strong>Variant Mode:</strong> Duplicate items will be imported as variants with their
              title modified to include the breeder/source. If breeder/source isn't available, a sequential
              number will be added to the title.
            </p>
          </CardContent>
        </Card>
      )}
      
      {duplicateHandlingMode === 'merge' && (
        <Card className="border-blue-400/30 bg-blue-400/5">
          <CardContent className="pt-4 text-xs">
            <p className="text-blue-400">
              <strong>Merge Mode:</strong> New data will be merged with existing records.
              Fields that exist in the new data but not in the existing record will be added.
              Tags will be combined.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FolderConfigSelector;
