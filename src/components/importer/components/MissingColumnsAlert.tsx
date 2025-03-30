
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MissingColumnsAlertProps {
  missingColumns: string[];
}

export const MissingColumnsAlert: React.FC<MissingColumnsAlertProps> = ({ missingColumns }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Required Mappings</AlertTitle>
      <AlertDescription>
        The following fields must be mapped: {missingColumns.join(', ')}
      </AlertDescription>
    </Alert>
  );
};

export default MissingColumnsAlert;
