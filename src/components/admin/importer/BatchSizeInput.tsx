
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BatchSizeInputProps {
  batchSize: number;
  setBatchSize: (value: number) => void;
}

const BatchSizeInput: React.FC<BatchSizeInputProps> = ({
  batchSize,
  setBatchSize
}) => {
  return (
    <div className="space-y-2">
      <Label>Batch Size</Label>
      <Input 
        type="number" 
        value={batchSize} 
        onChange={e => setBatchSize(parseInt(e.target.value) || 100)} 
        min={10} 
        max={1000}
      />
      <p className="text-xs text-muted-foreground">
        Number of items to process in each batch (10-1000)
      </p>
    </div>
  );
};

export default BatchSizeInput;
