
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle>Processing Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Processed: {results.processed} groups</p>
          <p>Merged: {results.merged} groups</p>
          <p>Marked as variants: {results.variants} groups</p>
          <p>Kept as is: {results.kept} groups</p>
          
          {results.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Errors:</h4>
              <ul className="list-disc pl-5 mt-2">
                {results.errors.map((error, i) => (
                  <li key={i} className="text-destructive">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingResults;
