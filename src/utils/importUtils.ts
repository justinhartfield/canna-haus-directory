
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DirectoryItem } from '@/types/directory';
import { bulkInsertDirectoryItems } from '@/api/directoryService';

/**
 * Converts a CSV file to JSON
 */
export function csvToJson(csvContent: string): Record<string, any>[] {
  const results = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  
  if (results.errors && results.errors.length > 0) {
    console.error('CSV parsing errors:', results.errors);
    throw new Error(`Error parsing CSV: ${results.errors[0].message}`);
  }
  
  return results.data as Record<string, any>[];
}

/**
 * Converts an Excel file to JSON
 */
export function excelToJson(excelContent: ArrayBuffer): Record<string, any>[] {
  try {
    const workbook = XLSX.read(excelContent, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
}

/**
 * Maps raw data to DirectoryItem format
 */
export function mapToDirectoryItem(
  rawItem: Record<string, any>, 
  category: string, 
  mapConfig: Record<string, string> = {}
): Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'> {
  // Default mapping if specific mappings aren't provided
  const titleField = mapConfig.title || 'title' || 'name' || 'Title' || 'Name';
  const descField = mapConfig.description || 'description' || 'desc' || 'Description';
  const imageField = mapConfig.imageUrl || 'imageUrl' || 'image' || 'Image';
  const subcategoryField = mapConfig.subcategory || 'subcategory' || 'Subcategory';
  const tagsField = mapConfig.tags || 'tags' || 'Tags';
  
  // Extract values with fallbacks
  const title = rawItem[titleField] || 'Untitled Item';
  const description = rawItem[descField] || '';
  const imageUrl = rawItem[imageField] || '';
  const subcategory = rawItem[subcategoryField] || '';
  
  // Handle tags (could be string or array)
  let tags: string[] = [];
  if (rawItem[tagsField]) {
    if (typeof rawItem[tagsField] === 'string') {
      tags = rawItem[tagsField].split(',').map(tag => tag.trim());
    } else if (Array.isArray(rawItem[tagsField])) {
      tags = rawItem[tagsField];
    }
  }
  
  // Create JSON-LD from all available fields
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": title,
    "description": description,
    "contentUrl": imageUrl,
    "keywords": tags,
    "category": category,
    "subcategory": subcategory,
    // Add other fields from rawItem
    ...Object.entries(rawItem).reduce((acc, [key, value]) => {
      // Skip fields already mapped to standard properties
      if (![titleField, descField, imageField, subcategoryField, tagsField].includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {})
  };
  
  return {
    title,
    description,
    category,
    subcategory,
    tags,
    imageUrl,
    jsonLd
  };
}

/**
 * Processes a file and imports it into the database
 */
export async function processAndImportFile(
  file: File, 
  category: string, 
  mapConfig: Record<string, string> = {}
): Promise<{ success: boolean, count: number, errors: string[] }> {
  const errors: string[] = [];
  let rawData: Record<string, any>[] = [];
  
  try {
    // Parse file content based on file type
    if (file.name.endsWith('.csv')) {
      const text = await file.text();
      rawData = csvToJson(text);
    } else if (file.name.match(/\.xlsx?$/i)) {
      const buffer = await file.arrayBuffer();
      rawData = excelToJson(buffer);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    if (!rawData.length) {
      throw new Error('No data found in file');
    }
    
    // Map raw data to DirectoryItem format
    const directoryItems = rawData.map(item => mapToDirectoryItem(item, category, mapConfig));
    
    // Import to database
    await bulkInsertDirectoryItems(directoryItems);
    
    return {
      success: true,
      count: directoryItems.length,
      errors
    };
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return {
      success: false,
      count: 0,
      errors: [`Error processing ${file.name}: ${error.message}`]
    };
  }
}
