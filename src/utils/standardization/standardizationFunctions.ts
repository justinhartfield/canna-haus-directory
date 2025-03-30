
import { DirectoryItem } from "@/types/directory";

/**
 * Standardizes category values by normalizing common variations
 */
export function standardizeCategory(category: string): string {
  const categoryMapping: Record<string, string> = {
    // Map variations to standard categories
    'genetics': 'Genetics',
    'genetic': 'Genetics',
    'strains': 'Genetics',
    'strain': 'Genetics',
    'cultivar': 'Genetics',
    'cultivars': 'Genetics',
    'phenotype': 'Genetics',
    'phenotypes': 'Genetics',
    
    'medical': 'Medical',
    'medicinal': 'Medical',
    'medicine': 'Medical',
    'medic': 'Medical',
    'therapeutic': 'Medical',
    'health': 'Medical',
    'treatment': 'Medical',
    
    'compliance': 'Compliance',
    'regulatory': 'Compliance',
    'regulation': 'Compliance',
    'regulations': 'Compliance',
    'legal': 'Compliance',
    
    'cultivation': 'Cultivation',
    'growing': 'Cultivation',
    'grow': 'Cultivation',
    'agriculture': 'Cultivation',
    'gardening': 'Cultivation',
    
    'lab data': 'Lab Data',
    'labdata': 'Lab Data',
    'lab': 'Lab Data',
    'laboratory': 'Lab Data',
    'testing': 'Lab Data',
    'test results': 'Lab Data',
  };
  
  // Normalize category name (lowercase for matching)
  const normalizedCategory = category.trim().toLowerCase();
  
  // Return the mapped standard category or the original if no mapping exists
  return categoryMapping[normalizedCategory] || 
    // Capitalize the first letter of each word if no mapping exists
    normalizedCategory
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

/**
 * Extracts genetics information from description and title
 * and adds it to additionalFields if not already present
 */
export function extractGeneticsInfo(item: DirectoryItem): DirectoryItem {
  if (item.category !== 'Genetics' && item.category !== 'genetics') {
    return item;
  }
  
  const updatedItem = { ...item };
  const additionalFields = updatedItem.additionalFields || {};
  
  // Only extract if we don't already have this information
  if (!additionalFields.geneticLineage) {
    const description = item.description || '';
    const title = item.title || '';
    
    // Look for parent strains in description
    const parentRegex = /(?:cross(?:ed)? (?:of|between)|hybrid of|(?:parent|derived from))\s+([^,.]+)\s+(?:and|&|x)\s+([^,.]+)/i;
    const match = description.match(parentRegex) || title.match(parentRegex);
    
    if (match && match.length >= 3) {
      additionalFields.geneticLineage = {
        parent1: match[1].trim(),
        parent2: match[2].trim()
      };
    }
    
    // Extract THC/CBD content if mentioned
    const thcMatch = description.match(/(\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?%?\s*THC)/i);
    if (thcMatch) {
      additionalFields.thcContent = thcMatch[1].trim();
    }
    
    const cbdMatch = description.match(/(\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?%?\s*CBD)/i);
    if (cbdMatch) {
      additionalFields.cbdContent = cbdMatch[1].trim();
    }
    
    updatedItem.additionalFields = additionalFields;
  }
  
  return updatedItem;
}

/**
 * Standardizes additionalFields to ensure consistent format
 */
export function standardizeAdditionalFields(item: DirectoryItem): DirectoryItem {
  const updatedItem = { ...item };
  let additionalFields = updatedItem.additionalFields || {};
  
  // Standardize common field names
  const fieldMappings: Record<string, string> = {
    'strain_type': 'strainType',
    'strain-type': 'strainType',
    'type': 'strainType',
    
    'thc': 'thcContent',
    'thc_content': 'thcContent',
    'thc-content': 'thcContent',
    'thc_percentage': 'thcContent',
    'thc-percentage': 'thcContent',
    
    'cbd': 'cbdContent',
    'cbd_content': 'cbdContent',
    'cbd-content': 'cbdContent',
    'cbd_percentage': 'cbdContent',
    'cbd-percentage': 'cbdContent',
    
    'terpenes': 'dominantTerpenes',
    'dominant_terpenes': 'dominantTerpenes',
    'dominant-terpenes': 'dominantTerpenes',
    'main_terpenes': 'dominantTerpenes',
    
    'effects': 'effects',
    'effect': 'effects',
    
    'flavor': 'flavorProfile',
    'flavors': 'flavorProfile',
    'flavor_profile': 'flavorProfile',
    'flavor-profile': 'flavorProfile',
    'taste': 'flavorProfile',
    
    'medical_uses': 'medicalUses',
    'medical-uses': 'medicalUses',
    'medical_applications': 'medicalUses',
    'medical-applications': 'medicalUses',
    'conditions': 'medicalUses',
    
    'grows': 'cultivationDifficulty',
    'growing': 'cultivationDifficulty',
    'cultivation': 'cultivationDifficulty',
    'grow_difficulty': 'cultivationDifficulty',
    'grow-difficulty': 'cultivationDifficulty',
    'difficulty': 'cultivationDifficulty',
    
    'breeder': 'breeder',
    'breed_by': 'breeder',
    'bred_by': 'breeder',
    'source': 'breeder',
    'producer': 'breeder',
    'produced_by': 'breeder',
  };
  
  // Create a new additionalFields object with standardized keys
  const standardizedFields: Record<string, any> = {};
  
  // Process each field and standardize the key
  for (const [key, value] of Object.entries(additionalFields)) {
    const normalizedKey = key.trim().toLowerCase();
    const standardKey = fieldMappings[normalizedKey] || key;
    
    // Process array fields that might be strings
    if (standardKey === 'effects' || standardKey === 'dominantTerpenes' || 
        standardKey === 'flavorProfile' || standardKey === 'medicalUses') {
      if (typeof value === 'string') {
        // Convert comma or semicolon separated strings to arrays
        standardizedFields[standardKey] = value
          .split(/[,;]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        standardizedFields[standardKey] = value;
      }
    } else {
      standardizedFields[standardKey] = value;
    }
  }
  
  updatedItem.additionalFields = standardizedFields;
  return updatedItem;
}

/**
 * Standardizes tags to ensure consistent format
 */
export function standardizeTags(item: DirectoryItem): DirectoryItem {
  const updatedItem = { ...item };
  
  // Ensure tags is an array
  if (!updatedItem.tags) {
    updatedItem.tags = [];
  } else if (typeof updatedItem.tags === 'string') {
    // Convert comma or semicolon separated string to array
    updatedItem.tags = (updatedItem.tags as unknown as string)
      .split(/[,;]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
  
  // Normalize tags (lowercase, remove duplicates)
  const normalizedTags = new Set(
    (updatedItem.tags as string[]).map(tag => tag.toLowerCase().trim())
  );
  
  updatedItem.tags = Array.from(normalizedTags);
  
  return updatedItem;
}

/**
 * Improves JSON-LD structure based on category
 */
export function enhanceJsonLd(item: DirectoryItem): DirectoryItem {
  const updatedItem = { ...item };
  const category = item.category || '';
  let jsonLd = updatedItem.jsonLd || {};
  
  // Ensure we have the basic JSON-LD structure
  if (!jsonLd['@context']) {
    jsonLd['@context'] = 'https://schema.org';
  }
  
  // Set appropriate @type based on category if not already set
  if (!jsonLd['@type']) {
    const typeMapping: Record<string, string> = {
      'Genetics': 'Product',
      'Medical': 'MedicalStudy',
      'Compliance': 'LegalDocument',
      'Cultivation': 'HowTo',
      'Lab Data': 'ScholarlyArticle'
    };
    
    jsonLd['@type'] = typeMapping[category] || 'Thing';
  }
  
  // Ensure name and description are set
  if (!jsonLd.name && item.title) {
    jsonLd.name = item.title;
  }
  
  if (!jsonLd.description && item.description) {
    jsonLd.description = item.description;
  }
  
  // Add category to JSON-LD if not present
  if (!jsonLd.category && category) {
    jsonLd.category = category;
  }
  
  // Enhance with additional fields appropriate for the type
  const additionalFields = item.additionalFields || {};
  
  if (jsonLd['@type'] === 'Product' && category === 'Genetics') {
    // Add genetics-specific properties if available
    if (additionalFields.geneticLineage && !jsonLd.geneticLineage) {
      jsonLd.geneticLineage = additionalFields.geneticLineage;
    }
    
    if (additionalFields.thcContent && !jsonLd.thcContent) {
      jsonLd.thcContent = additionalFields.thcContent;
    }
    
    if (additionalFields.cbdContent && !jsonLd.cbdContent) {
      jsonLd.cbdContent = additionalFields.cbdContent;
    }
    
    if (additionalFields.dominantTerpenes && !jsonLd.dominantTerpenes) {
      jsonLd.dominantTerpenes = additionalFields.dominantTerpenes;
    }
    
    if (additionalFields.effects && !jsonLd.effects) {
      jsonLd.effects = additionalFields.effects;
    }
    
    if (additionalFields.flavorProfile && !jsonLd.flavorProfile) {
      jsonLd.flavorProfile = additionalFields.flavorProfile;
    }
    
    if (additionalFields.medicalUses && !jsonLd.medicalUses) {
      jsonLd.medicalUses = additionalFields.medicalUses;
    }
  }
  
  updatedItem.jsonLd = jsonLd;
  return updatedItem;
}

/**
 * Apply all standardization functions to an item
 */
export function standardizeDirectoryItem(item: DirectoryItem): DirectoryItem {
  let standardizedItem = { ...item };
  
  // Standardize the category
  standardizedItem.category = standardizeCategory(standardizedItem.category);
  
  // Apply all standardization functions in sequence
  standardizedItem = standardizeAdditionalFields(standardizedItem);
  standardizedItem = extractGeneticsInfo(standardizedItem);
  standardizedItem = standardizeTags(standardizedItem);
  standardizedItem = enhanceJsonLd(standardizedItem);
  
  return standardizedItem;
}
