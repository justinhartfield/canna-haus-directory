
import { DirectoryItem } from '@/types/directory';

/**
 * Merges data from duplicate records into the primary record
 */
export const mergeRecords = (primary: DirectoryItem, duplicates: DirectoryItem[]): Partial<DirectoryItem> => {
  const merged: Partial<DirectoryItem> = {};
  
  // Merge tags from all records
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
  
  // Merge additional fields with conflict resolution
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

/**
 * Generate a preview of what the merged record would look like
 */
export const getPreviewMergedRecord = (
  primary: DirectoryItem, 
  duplicates: DirectoryItem[],
  selectedDuplicateIds: string[]
): DirectoryItem => {
  const selectedDups = duplicates.filter(d => 
    selectedDuplicateIds.includes(d.id)
  );
  
  return {
    ...primary,
    ...mergeRecords(primary, selectedDups)
  };
};
