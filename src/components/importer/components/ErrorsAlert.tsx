
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorsAlertProps {
  errors: Array<{ item: any; error: string }>;
  onClose?: () => void;
}

export const ErrorsAlert: React.FC<ErrorsAlertProps> = ({ 
  errors,
  onClose
}) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Processing Errors</AlertTitle>
      <AlertDescription className="space-y-2">
        <div>{errors.length} {errors.length === 1 ? 'error' : 'errors'} occurred during processing.</div>
        {onClose && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
            className="mt-2"
          >
            View details
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorsAlert;
