import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DirectoryItem } from '@/types/directory';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getDirectoryItems } from '@/api/services/directoryItem/crudOperations';
import { updateDirectoryItem } from '@/api/services/directoryItem/crudOperations';
import { toast } from 'sonner';
import { findPotentialDuplicates } from '@/utils/deduplication/duplicateDetection';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DuplicateAction = 'merge' | 'variant' | 'keep';
type DuplicateGroup = {
  primaryRecord: DirectoryItem;
  duplicates: DirectoryItem[];
  selectedDuplicates: string[];
  action: DuplicateAction;
};

const DataDeduplicationTool: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [processingResults, setProcessingResults] = useState<{
    processed: number;
    merged: number;
    variants: number;
    kept: number;
    errors: string[];
  } | null>(null);

  // Find potential duplicates
  const findDuplicates = async () => {
    setIsLoading(true);
    try {
      const items = await getDirectoryItems();
      const duplicates = findPotentialDuplicates(items);
      
      const groups = duplicates.map(group => ({
        primaryRecord: group.primary,
        duplicates: group.duplicates,
        selectedDuplicates: group.duplicates.map(d => d.id),
        action: 'merge' as DuplicateAction
      }));
      
      setDuplicateGroups(groups);
      toast.success(`Found ${groups.length} groups of potential duplicates`);
    } catch (error) {
      console.error('Error finding duplicates:', error);
      toast.error('Failed to find duplicates');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle selection of a duplicate record
  const toggleDuplicateSelection = (groupIndex: number, duplicateId: string) => {
    setDuplicateGroups(prev => {
      const groups = [...prev];
      const group = {...groups[groupIndex]};
      
      if (group.selectedDuplicates.includes(duplicateId)) {
        group.selectedDuplicates = group.selectedDuplicates.filter(id => id !== duplicateId);
      } else {
        group.selectedDuplicates.push(duplicateId);
      }
      
      groups[groupIndex] = group;
      return groups;
    });
  };

  // Set action for a duplicate group
  const setAction = (groupIndex: number, action: DuplicateAction) => {
    setDuplicateGroups(prev => {
      const groups = [...prev];
      groups[groupIndex] = {
        ...groups[groupIndex],
        action
      };
      return groups;
    });
  };

  // Open preview dialog for a group
  const openPreview = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setIsPreviewOpen(true);
  };

  // Process duplicate groups based on selected actions
  const processDuplicates = async () => {
    setIsLoading(true);
    const results = {
      processed: 0,
      merged: 0,
      variants: 0,
      kept: 0,
      errors: [] as string[]
    };

    try {
      for (const group of duplicateGroups) {
        const { primaryRecord, duplicates, selectedDuplicates, action } = group;
        
        // Only process duplicates that are selected
        const selectedDuplicateRecords = duplicates.filter(d => 
          selectedDuplicates.includes(d.id)
        );
        
        if (selectedDuplicateRecords.length === 0) continue;
        
        results.processed++;
        
        try {
          if (action === 'merge') {
            // Merge duplicates into primary record
            const mergedData = mergeRecords(primaryRecord, selectedDuplicateRecords);
            await updateDirectoryItem(primaryRecord.id, mergedData);
            
            // TODO: Delete or archive merged records
            // This would require additional backend functionality
            
            results.merged++;
          } else if (action === 'variant') {
            // Mark as variants - could update additionalFields to link them
            for (const duplicate of selectedDuplicateRecords) {
              await updateDirectoryItem(duplicate.id, {
                additionalFields: {
                  ...duplicate.additionalFields,
                  isVariantOf: primaryRecord.id
                }
              });
            }
            results.variants++;
          } else {
            // Keep as is - no action needed
            results.kept++;
          }
        } catch (err) {
          console.error(`Error processing group with primary ${primaryRecord.id}:`, err);
          results.errors.push(`Failed to process ${primaryRecord.title}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
      
      setProcessingResults(results);
      toast.success(`Processed ${results.processed} duplicate groups`);
    } catch (error) {
      console.error('Error processing duplicates:', error);
      toast.error('Failed to process duplicates');
    } finally {
      setIsLoading(false);
    }
  };

  // Merge duplicate records
  const mergeRecords = (primary: DirectoryItem, duplicates: DirectoryItem[]): Partial<DirectoryItem> => {
    const merged: Partial<DirectoryItem> = {};
    
    // Combine tags
    const allTags = new Set<string>();
    if (primary.tags) {
      primary.tags.forEach(tag => allTags.add(tag));
    }
    duplicates.forEach(duplicate => {
      if (duplicate.tags) {
        duplicate.tags.forEach(tag => allTags.add(tag));
      }
    });
    merged.tags = Array.from(allTags);
    
    // Merge additionalFields with prefix for duplicates
    const mergedAdditionalFields: Record<string, any> = {...primary.additionalFields};
    duplicates.forEach((duplicate, index) => {
      if (duplicate.additionalFields) {
        Object.entries(duplicate.additionalFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // If key already exists in primary, add as alternative
            if (mergedAdditionalFields[key] !== undefined && 
                mergedAdditionalFields[key] !== value) {
              mergedAdditionalFields[`alt_${key}_${index + 1}`] = value;
            } else if (mergedAdditionalFields[key] === undefined) {
              mergedAdditionalFields[key] = value;
            }
          }
        });
      }
    });
    merged.additionalFields = mergedAdditionalFields;
    
    // Use primary record for base fields, could enhance this
    // to choose "best" value based on field completeness
    
    return merged;
  };

  // Helper to preview merged record
  const getPreviewMergedRecord = (primary: DirectoryItem, duplicates: DirectoryItem[]): any => {
    const selectedDups = duplicates.filter(d => 
      selectedGroup?.selectedDuplicates.includes(d.id)
    );
    
    return {
      ...primary,
      ...mergeRecords(primary, selectedDups)
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Deduplication Tool</CardTitle>
        <CardDescription>
          Identify and manage duplicate records in your database
        </CardDescription>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={findDuplicates} 
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Find Potential Duplicates'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {duplicateGroups.length > 0 ? (
          <Tabs defaultValue="duplicates">
            <TabsList>
              <TabsTrigger value="duplicates">Duplicate Records</TabsTrigger>
              {processingResults && (
                <TabsTrigger value="results">Processing Results</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="duplicates">
              {duplicateGroups.map((group, groupIndex) => (
                <Card key={group.primaryRecord.id} className="mb-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {group.primaryRecord.title}
                        <Badge className="ml-2">{group.primaryRecord.category}</Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant={group.action === 'merge' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setAction(groupIndex, 'merge')}
                        >
                          Merge
                        </Button>
                        <Button 
                          variant={group.action === 'variant' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setAction(groupIndex, 'variant')}
                        >
                          Variant
                        </Button>
                        <Button 
                          variant={group.action === 'keep' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setAction(groupIndex, 'keep')}
                        >
                          Keep All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Breeder/Source</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow key={`primary-${group.primaryRecord.id}`}>
                          <TableCell>
                            <Badge variant="secondary">Primary</Badge>
                          </TableCell>
                          <TableCell>{group.primaryRecord.title}</TableCell>
                          <TableCell>{group.primaryRecord.category}</TableCell>
                          <TableCell>
                            {group.primaryRecord.additionalFields?.breeder || 
                            group.primaryRecord.additionalFields?.source || '-'}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        
                        {group.duplicates.map(duplicate => (
                          <TableRow key={duplicate.id}>
                            <TableCell>
                              <Checkbox 
                                checked={group.selectedDuplicates.includes(duplicate.id)} 
                                onCheckedChange={() => toggleDuplicateSelection(groupIndex, duplicate.id)}
                              />
                            </TableCell>
                            <TableCell>{duplicate.title}</TableCell>
                            <TableCell>{duplicate.category}</TableCell>
                            <TableCell>
                              {duplicate.additionalFields?.breeder || 
                              duplicate.additionalFields?.source || '-'}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openPreview({
                                  ...group,
                                  primaryRecord: group.primaryRecord,
                                  duplicates: [duplicate],
                                  selectedDuplicates: [duplicate.id],
                                })}
                              >
                                Preview
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      variant="default" 
                      onClick={() => openPreview(group)}
                    >
                      Preview Changes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={processDuplicates} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Process Selected Duplicates'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {processingResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Processed: {processingResults.processed} groups</p>
                      <p>Merged: {processingResults.merged} groups</p>
                      <p>Marked as variants: {processingResults.variants} groups</p>
                      <p>Kept as is: {processingResults.kept} groups</p>
                      
                      {processingResults.errors.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold">Errors:</h4>
                          <ul className="list-disc pl-5 mt-2">
                            {processingResults.errors.map((error, i) => (
                              <li key={i} className="text-destructive">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Click "Find Potential Duplicates" to begin the deduplication process
            </p>
          </div>
        )}
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Changes</DialogTitle>
          </DialogHeader>
          
          {selectedGroup && (
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
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DataDeduplicationTool;
