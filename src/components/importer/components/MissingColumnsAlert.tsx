
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface MissingColumnsAlertProps {
  missingColumns: string[];
}

export const MissingColumnsAlert: React.FC<MissingColumnsAlertProps> = ({ missingColumns }) => {
  if (missingColumns.length === 0) return null;
  
  return (
    <Alert variant="default">
      <AlertTitle>Missing Columns</AlertTitle>
      <AlertDescription>
        <p>The following columns were not found in your data file:</p>
        <ul className="list-disc pl-5 mt-2">
          {missingColumns.map((column, index) => (
            <li key={index}>{column}</li>
          ))}
        </ul>
        <p className="mt-2">Your data will be imported without these fields.</p>
      </AlertDescription>
    </Alert>
  );
};
