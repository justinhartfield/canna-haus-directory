import { DirectoryItem } from '@/types/directory';

/**
 * Identify exact duplicate records based on title, category, and other criteria
 * @returns Array of duplicate record IDs that can be safely removed
 */
export const identifyExactDuplicates = (items: DirectoryItem[]): string[] => {
  const seenKeys = new Map<string, DirectoryItem>();
  const duplicateIds: string[] = [];
  
  for (const item of items) {
    // Create a composite key using the most important fields that define uniqueness
    // We use lowercase to make it case-insensitive
    const key = [
      item.title.toLowerCase(), 
      item.category.toLowerCase(),
      item.subcategory?.toLowerCase() || '',
      // Also consider breeder/source if available in additionalFields
      item.additionalFields?.breeder?.toLowerCase() || 
      item.additionalFields?.source?.toLowerCase() || ''
    ].join('|');
    
    if (seenKeys.has(key)) {
      // If we've seen this key before, this is a duplicate
      // We keep the older record (lower createdAt timestamp)
      const existingItem = seenKeys.get(key)!;
      
      // Parse dates for comparison (earlier created date is kept)
      const existingDate = new Date(existingItem.createdAt).getTime();
      const currentDate = new Date(item.createdAt).getTime();
      
      if (currentDate > existingDate) {
        // This is a newer duplicate, mark it for removal
        duplicateIds.push(item.id);
      } else {
        // The existing one is newer, mark it for removal and keep this one
        duplicateIds.push(existingItem.id);
        seenKeys.set(key, item);
      }
    } else {
      // This is the first time we've seen this key
      seenKeys.set(key, item);
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
