
import { DirectoryItem } from "@/types/directory";

export interface FieldStatistics {
  fieldName: string;
  count: number;
  uniqueValues: number;
  topValues: Array<{ value: string; count: number }>;
  isEmpty: number;
}

export interface CategoryAnalysis {
  category: string;
  count: number;
  commonAdditionalFields: string[];
}

export interface DataAnalysisResult {
  totalItems: number;
  categories: CategoryAnalysis[];
  fieldStatistics: FieldStatistics[];
  potentialIssues: Array<{ type: string; description: string; count: number }>;
  additionalFieldsUsage: Record<string, number>;
}

/**
 * Analyze directory items to identify patterns, inconsistencies, and potential issues
 */
export function analyzeDirectoryData(items: DirectoryItem[]): DataAnalysisResult {
  const result: DataAnalysisResult = {
    totalItems: items.length,
    categories: [],
    fieldStatistics: [],
    potentialIssues: [],
    additionalFieldsUsage: {}
  };
  
  // Get unique categories and their counts
  const categoryMap = new Map<string, DirectoryItem[]>();
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(item);
  });
  
  // Process each category
  categoryMap.forEach((categoryItems, category) => {
    // Count items in this category
    const count = categoryItems.length;
    
    // Find common additional fields for this category
    const additionalFieldsCount: Record<string, number> = {};
    categoryItems.forEach(item => {
      if (item.additionalFields) {
        Object.keys(item.additionalFields).forEach(field => {
          additionalFieldsCount[field] = (additionalFieldsCount[field] || 0) + 1;
          // Also update the global additionalFields usage
          result.additionalFieldsUsage[field] = (result.additionalFieldsUsage[field] || 0) + 1;
        });
      }
    });
    
    // Get the most common additional fields (present in at least 30% of items)
    const commonThreshold = Math.max(2, Math.floor(count * 0.3));
    const commonAdditionalFields = Object.entries(additionalFieldsCount)
      .filter(([_, fieldCount]) => fieldCount >= commonThreshold)
      .map(([field]) => field)
      .sort();
    
    result.categories.push({
      category,
      count,
      commonAdditionalFields
    });
  });
  
  // Sort categories by count (descending)
  result.categories.sort((a, b) => b.count - a.count);
  
  // Check for potential issues
  const missingTitleCount = items.filter(item => !item.title || item.title.trim() === '').length;
  if (missingTitleCount > 0) {
    result.potentialIssues.push({
      type: 'missing_title',
      description: 'Items missing a title',
      count: missingTitleCount
    });
  }
  
  const missingDescriptionCount = items.filter(item => !item.description || item.description.trim() === '').length;
  if (missingDescriptionCount > 0) {
    result.potentialIssues.push({
      type: 'missing_description',
      description: 'Items missing a description',
      count: missingDescriptionCount
    });
  }
  
  const missingCategoryCount = items.filter(item => !item.category || item.category.trim() === '').length;
  if (missingCategoryCount > 0) {
    result.potentialIssues.push({
      type: 'missing_category',
      description: 'Items missing a category',
      count: missingCategoryCount
    });
  }
  
  const emptyJsonLdCount = items.filter(item => !item.jsonLd || Object.keys(item.jsonLd).length === 0).length;
  if (emptyJsonLdCount > 0) {
    result.potentialIssues.push({
      type: 'empty_jsonld',
      description: 'Items with empty JSON-LD',
      count: emptyJsonLdCount
    });
  }
  
  const duplicateTitlesMap = new Map<string, DirectoryItem[]>();
  items.forEach(item => {
    if (item.title) {
      const normalizedTitle = item.title.toLowerCase().trim();
      if (!duplicateTitlesMap.has(normalizedTitle)) {
        duplicateTitlesMap.set(normalizedTitle, []);
      }
      duplicateTitlesMap.get(normalizedTitle)!.push(item);
    }
  });
  
  const duplicateTitlesCount = Array.from(duplicateTitlesMap.values())
    .filter(dupes => dupes.length > 1)
    .reduce((total, dupes) => total + dupes.length, 0);
  
  if (duplicateTitlesCount > 0) {
    result.potentialIssues.push({
      type: 'duplicate_titles',
      description: 'Items with duplicate titles',
      count: duplicateTitlesCount
    });
  }
  
  return result;
}

