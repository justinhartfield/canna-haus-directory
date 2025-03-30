
import { useState } from 'react';
import { DirectoryItem } from '@/types/directory';
import { DuplicateGroup, ProcessingResults } from '@/types/deduplication';
import { getDirectoryItems } from '@/api/services/directoryItem/crudOperations';
import { findPotentialDuplicates } from '@/utils/deduplication/duplicateDetection';
import { getPreviewMergedRecord } from '@/utils/deduplication/mergeUtils';
import { processDuplicates } from '@/services/deduplication/processingService';
import { toast } from 'sonner';

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
      console.log("Retrieved items:", items.slice(0, 3)); // Log a few items to check their structure
      const duplicates = findPotentialDuplicates(items);
      
      const groups = duplicates.map(group => ({
        primaryRecord: group.primary,
        duplicates: group.duplicates,
        selectedDuplicates: group.duplicates.map(d => d.id),
        action: 'merge' as const
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

  const setAction = (groupIndex: number, action: 'merge' | 'variant' | 'keep') => {
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

  const processSelectedDuplicates = async () => {
    setIsLoading(true);
    try {
      const results = await processDuplicates(duplicateGroups);
      setProcessingResults(results);
    } catch (error) {
      console.error('Error processing duplicates:', error);
      toast.error('An error occurred during processing');
    } finally {
      setIsLoading(false);
    }
  };

  const getMergedRecordPreview = (primary: DirectoryItem, duplicates: DirectoryItem[]): any => {
    if (!selectedGroup) return primary;
    
    return getPreviewMergedRecord(
      primary, 
      duplicates, 
      selectedGroup.selectedDuplicates
    );
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
    processDuplicates: processSelectedDuplicates,
    getPreviewMergedRecord: getMergedRecordPreview
  };
};
