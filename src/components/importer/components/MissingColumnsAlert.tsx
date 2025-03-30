
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
      <AlertDescription>
        The following fields must be mapped: {missingColumns.join(', ')}
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-2 underline hover:text-red-300"
          >
            Dismiss
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default MissingColumnsAlert;
