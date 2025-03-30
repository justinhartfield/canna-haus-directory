
import { DataMappingConfig } from './types';

/**
 * Create a mapping configuration based on column detection
 */
export function createMappingConfigFromSample(
  sampleData: Record<string, any>[],
  category: string
): DataMappingConfig {
  if (!sampleData || sampleData.length === 0) {
    throw new Error('No sample data provided for configuration');
  }
  
  const firstRow = sampleData[0];
  const columns = Object.keys(firstRow);
  
  // Create a basic mapping configuration
  const mappingConfig: DataMappingConfig = {
    columnMappings: {},
    defaultValues: {
      category
    },
    schemaType: 'Thing'
  };
  
  // Try to detect title, description, and other fields based on column names
  for (const column of columns) {
    const lowerColumn = column.toLowerCase();
    
    if (lowerColumn.includes('title') || lowerColumn.includes('name')) {
      mappingConfig.columnMappings.title = column;
    } else if (lowerColumn.includes('desc')) {
      mappingConfig.columnMappings.description = column;
    } else if (lowerColumn.includes('image') || lowerColumn.includes('photo') || lowerColumn.includes('picture')) {
      mappingConfig.columnMappings.imageUrl = column;
    } else if (lowerColumn.includes('thumb') || lowerColumn.includes('thumbnail')) {
      mappingConfig.columnMappings.thumbnailUrl = column;
    } else if (lowerColumn.includes('subcat') || lowerColumn.includes('sub-category')) {
      mappingConfig.columnMappings.subcategory = column;
    } else if (lowerColumn.includes('tag')) {
      mappingConfig.columnMappings.tags = column;
    }
  }
  
  // Ensure required fields are mapped, if not, make educated guesses
  if (!mappingConfig.columnMappings.title && columns.length > 0) {
    // Use the first column as title if nothing better is found
    mappingConfig.columnMappings.title = columns[0];
  }
  
  if (!mappingConfig.columnMappings.description && columns.length > 1) {
    // Use the second column as description if nothing better is found
    mappingConfig.columnMappings.description = columns[1];
  }
  
  return mappingConfig;
}

/**
 * Generate JSON-LD structure from data
 */
export function generateJsonLd(
  item: Record<string, any>,
  schemaType: string,
  rawData: Record<string, any>
): Record<string, any> {
  // Base JSON-LD structure
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": item.title,
    "description": item.description
  };
  
  // Add image if available
  if (item.imageUrl) {
    jsonLd.image = item.imageUrl;
  }
  
  // Add all raw data fields that aren't already mapped
  // This ensures we maintain all the original data
  for (const [key, value] of Object.entries(rawData)) {
    if (value !== undefined && value !== null && !jsonLd[key]) {
      const formattedKey = formatJsonLdKey(key);
      jsonLd[formattedKey] = value;
    }
  }
  
  return jsonLd;
}

/**
 * Format a key to be used in JSON-LD
 */
export function formatJsonLdKey(key: string): string {
  // Replace spaces and special characters with camelCase
  return key
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part, index) => 
      index === 0 
        ? part.toLowerCase() 
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('');
}
