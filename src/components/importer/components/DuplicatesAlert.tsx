
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DuplicatesAlertProps {
  duplicates: Array<{ item: any; error: string }>;
  onClose: () => void;
}

const DuplicatesAlert: React.FC<DuplicatesAlertProps> = ({ 
  duplicates, 
  onClose 
}) => {
  if (!duplicates || duplicates.length === 0) return null;
  
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-800">Duplicate Items Found</AlertTitle>
      <AlertDescription className="text-amber-700 space-y-2">
        <div>
          {duplicates.length} {duplicates.length === 1 ? 'item was' : 'items were'} skipped because they already exist in the database.
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClose}
          className="bg-amber-100 hover:bg-amber-200 border-amber-300"
        >
          View details
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DuplicatesAlert;
