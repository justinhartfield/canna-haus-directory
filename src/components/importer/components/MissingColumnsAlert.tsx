
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MissingColumnsAlertProps {
  missingColumns: string[];
  onClose?: () => void;
}

export const MissingColumnsAlert: React.FC<MissingColumnsAlertProps> = ({ 
  missingColumns,
  onClose 
}) => {
  if (!missingColumns || missingColumns.length === 0) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Required Mappings</AlertTitle>
      <AlertDescription className="space-y-2">
        <div>The following fields must be mapped: {missingColumns.join(', ')}</div>
        {onClose && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
            className="mt-2"
          >
            Dismiss
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default MissingColumnsAlert;
