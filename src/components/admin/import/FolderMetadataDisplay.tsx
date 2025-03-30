
import React from 'react';
import { FolderMetadata } from '@/utils/folderProcessingUtils';
import { Badge } from '@/components/ui/badge';

interface FolderMetadataDisplayProps {
  metadata: FolderMetadata;
  duplicateHandlingMode?: string;
}

const FolderMetadataDisplay: React.FC<FolderMetadataDisplayProps> = ({ 
  metadata,
  duplicateHandlingMode
}) => {
  if (!metadata) return null;
  
  return (
    <div className="p-4 bg-secondary/10 rounded-md">
      <h4 className="font-medium mb-2">Previous Import Metadata</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div>Folder:</div>
        <div>{metadata.folderName}</div>
        
        <div>Last Processed:</div>
        <div>{new Date(metadata.lastProcessed).toLocaleString()}</div>
        
        <div>Files Processed:</div>
        <div>{metadata.fileCount}</div>
        
        <div>Items Imported:</div>
        <div>{metadata.itemCount}</div>
        
        <div>Schema Type:</div>
        <div>{metadata.schemaType}</div>
        
        {duplicateHandlingMode && (
          <>
            <div>Duplicate Handling:</div>
            <div>
              <Badge variant="outline" className="font-mono text-xs">
                {duplicateHandlingMode}
              </Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FolderMetadataDisplay;
