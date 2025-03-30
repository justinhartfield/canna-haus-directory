import { DirectoryItem } from '@/types/directory';

/**
 * Identify exact duplicate records based on title, category, and other criteria
 * @returns Array of duplicate record IDs that can be safely removed
 */
export const identifyExactDuplicates = (items: DirectoryItem[]): string[] => {
  // Map to track items by title and category
  const itemsByTitleCategory = new Map<string, DirectoryItem[]>();
  const duplicateIds: string[] = [];
  
  // Group items by title and category
  for (const item of items) {
    // Create a composite key based on title and category (case insensitive)
    const key = `${item.title.toLowerCase()}|${item.category.toLowerCase()}`;
    
    if (!itemsByTitleCategory.has(key)) {
      itemsByTitleCategory.set(key, []);
    }
    
    itemsByTitleCategory.get(key)!.push(item);
  }
  
  // Find groups with multiple items (these are potential duplicates)
  for (const [key, group] of itemsByTitleCategory.entries()) {
    if (group.length > 1) {
      console.log(`Found ${group.length} items with key: ${key}`);
      
      // Sort by creation date, oldest first (we generally want to keep the oldest record)
      group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      // Keep the first one (oldest), mark the rest as duplicates
      for (let i = 1; i < group.length; i++) {
        duplicateIds.push(group[i].id);
      }
    }
  }
  
  return duplicateIds;
};

/**
 * Group duplicate records with the same title and category
 * This is for review, not for automatic deletion
 */
export const groupDuplicatesForReview = (items: DirectoryItem[]): Array<{
  primaryRecord: DirectoryItem;
  duplicates: DirectoryItem[];
}> => {
  const groups = new Map<string, DirectoryItem[]>();
  
  // Group items by title and category
  for (const item of items) {
    const key = `${item.title.toLowerCase()}|${item.category.toLowerCase()}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  
  // Filter to only groups with duplicates and format them
  return Array.from(groups.entries())
    .filter(([_, items]) => items.length > 1)
    .map(([_, items]) => {
      // Sort by creation date, oldest first
      const sorted = [...items].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      return {
        primaryRecord: sorted[0], // Keep the oldest record as primary
        duplicates: sorted.slice(1) // The rest are duplicates
      };
    });
};
