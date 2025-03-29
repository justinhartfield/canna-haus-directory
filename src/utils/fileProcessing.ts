
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Supported file types for data processing
 */
export type SupportedFileType = 'csv' | 'excel';

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

/**
 * Parse file content based on file type
 */
export async function parseFileContent(
  file: File
): Promise<Record<string, any>[]> {
  const fileType = detectFileType(file.name);
  
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
    
    return result.data as Record<string, any>[];
  } else if (fileType === 'excel') {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }
  
  throw new Error(`Unsupported file type: ${fileType}`);
}
