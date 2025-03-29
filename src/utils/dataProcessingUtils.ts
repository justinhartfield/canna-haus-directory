
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { DirectoryItem } from '@/types/directory';
import { bulkInsertDirectoryItems } from '@/api/directoryService';

/**
 * Supported file types for data processing
 */
export type SupportedFileType = 'csv' | 'excel';

/**
 * Configuration for data mapping
 */
export interface DataMappingConfig {
  // Map source columns to target fields
  columnMappings: Record<string, string>;
  // Default values for fields that might be missing
  defaultValues?: Record<string, any>;
  // Custom transformation functions for specific fields
  transformations?: Record<string, (value: any, row: Record<string, any>) => any>;
  // Category assignment logic
  categoryAssignment?: (row: Record<string, any>) => string;
  // Schema type for JSON-LD
  schemaType?: string;
}

/**
 * Processing results
 */
export interface ProcessingResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: Record<string, any>;
  }>;
  items: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>[];
}

/**
 * Detects the file type based on extension
 */
export function detectFileType(fileName: string): SupportedFileType {
  if (fileName.toLowerCase().endsWith('.csv')) {
    return 'csv';
  } else if (fileName.toLowerCase().match(/\.xlsx?$/i)) {
    return 'excel';
  }
  throw new Error(`Unsupported file type: ${fileName}`);
}

/**
 * Process file content into structured data
 */
export async function processFileContent(
  file: File,
  mappingConfig: DataMappingConfig
): Promise<ProcessingResult> {
  const fileType = detectFileType(file.name);
  let rawData: Record<string, any>[] = [];
  
  try {
    // Parse file based on type
    if (fileType === 'csv') {
      const text = await file.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
      
      if (result.errors && result.errors.length > 0) {
        throw new Error(`CSV parsing error: ${result.errors[0].message}`);
      }
      
      rawData = result.data as Record<string, any>[];
    } else if (fileType === 'excel') {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(worksheet);
    }
    
    return transformData(rawData, mappingConfig);
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return {
      success: false,
      totalRows: 0,
      processedRows: 0,
      errorCount: 1,
      errors: [
        {
          row: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      ],
      items: []
    };
  }
}

/**
 * Transform raw data to structured directory items
 */
function transformData(
  rawData: Record<string, any>[],
  mappingConfig: DataMappingConfig
): ProcessingResult {
  const result: ProcessingResult = {
    success: true,
    totalRows: rawData.length,
    processedRows: 0,
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
function transformDataRow(
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
  
  // Construct the final directory item
  const directoryItem: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
    title: validateRequiredField(baseItem.title, 'title', rowIndex),
    description: validateRequiredField(baseItem.description, 'description', rowIndex),
    category,
    subcategory: baseItem.subcategory,
    tags,
    imageUrl: baseItem.imageUrl,
    thumbnailUrl: baseItem.thumbnailUrl,
    jsonLd,
    metaData: baseItem.metaData || {}
  };
  
  return directoryItem;
}

/**
 * Validate that a required field exists
 */
function validateRequiredField(value: any, fieldName: string, rowIndex: number): string {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required field '${fieldName}' at row ${rowIndex + 1}`);
  }
  return String(value);
}

/**
 * Generate JSON-LD structure from data
 */
function generateJsonLd(
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
function formatJsonLdKey(key: string): string {
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

/**
 * Process a batch of files using a common mapping configuration
 */
export async function processBatchFiles(
  files: File[],
  mappingConfig: DataMappingConfig,
  batchSize: number = 100,
  onProgress?: (current: number, total: number) => void
): Promise<{
  success: boolean;
  totalFiles: number;
  processedFiles: number;
  totalRows: number;
  successRows: number;
  errorCount: number;
  errors: Array<{ file: string; errors: Array<{ row: number; message: string }> }>;
}> {
  const result = {
    success: true,
    totalFiles: files.length,
    processedFiles: 0,
    totalRows: 0,
    successRows: 0,
    errorCount: 0,
    errors: [] as Array<{ file: string; errors: Array<{ row: number; message: string }> }>
  };
  
  // Process files sequentially to avoid memory issues
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileResult = await processFileContent(file, mappingConfig);
    
    result.processedFiles++;
    result.totalRows += fileResult.totalRows;
    result.successRows += fileResult.processedRows;
    
    if (fileResult.errorCount > 0) {
      result.errorCount += fileResult.errorCount;
      result.errors.push({
        file: file.name,
        errors: fileResult.errors.map(err => ({ row: err.row, message: err.message }))
      });
    }
    
    // If we have successful items, import them in batches
    if (fileResult.items.length > 0) {
      // Process in batches to avoid memory issues
      for (let j = 0; j < fileResult.items.length; j += batchSize) {
        const batch = fileResult.items.slice(j, j + batchSize);
        try {
          await bulkInsertDirectoryItems(batch);
        } catch (error) {
          console.error(`Error importing batch from file ${file.name}:`, error);
          result.errorCount++;
          result.errors.push({
            file: file.name,
            errors: [{
              row: -1,
              message: `Batch import error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }]
          });
        }
      }
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  result.success = result.errorCount === 0;
  return result;
}

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
 * Sample a file to get a preview of its data
 */
export async function sampleFileContent(
  file: File,
  maxRows: number = 5
): Promise<Record<string, any>[]> {
  const fileType = detectFileType(file.name);
  
  try {
    if (fileType === 'csv') {
      const text = await file.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        preview: maxRows
      });
      
      if (result.errors && result.errors.length > 0) {
        throw new Error(`CSV parsing error: ${result.errors[0].message}`);
      }
      
      return result.data as Record<string, any>[];
    } else if (fileType === 'excel') {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get range information
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const lastRow = Math.min(range.e.r + 1, maxRows + 1); // +1 for header row
      
      // Create a subrange for sampling
      const sampleRange = {
        s: { r: range.s.r, c: range.s.c },
        e: { r: lastRow, c: range.e.c }
      };
      
      const sampleWorksheet = {};
      // Copy cells from the original worksheet to the sample worksheet
      Object.keys(worksheet).forEach(cell => {
        if (cell === '!ref' || cell === '!margins') return;
        const cellRef = XLSX.utils.decode_cell(cell);
        if (cellRef.r <= lastRow) {
          sampleWorksheet[cell] = worksheet[cell];
        }
      });
      
      // Set the new range
      sampleWorksheet['!ref'] = XLSX.utils.encode_range(sampleRange);
      
      return XLSX.utils.sheet_to_json(sampleWorksheet);
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error(`Error sampling file ${file.name}:`, error);
    return [];
  }
}
