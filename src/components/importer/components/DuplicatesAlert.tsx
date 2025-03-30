
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DuplicatesAlertProps {
  duplicates: any[];
  duplicateHandlingMode: 'skip' | 'replace' | 'merge' | 'variant';
  onModeChange: (mode: 'skip' | 'replace' | 'merge' | 'variant') => void;
}

export const DuplicatesAlert: React.FC<DuplicatesAlertProps> = ({ 
  duplicates, 
  duplicateHandlingMode,
  onModeChange
}) => {
  return (
    <Alert variant="warning" className="border-yellow-500/50 bg-yellow-500/10">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Duplicate Items Detected</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Found {duplicates.length} items that already exist in the database. 
          Choose how to handle these duplicates:
        </p>
        
        <RadioGroup 
          value={duplicateHandlingMode} 
          onValueChange={(value) => onModeChange(value as any)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="skip" id="skip" />
            <Label htmlFor="skip">Skip duplicates</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="replace" id="replace" />
            <Label htmlFor="replace">Replace existing with new data</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="merge" id="merge" />
            <Label htmlFor="merge">Merge new data with existing</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="variant" id="variant" />
            <Label htmlFor="variant">Create as variants (append to title)</Label>
          </div>
        </RadioGroup>
      </AlertDescription>
    </Alert>
  );
};

export default DuplicatesAlert;