/**
 * Identify potential duplicate items based on title similarity and category
 */
export function findPotentialDuplicates(
  items: DirectoryItem[],
  threshold: number = 0.9
): Array<{ group: DirectoryItem[]; similarity: number }> {
  const results: Array<{ group: DirectoryItem[]; similarity: number }> = [];
  const processedIds = new Set<string>();
  
  // Group items by category to reduce comparison scope
  const categoryGroups = new Map<string, DirectoryItem[]>();
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categoryGroups.has(category)) {
      categoryGroups.set(category, []);
    }
    categoryGroups.get(category)!.push(item);
  });
  
  // For each category, find potential duplicates
  categoryGroups.forEach(categoryItems => {
    for (let i = 0; i < categoryItems.length; i++) {
      const item1 = categoryItems[i];
      
      // Skip if already processed in a duplicate group
      if (processedIds.has(item1.id)) continue;
      
      const duplicateGroup: DirectoryItem[] = [item1];
      
      for (let j = i + 1; j < categoryItems.length; j++) {
        const item2 = categoryItems[j];
        
        // Skip if already processed
        if (processedIds.has(item2.id)) continue;
        
        // Calculate similarity based on title and other fields
        const similarity = calculateItemSimilarity(item1, item2);
        
        if (similarity >= threshold) {
          duplicateGroup.push(item2);
          processedIds.add(item2.id);
        }
      }
      
      // If we found duplicates, add to results
      if (duplicateGroup.length > 1) {
        processedIds.add(item1.id);
        
        // Calculate average similarity for the group
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let x = 0; x < duplicateGroup.length; x++) {
          for (let y = x + 1; y < duplicateGroup.length; y++) {
            totalSimilarity += calculateItemSimilarity(duplicateGroup[x], duplicateGroup[y]);
            comparisons++;
          }
        }
        
        const avgSimilarity = comparisons > 0 ? totalSimilarity / comparisons : 0;
        
        results.push({
          group: duplicateGroup,
          similarity: avgSimilarity
        });
      }
    }
  });
  
  // Sort by similarity (highest first)
  results.sort((a, b) => b.similarity - a.similarity);
  
  return results;
}

/**
 * Calculate similarity between two directory items
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function calculateItemSimilarity(item1: DirectoryItem, item2: DirectoryItem): number {
  // Equal weights for different components
  const weights = {
    title: 0.5,
    description: 0.2,
    additionalFields: 0.3
  };
  
  let totalSimilarity = 0;
  
  // Title similarity
  const title1 = (item1.title || '').toLowerCase().trim();
  const title2 = (item2.title || '').toLowerCase().trim();
  
  if (title1 === title2 && title1 !== '') {
    totalSimilarity += weights.title;
  } else if (title1 !== '' && title2 !== '') {
    const titleSimilarity = calculateStringSimilarity(title1, title2);
    totalSimilarity += titleSimilarity * weights.title;
  }
  
  // Description similarity
  const desc1 = (item1.description || '').toLowerCase().trim();
  const desc2 = (item2.description || '').toLowerCase().trim();
  
  if (desc1 !== '' && desc2 !== '') {
    const descSimilarity = calculateStringSimilarity(desc1, desc2);
    totalSimilarity += descSimilarity * weights.description;
  }
  
  // Additional fields similarity
  const additionalFields1 = item1.additionalFields || {};
  const additionalFields2 = item2.additionalFields || {};
  
  const fields1 = Object.keys(additionalFields1);
  const fields2 = Object.keys(additionalFields2);
  
  if (fields1.length > 0 && fields2.length > 0) {
    // Check for common fields
    const commonFields = fields1.filter(field => fields2.includes(field));
    const unionFields = Array.from(new Set([...fields1, ...fields2]));
    
    const fieldSimilarity = commonFields.length / unionFields.length;
    totalSimilarity += fieldSimilarity * weights.additionalFields;
  }
  
  return totalSimilarity;
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;
  
  // Trim to first 100 chars for performance on long texts
  const s1 = str1.slice(0, 100);
  const s2 = str2.slice(0, 100);
  
  const longerLength = Math.max(s1.length, s2.length);
  if (longerLength === 0) return 1;
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(s1, s2);
  return (longerLength - distance) / longerLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(null));
  
  // Fill the first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill the rest of the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
}
