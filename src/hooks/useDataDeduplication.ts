import { useState } from 'react';
import { DirectoryItem } from '@/types/directory';
import { getDirectoryItems } from '@/api/services/directoryItem/crudOperations';
import { updateDirectoryItem } from '@/api/services/directoryItem/crudOperations';
import { findPotentialDuplicates } from '@/utils/deduplication/duplicateDetection';
import { toast } from 'sonner';

type DuplicateAction = 'merge' | 'variant' | 'keep';

export interface DuplicateGroup {
  primaryRecord: DirectoryItem;
  duplicates: DirectoryItem[];
  selectedDuplicates: string[];
  action: DuplicateAction;
}

interface ProcessingResults {
  processed: number;
  merged: number;
  variants: number;
  kept: number;
  errors: string[];
}

export const useDataDeduplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [processingResults, setProcessingResults] = useState<ProcessingResults | null>(null);

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

  const openPreview = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setIsPreviewOpen(true);
  };

  const mergeRecords = (primary: DirectoryItem, duplicates: DirectoryItem[]): Partial<DirectoryItem> => {
    const merged: Partial<DirectoryItem> = {};
    
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
    
    const mergedAdditionalData: Record<string, any> = {...(primary.additionalFields || {})};
    duplicates.forEach((duplicate, index) => {
      if (duplicate.additionalFields) {
        Object.entries(duplicate.additionalFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (mergedAdditionalData[key] !== undefined && 
                mergedAdditionalData[key] !== value) {
              mergedAdditionalData[`alt_${key}_${index + 1}`] = value;
            } else if (mergedAdditionalData[key] === undefined) {
              mergedAdditionalData[key] = value;
            }
          }
        });
      }
    });
    
    merged.additionalFields = mergedAdditionalData;
    
    return merged;
  };

  const getPreviewMergedRecord = (primary: DirectoryItem, duplicates: DirectoryItem[]): any => {
    const selectedDups = duplicates.filter(d => 
      selectedGroup?.selectedDuplicates.includes(d.id)
    );
    
    return {
      ...primary,
      ...mergeRecords(primary, selectedDups)
    };
  };

  const processDuplicates = async () => {
    setIsLoading(true);
    const results: ProcessingResults = {
      processed: 0,
      merged: 0,
      variants: 0,
      kept: 0,
      errors: []
    };

    try {
      for (const group of duplicateGroups) {
        const { primaryRecord, duplicates, selectedDuplicates, action } = group;
        
        const selectedDuplicateRecords = duplicates.filter(d => 
          selectedDuplicates.includes(d.id)
        );
        
        if (selectedDuplicateRecords.length === 0) continue;
        
        results.processed++;
        
        try {
          if (action === 'merge') {
            const mergedData = mergeRecords(primaryRecord, selectedDuplicateRecords);
            await updateDirectoryItem(primaryRecord.id, mergedData);
            results.merged++;
          } else if (action === 'variant') {
            for (const duplicate of selectedDuplicateRecords) {
              const updatedFields = {
                additionalFields: {
                  ...(duplicate.additionalFields || {}),
                  isVariantOf: primaryRecord.id
                }
              };
              await updateDirectoryItem(duplicate.id, updatedFields);
            }
            results.variants++;
          } else {
            results.kept++;
          }
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : (typeof err === 'object' && err !== null && 'message' in err)
              ? String((err as any).message)
              : 'Unknown error';
          
          console.error(`Error processing group with primary ${primaryRecord.id}:`, err);
          results.errors.push(`Failed to process ${primaryRecord.title}: ${errorMessage}`);
        }
      }
      
      setProcessingResults(results);
      
      if (results.errors.length === 0) {
        toast.success(`Successfully processed ${results.processed} duplicate groups`);
      } else {
        toast.warning(`Processed with errors: ${results.errors.length} issues found`);
      }
    } catch (error) {
      console.error('Error processing duplicates:', error);
      toast.error('Failed to process duplicates');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    duplicateGroups,
    isPreviewOpen,
    selectedGroup,
    processingResults,
    findDuplicates,
    toggleDuplicateSelection,
    setAction,
    openPreview,
    setIsPreviewOpen,
    processDuplicates,
    getPreviewMergedRecord
  };
};
