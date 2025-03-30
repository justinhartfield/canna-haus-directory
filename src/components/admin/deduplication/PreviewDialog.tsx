
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DirectoryItem } from '@/types/directory';
import { DuplicateGroup } from '@/hooks/useDataDeduplication';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroup: DuplicateGroup | null;
  getPreviewMergedRecord: (primary: DirectoryItem, duplicates: DirectoryItem[]) => any;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  selectedGroup,
  getPreviewMergedRecord
}) => {
  if (!selectedGroup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Preview Changes</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Original Record</h3>
          <div className="border p-4 rounded-md mb-6">
            <p><strong>Title:</strong> {selectedGroup.primaryRecord.title}</p>
            <p><strong>Category:</strong> {selectedGroup.primaryRecord.category}</p>
            <p><strong>Description:</strong> {selectedGroup.primaryRecord.description}</p>
            <p><strong>Tags:</strong> {selectedGroup.primaryRecord.tags?.join(', ') || 'None'}</p>
            <div className="mt-2">
              <strong>Additional Fields:</strong>
              <pre className="text-xs mt-1 bg-muted p-2 rounded">
                {JSON.stringify(selectedGroup.primaryRecord.additionalFields || {}, null, 2)}
              </pre>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">After {selectedGroup.action === 'merge' ? 'Merging' : 
            selectedGroup.action === 'variant' ? 'Marking as Variant' : 'Keeping'}</h3>
          <div className="border p-4 rounded-md">
            {selectedGroup.action === 'merge' && (
              <>
                <p><strong>Title:</strong> {selectedGroup.primaryRecord.title}</p>
                <p><strong>Category:</strong> {selectedGroup.primaryRecord.category}</p>
                <p><strong>Description:</strong> {selectedGroup.primaryRecord.description}</p>
                <p><strong>Tags:</strong> {
                  getPreviewMergedRecord(
                    selectedGroup.primaryRecord, 
                    selectedGroup.duplicates.filter(d => selectedGroup.selectedDuplicates.includes(d.id))
                  ).tags?.join(', ') || 'None'
                }</p>
                <div className="mt-2">
                  <strong>Additional Fields:</strong>
                  <pre className="text-xs mt-1 bg-muted p-2 rounded">
                    {JSON.stringify(
                      getPreviewMergedRecord(
                        selectedGroup.primaryRecord, 
                        selectedGroup.duplicates.filter(d => selectedGroup.selectedDuplicates.includes(d.id))
                      ).additionalFields || {}, 
                      null, 
                      2
                    )}
                  </pre>
                </div>
              </>
            )}
            
            {selectedGroup.action === 'variant' && (
              <p>
                Selected records will be marked as variants of the primary record.
                They will remain separate entries, but will be linked to the primary record.
              </p>
            )}
            
            {selectedGroup.action === 'keep' && (
              <p>
                All records will be kept as separate entries.
                No changes will be made to any of the records.
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
