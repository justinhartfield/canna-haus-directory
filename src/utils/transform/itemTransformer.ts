
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig } from '../mapping/types';
import { generateJsonLd } from '../mappingUtils';

/**
 * Transform a single data row
 */
export function transformDataRow(
  rawItem: Record<string, any>,
  mappingConfig: DataMappingConfig,
  rowIndex: number
): Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> {
  const { columnMappings, defaultValues = {}, transformations = {}, categoryAssignment } = mappingConfig;
  
  // Create a base item with default values
  const baseItem: Record<string, any> = { ...defaultValues, additionalFields: {} };
  
  // Apply column mappings
  for (const [targetField, sourceField] of Object.entries(columnMappings)) {
    // Skip if the mapping is to be ignored
    if (targetField === 'ignore') continue;
    
    // Check if the source field exists in the raw data
    if (!(sourceField in rawItem)) {
      console.warn(`Source field "${sourceField}" not found in data for mapping to "${targetField}"`);
      
      // For additionalFields, we still want to create the field with an empty value
      if (targetField.startsWith('additionalFields.')) {
        const fieldName = targetField.replace('additionalFields.', '');
        if (!baseItem.additionalFields) {
          baseItem.additionalFields = {};
        }
        // Set an empty string for missing additional fields
        baseItem.additionalFields[fieldName] = '';
      }
      continue;
    }
    
    // Handle additional fields mapping
    if (targetField.startsWith('additionalFields.')) {
      const fieldName = targetField.replace('additionalFields.', '');
      if (!baseItem.additionalFields) {
        baseItem.additionalFields = {};
      }
      baseItem.additionalFields[fieldName] = rawItem[sourceField];
    } else {
      baseItem[targetField] = rawItem[sourceField];
    }
  }
  
  // Apply custom transformations
  for (const [field, transformFn] of Object.entries(transformations)) {
    baseItem[field] = transformFn(baseItem[field], rawItem);
  }
  
  // Determine category
  const category = categoryAssignment 
    ? categoryAssignment(rawItem) 
    : (baseItem.category || 'Uncategorized');
  
  // Generate tags if needed
  const tags = Array.isArray(baseItem.tags) 
    ? baseItem.tags 
    : typeof baseItem.tags === 'string' 
      ? baseItem.tags.split(',').map((tag: string) => tag.trim()) 
      : [];

  // Generate JSON-LD
  const schemaType = mappingConfig.schemaType || 'Thing';
  const jsonLd = generateJsonLd(baseItem, schemaType, rawItem);
  
  // Normalize data for consistency
  const normalizedTitle = typeof baseItem.title === 'string' ? baseItem.title.trim() : String(baseItem.title || '');
  const normalizedDesc = typeof baseItem.description === 'string' ? baseItem.description.trim() : String(baseItem.description || '');
  
  // Validate required fields or provide fallbacks
  let finalTitle = normalizedTitle;
  if (!finalTitle) {
    // Generate a title based on row number if missing
    finalTitle = `Item ${rowIndex + 1}`;
  }
  
  let finalDescription = normalizedDesc;
  if (!finalDescription) {
    // Use default description or generate one
    finalDescription = baseItem.defaultDescription || defaultValues.description || `No description provided for item ${rowIndex + 1}`;
  }
  
  // Construct the final directory item
  const directoryItem: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
    title: finalTitle,
    description: finalDescription,
    category,
    subcategory: baseItem.subcategory,
    tags,
    imageUrl: baseItem.imageUrl,
    thumbnailUrl: baseItem.thumbnailUrl,
    jsonLd,
    metaData: baseItem.metaData || {},
    additionalFields: baseItem.additionalFields || {}
  };
  
  return directoryItem;
}
