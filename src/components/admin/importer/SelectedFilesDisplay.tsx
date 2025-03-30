
import React from 'react';
import { Label } from '@/components/ui/label';

interface SelectedFilesDisplayProps {
  selectedFiles: File[];
}

const SelectedFilesDisplay: React.FC<SelectedFilesDisplayProps> = ({ selectedFiles }) => {
  if (selectedFiles.length === 0) return null;
  
  return (
    <div className="mt-4 p-3 bg-secondary/20 rounded">
      <Label>Selected Files ({selectedFiles.length}):</Label>
      <ul className="text-sm mt-2 space-y-1 max-h-28 overflow-y-auto">
        {selectedFiles.map((file, index) => (
          <li key={index} className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedFilesDisplay;
