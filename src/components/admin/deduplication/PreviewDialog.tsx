
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DirectoryItem } from '@/types/directory';
import { DuplicateGroup } from '@/types/deduplication';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  const selectedDuplicates = selectedGroup.duplicates.filter(d => 
    selectedGroup.selectedDuplicates.includes(d.id)
  );

  const mergedRecord = selectedGroup.action === 'merge' 
    ? getPreviewMergedRecord(selectedGroup.primaryRecord, selectedDuplicates)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Preview Changes
            <Badge className="ml-2" variant={
              selectedGroup.action === 'merge' ? 'default' : 
              selectedGroup.action === 'variant' ? 'secondary' : 'outline'
            }>
              {selectedGroup.action === 'merge' ? 'Merge' : 
              selectedGroup.action === 'variant' ? 'Mark as Variant' : 'Keep As Is'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Original Record</h3>
            <div className="border p-4 rounded-md">
              <p><strong>Title:</strong> {selectedGroup.primaryRecord.title}</p>
              <p><strong>Category:</strong> {selectedGroup.primaryRecord.category}</p>
              <p><strong>Description:</strong> {selectedGroup.primaryRecord.description}</p>
              <p><strong>Tags:</strong> {selectedGroup.primaryRecord.tags?.join(', ') || 'None'}</p>
              
              {selectedGroup.primaryRecord.additionalFields && 
               Object.keys(selectedGroup.primaryRecord.additionalFields).length > 0 && (
                <div className="mt-2">
                  <strong>Additional Fields:</strong>
                  <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedGroup.primaryRecord.additionalFields, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2 text-lg">
              After {selectedGroup.action === 'merge' ? 'Merging' : 
                selectedGroup.action === 'variant' ? 'Marking as Variant' : 'Keeping'}
            </h3>
            
            <div className="border p-4 rounded-md">
              {selectedGroup.action === 'merge' && mergedRecord && (
                <>
                  <p><strong>Title:</strong> {mergedRecord.title}</p>
                  <p><strong>Category:</strong> {mergedRecord.category}</p>
                  <p><strong>Description:</strong> {mergedRecord.description}</p>
                  <p>
                    <strong>Tags:</strong> 
                    <span className="ml-1">
                      {mergedRecord.tags?.length 
                        ? mergedRecord.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="mr-1 mb-1">{tag}</Badge>
                          ))
                        : 'None'}
                    </span>
                  </p>
                  
                  {mergedRecord.additionalFields && 
                   Object.keys(mergedRecord.additionalFields).length > 0 && (
                    <div className="mt-2">
                      <strong>Additional Fields:</strong>
                      <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(mergedRecord.additionalFields, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
              
              {selectedGroup.action === 'variant' && (
                <div className="space-y-2">
                  <p>
                    Selected records will be marked as variants of the primary record.
                    They will remain separate entries, but will be linked to the primary record.
                  </p>
                  
                  <h4 className="font-medium mt-4">Selected records to mark as variants:</h4>
                  <ul className="list-disc pl-5">
                    {selectedDuplicates.map(duplicate => (
                      <li key={duplicate.id}>{duplicate.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedGroup.action === 'keep' && (
                <p>
                  All records will be kept as separate entries.
                  No changes will be made to any of the records.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
