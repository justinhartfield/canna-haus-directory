
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { removeExactDuplicates } from '@/api/services/directoryItem/duplicateRemoval';
import { toast } from 'sonner';

interface DuplicateRemovalSectionProps {
  onRemoved?: () => void;
}

const DuplicateRemovalSection: React.FC<DuplicateRemovalSectionProps> = ({ onRemoved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    removedCount: number;
    removedIds: string[];
  } | null>(null);

  const handleAutomaticRemoval = async () => {
    if (!confirm("Are you sure you want to automatically remove exact duplicates? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await removeExactDuplicates();
      console.log("Duplicate removal results:", result);
      setResult(result);
      
      if (result.removedCount > 0) {
        toast.success(`Successfully removed ${result.removedCount} exact duplicate records`);
      } else {
        toast.info('No exact duplicates were found');
      }
      
      // Call the onRemoved callback to trigger a data refresh
      if (onRemoved) {
        onRemoved();
      }
    } catch (error) {
      console.error('Error removing duplicates:', error);
      toast.error('Failed to remove duplicates');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remove Duplicate Records</CardTitle>
        <CardDescription>
          Automatically identify and remove exact duplicate records from the database.
          This will keep the oldest record and remove newer duplicates with the same title and category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Use with caution</AlertTitle>
          <AlertDescription className="text-amber-700">
            Automatic duplicate removal will permanently delete records that are identified as exact
            duplicates based on matching title and category. The oldest record in each group will be kept.
            This action cannot be undone.
          </AlertDescription>
        </Alert>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Results:</h4>
            <p className="text-sm text-gray-700">
              {result.removedCount} duplicate records were removed.
            </p>
            {result.removedIds.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600">Removed IDs:</h5>
                <div className="text-xs text-gray-500 break-all mt-1">
                  {result.removedIds.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          onClick={handleAutomaticRemoval}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isLoading ? 'Removing...' : 'Remove Exact Duplicates'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DuplicateRemovalSection;
