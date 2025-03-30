
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig } from '../mappingUtils';
import { validateRequiredField } from './validation';
import { normalizeString } from './normalizers';
import { generateJsonLd } from '../mappingUtils';

/**
 * Processing results
 */
export interface ProcessingResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  processedFiles?: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: Record<string, any>;
  }>;
  items: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>[];
  missingColumns?: string[]; // Track missing columns
}

/**
 * Transform raw data to structured directory items
 */
export function transformData(
  rawData: Record<string, any>[],
  mappingConfig: DataMappingConfig
): ProcessingResult {
  const result: ProcessingResult = {
    success: true,
    totalRows: rawData.length,
    processedRows: 0,
    processedFiles: 1,
    errorCount: 0,
    errors: [],
    items: [],
    missingColumns: [] // Initialize missing columns array
  };
  
  if (!rawData.length) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No data found in file'
    });
    return result;
  }
  
  // Validate mapping config
  if (!mappingConfig.columnMappings.title) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No column mapped to "title" field'
    });
  }
  
  if (!mappingConfig.columnMappings.description) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No column mapped to "description" field'
    });
  }
  
  if (!result.success) {
    return result;
  }
  
  // Add default values if not present in the config
  if (!mappingConfig.defaultValues) {
    mappingConfig.defaultValues = {};
  }
  
  // Add fallback value for description to handle missing descriptions
  if (!mappingConfig.defaultValues.description) {
    mappingConfig.defaultValues.description = "No description provided";
  }
  
  // Check for missing columns in the first row
  const firstRow = rawData[0];
  const missingColumnsMap = new Map<string, string>();
  
  for (const [targetField, sourceField] of Object.entries(mappingConfig.columnMappings)) {
    if (!(sourceField in firstRow)) {
      // Track missing columns and their target fields
      missingColumnsMap.set(sourceField, targetField);
      console.warn(`Source field "${sourceField}" not found in data for mapping to "${targetField}"`);
    }
  }
  
  // Store missing columns in the result
  result.missingColumns = Array.from(missingColumnsMap.keys());
  
  for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
    try {
      const rawItem = rawData[rowIndex];
      
      // Instead of filtering out missing columns, we'll create placeholders for them
      // This ensures that additionalFields entries are created even if source columns are missing
      const enhancedRawItem = { ...rawItem };
      
      // For each missing column that maps to an additional field, add a placeholder
      missingColumnsMap.forEach((targetField, sourceField) => {
        if (targetField.startsWith('additionalFields.')) {
          // Add an empty placeholder for the missing field
          // This ensures the additional field is still created in the output
          enhancedRawItem[sourceField] = '';
        }
      });
      
      const transformedItem = transformDataRow(enhancedRawItem, mappingConfig, rowIndex);
      result.items.push(transformedItem);
      result.processedRows++;
    } catch (error) {
      result.errorCount++;
      result.errors.push({
        row: rowIndex,
        message: error instanceof Error ? error.message : 'Unknown error during transformation',
        data: rawData[rowIndex]
      });
      
      // Only collect up to 20 error messages to avoid overwhelming the user
      if (result.errorCount >= 20) {
        result.errors.push({
          row: -1,
          message: `Additional errors found but not shown (${rawData.length - rowIndex - 1} rows remaining)`
        });
        break;
      }
    }
  }
  
  // If we have errors but still processed some rows, mark as success
  // This enables partial imports where some rows may fail
  result.success = result.processedRows > 0;
  return result;
}

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
