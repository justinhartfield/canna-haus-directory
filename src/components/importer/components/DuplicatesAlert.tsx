
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
      <AlertDescription className="text-amber-700">
        {duplicates.length} {duplicates.length === 1 ? 'item was' : 'items were'} skipped because they already exist in the database.
        <button 
          onClick={onClose}
          className="ml-2 text-amber-700 underline hover:text-amber-900"
        >
          View details
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default DuplicatesAlert;
