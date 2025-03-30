
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react'; // Replace with lucide-react icon

interface ProcessingResultsProps {
  results: {
    processed: number;
    merged: number;
    variants: number;
    kept: number;
    errors: string[];
  };
}

const ProcessingResults: React.FC<ProcessingResultsProps> = ({ results }) => {
  return (
    <Card className="border-2 border-muted">
      <CardHeader>
        <CardTitle>Processing Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-sm font-medium text-muted-foreground">Processed</p>
              <p className="text-2xl font-bold">{results.processed}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-sm font-medium text-muted-foreground">Merged</p>
              <p className="text-2xl font-bold">{results.merged}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-sm font-medium text-muted-foreground">Variants</p>
              <p className="text-2xl font-bold">{results.variants}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-sm font-medium text-muted-foreground">Kept</p>
              <p className="text-2xl font-bold">{results.kept}</p>
            </div>
          </div>
          
          {results.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Processing Errors</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {results.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingResults;
