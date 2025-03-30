
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
      
      // Only consider high similarity matches (exact title matches will have high similarity)
      if (similarity > 0.85) {  // Increased threshold from 0.7 to 0.85
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
 * Prioritizes exact title matches
 * @param item1 First directory item
 * @param item2 Second directory item
 * @returns Similarity score (0-1)
 */
function calculateSimilarity(item1: DirectoryItem, item2: DirectoryItem): number {
  let points = 0;
  let totalPoints = 0;
  
  // If categories are different, they're not duplicates
  if (item1.category !== item2.category) {
    return 0;
  }
  
  // Title similarity (weighted heavily)
  totalPoints += 5; // Increased weight from 3 to 5
  const title1 = item1.title.toLowerCase().trim();
  const title2 = item2.title.toLowerCase().trim();
  
  // Prioritize exact matches
  if (title1 === title2) {
    points += 5; // Full points for exact match
  } else {
    // Significantly reduce points for partial matches
    // Only give minimal points if titles are very similar
    const titleSimilarity = calculateTextSimilarity(title1, title2);
    points += titleSimilarity > 0.9 ? 1 : 0; // Only give points for very similar titles
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
  
  // Return normalized similarity score
  return totalPoints > 0 ? points / totalPoints : 0;
}

/**
 * Calculate similarity between two text strings
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity ratio (0-1)
 */
function calculateTextSimilarity(str1: string, str2: string): number {
  // For exact matches
  if (str1 === str2) return 1;
  
  // For empty strings
  if (!str1.length || !str2.length) return 0;
  
  // Convert to sets of words for longer strings
  if (str1.length > 10 && str2.length > 10) {
    const wordSet1 = new Set(str1.split(/\s+/).filter(w => w.length > 2));
    const wordSet2 = new Set(str2.split(/\s+/).filter(w => w.length > 2));
    
    if (wordSet1.size === 0 || wordSet2.size === 0) return 0;
    
    let matchedWords = 0;
    for (const word of wordSet1) {
      if (wordSet2.has(word)) {
        matchedWords++;
      }
    }
    
    return Math.min(
      wordSet1.size > 0 ? matchedWords / wordSet1.size : 0,
      wordSet2.size > 0 ? matchedWords / wordSet2.size : 0
    );
  }
  
  // For shorter strings, use character-level comparison (less relevant for our case)
  return 0;
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
