
import { DirectoryItem } from "@/types/directory";

interface DuplicateGroup {
  primary: DirectoryItem;
  duplicates: DirectoryItem[];
  similarity: number;
}

/**
 * Find potential duplicate records in the directory data
 * @param items Directory items to check for duplicates
 * @returns Array of duplicate groups
 */
export function findPotentialDuplicates(items: DirectoryItem[]): DuplicateGroup[] {
  const duplicateGroups: DuplicateGroup[] = [];
  const processedIds = new Set<string>();

  // Sort items by creation date (descending) so newer items become primary
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    
    // Skip if this item has already been marked as a duplicate
    if (processedIds.has(item.id)) continue;
    
    const duplicates: DirectoryItem[] = [];
    let highestSimilarity = 0;
    
    for (let j = 0; j < sortedItems.length; j++) {
      if (i === j) continue;
      
      const otherItem = sortedItems[j];
      
      // Skip if this item has already been marked as a duplicate
      if (processedIds.has(otherItem.id)) continue;
      
      const similarity = calculateSimilarity(item, otherItem);
      
      // If items are similar enough, add to duplicates
      if (similarity > 0.7) {  // 70% similarity threshold
        duplicates.push(otherItem);
        processedIds.add(otherItem.id);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
        }
      }
    }
    
    if (duplicates.length > 0) {
      duplicateGroups.push({
        primary: item,
        duplicates,
        similarity: highestSimilarity
      });
      processedIds.add(item.id);
    }
  }
  
  return duplicateGroups;
}

/**
 * Calculate similarity between two directory items
 * @param item1 First directory item
 * @param item2 Second directory item
 * @returns Similarity score (0-1)
 */
function calculateSimilarity(item1: DirectoryItem, item2: DirectoryItem): number {
  let points = 0;
  let totalPoints = 0;
  
  // If categories are different, they're likely not duplicates
  if (item1.category !== item2.category) {
    return 0;
  }
  
  // Title similarity (weighted heavily)
  totalPoints += 3;
  const title1 = item1.title.toLowerCase();
  const title2 = item2.title.toLowerCase();
  
  if (title1 === title2) {
    points += 3;
  } else {
    // Check for partial title match
    const wordSet1 = new Set(title1.split(/\s+/).filter(w => w.length > 2));
    const wordSet2 = new Set(title2.split(/\s+/).filter(w => w.length > 2));
    
    let matchedWords = 0;
    for (const word of wordSet1) {
      if (wordSet2.has(word)) {
        matchedWords++;
      }
    }
    
    const similarityRatio = Math.min(
      wordSet1.size > 0 ? matchedWords / wordSet1.size : 0,
      wordSet2.size > 0 ? matchedWords / wordSet2.size : 0
    );
    
    points += 3 * similarityRatio;
  }
  
  // Check breeder/source (if available)
  const breeder1 = getBreederSource(item1);
  const breeder2 = getBreederSource(item2);
  
  if (breeder1 && breeder2) {
    totalPoints += 2;
    if (breeder1.toLowerCase() === breeder2.toLowerCase()) {
      points += 2;
    }
  }
  
  // Check subcategory (if available)
  if (item1.subcategory && item2.subcategory) {
    totalPoints += 1;
    if (item1.subcategory === item2.subcategory) {
      points += 1;
    }
  }
  
  // Check tags (if available)
  if (item1.tags && item1.tags.length > 0 && item2.tags && item2.tags.length > 0) {
    totalPoints += 1;
    
    const tagSet1 = new Set(item1.tags.map(t => t.toLowerCase()));
    const tagSet2 = new Set(item2.tags.map(t => t.toLowerCase()));
    
    let matchedTags = 0;
    for (const tag of tagSet1) {
      if (tagSet2.has(tag)) {
        matchedTags++;
      }
    }
    
    const tagSimilarityRatio = Math.min(
      tagSet1.size > 0 ? matchedTags / tagSet1.size : 0,
      tagSet2.size > 0 ? matchedTags / tagSet2.size : 0
    );
    
    points += tagSimilarityRatio;
  }
  
  // Return normalized similarity score
  return totalPoints > 0 ? points / totalPoints : 0;
}

/**
 * Get the breeder/source from additionalFields
 */
function getBreederSource(item: DirectoryItem): string | null {
  if (!item.additionalFields) return null;
  
  return item.additionalFields.breeder || 
         item.additionalFields.source || 
         item.additionalFields.breedBy || 
         item.additionalFields.producedBy || 
         null;
}
