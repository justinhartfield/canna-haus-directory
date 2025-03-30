
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

interface DuplicatesAlertProps {
  duplicates: Array<{item: any, error: string}>;
  onContinue: () => void;
}

export const DuplicatesAlert: React.FC<DuplicatesAlertProps> = ({ 
  duplicates,
  onContinue
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!duplicates || duplicates.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="border-red-600">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Duplicate Entries Detected
        <Badge variant="outline" className="text-white border-white">
          {duplicates.length}
        </Badge>
      </AlertTitle>
      <AlertDescription>
        <div className="text-sm mt-1">
          Found {duplicates.length} items that already exist in the database or have duplicates within the file.
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-white text-white"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-white text-white"
            onClick={onContinue}
          >
            Skip Duplicates & Continue
          </Button>
        </div>
        
        {showDetails && (
          <ScrollArea className="mt-3 max-h-40 border border-red-400/30 rounded p-2 bg-red-500/10">
            <ul className="text-xs space-y-1">
              {duplicates.slice(0, 20).map((item, idx) => (
                <li key={idx} className="pb-1 border-b border-red-400/30">
                  <strong>{item.item.title}</strong> in <em>{item.item.category}</em>: {item.error}
                </li>
              ))}
              {duplicates.length > 20 && (
                <li className="pt-1 text-center font-medium">
                  ... and {duplicates.length - 20} more duplicates
                </li>
              )}
            </ul>
          </ScrollArea>
        )}
      </AlertDescription>
    </Alert>
  );
};
