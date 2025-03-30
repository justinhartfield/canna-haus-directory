
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
    
    // For additionalFields mappings, make sure we create the field even if the source is missing
    if (targetField.startsWith('additionalFields.')) {
      const fieldName = targetField.replace('additionalFields.', '');
      if (!baseItem.additionalFields) {
        baseItem.additionalFields = {};
      }
      
      // Set the value from the source field or empty string if missing
      baseItem.additionalFields[fieldName] = sourceField in rawItem ? 
        rawItem[sourceField] : 
        '';
      
      // Log missing fields but continue processing
      if (!(sourceField in rawItem)) {
        console.log(`Creating empty additionalField ${fieldName} for missing source field "${sourceField}"`);
      }
    } 
    // Regular field mapping
    else if (sourceField in rawItem) {
      baseItem[targetField] = rawItem[sourceField];
    }
    // Missing required fields should use defaults
    else if (['title', 'description'].includes(targetField)) {
      console.log(`Missing required field "${targetField}", using default value`);
      // Default values will be applied below
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

  // Ensure additionalFields is always an object, never null
  if (!baseItem.additionalFields) {
    baseItem.additionalFields = {};
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
    additionalFields: baseItem.additionalFields
  };
  
  return directoryItem;
}
