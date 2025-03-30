
import { DirectoryItem } from '@/types/directory';
import { DataMappingConfig } from './mappingUtils';
import { validateRequiredField, generateJsonLd } from './mappingUtils';

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
    items: []
  };
  
  if (!rawData.length) {
    result.success = false;
    result.errors.push({
      row: 0,
      message: 'No data found in file'
    });
    return result;
  }
  
  for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
    try {
      const rawItem = rawData[rowIndex];
      const transformedItem = transformDataRow(rawItem, mappingConfig, rowIndex);
      result.items.push(transformedItem);
      result.processedRows++;
    } catch (error) {
      result.errorCount++;
      result.errors.push({
        row: rowIndex,
        message: error instanceof Error ? error.message : 'Unknown error during transformation',
        data: rawData[rowIndex]
      });
    }
  }
  
  result.success = result.errorCount === 0;
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
  const baseItem: Record<string, any> = { ...defaultValues };
  
  // Apply column mappings
  for (const [targetField, sourceField] of Object.entries(columnMappings)) {
    if (sourceField in rawItem) {
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
  
  // Construct the final directory item
  const directoryItem: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
    title: validateRequiredField(normalizedTitle, 'title', rowIndex),
    description: validateRequiredField(normalizedDesc, 'description', rowIndex),
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

/**
 * Helper function to normalize string values
 */
export function normalizeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Helper function to normalize numeric values
 */
export function normalizeNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Helper function to normalize boolean values
 */
export function normalizeBoolean(value: any): boolean | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (['true', 'yes', 'y', '1'].includes(lowercased)) return true;
    if (['false', 'no', 'n', '0'].includes(lowercased)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return null;
}
