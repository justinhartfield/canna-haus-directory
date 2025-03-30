
import React from 'react';
import { Label } from '@/components/ui/label';

interface DataPreviewProps {
  sampleData: Record<string, any>[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ sampleData }) => {
  if (sampleData.length === 0) return null;
  
  return (
    <div className="space-y-2 mt-4">
      <Label>Data Preview</Label>
      <div className="max-h-60 overflow-y-auto border rounded-md p-2">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(sampleData[0], null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DataPreview;
