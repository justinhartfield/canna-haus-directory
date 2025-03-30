
import { DataMappingConfig } from './mappingUtils';
import { DirectoryItem } from '@/types/directory';
import { transformData } from './transformUtils';
import { processBatchFiles } from './importUtils';
import { validationPresets } from './batchProcessingUtils';

/**
 * Metadata structure for folder processing
 */
export interface FolderMetadata {
  folderName: string;
  sourceType: string;
  lastProcessed: string;
  fileCount: number;
  itemCount: number;
  schemaType: string;
}

/**
 * Configuration for data source folders
 */
export interface FolderProcessingConfig {
  folderName: string;
  mappingConfig: DataMappingConfig;
  validationRules: Record<string, (value: any) => boolean>;
  incrementalOnly?: boolean;
  transformationRules?: Record<string, (data: any) => any>;
  schemaType: string;
}

/**
 * Results from folder processing
 */
export interface FolderProcessingResult {
  folderName: string;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  metadata: FolderMetadata;
  errors: Array<{
    file: string;
    errors: Array<{
      row: number;
      message: string;
    }>;
  }>;
}

/**
 * Process files in a folder structure with specialized configurations
 */
export async function processFolderData(
  files: File[],
  folderConfig: FolderProcessingConfig,
  existingMetadata?: FolderMetadata,
  onProgress?: (current: number, total: number) => void
): Promise<FolderProcessingResult> {
  // Initialize folder metadata
  let metadata: FolderMetadata = existingMetadata || {
    folderName: folderConfig.folderName,
    sourceType: 'import',
    lastProcessed: '',
    fileCount: 0,
    itemCount: 0,
    schemaType: folderConfig.schemaType
  };
  
  // Filter files for incremental loading if needed
  let filesToProcess = files;
  if (folderConfig.incrementalOnly && existingMetadata) {
    const lastProcessedDate = new Date(existingMetadata.lastProcessed);
    filesToProcess = files.filter(file => {
      const fileModified = new Date(file.lastModified);
      return fileModified > lastProcessedDate;
    });
    
    console.log(`Incremental processing: ${filesToProcess.length} of ${files.length} files are new or modified since last run.`);
  }
  
  // If no files to process, return early
  if (filesToProcess.length === 0) {
    return {
      folderName: folderConfig.folderName,
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: files.length,
      metadata,
      errors: []
    };
  }
  
  // Apply specialized transformations if specified
  let enhancedMappingConfig = { ...folderConfig.mappingConfig };
  if (folderConfig.transformationRules) {
    enhancedMappingConfig.transformations = {
      ...(enhancedMappingConfig.transformations || {}),
      ...folderConfig.transformationRules
    };
  }
  
  // Set schema type for JSON-LD
  enhancedMappingConfig.schemaType = folderConfig.schemaType;
  
  // Process files with the specialized configuration
  const result = await processBatchFiles(
    filesToProcess,
    enhancedMappingConfig,
    100, // Default batch size
    onProgress,
    folderConfig.validationRules
  );
  
  // Update metadata
  metadata = {
    ...metadata,
    lastProcessed: new Date().toISOString(),
    fileCount: result.processedFiles,
    itemCount: metadata.itemCount + result.successRows,
    schemaType: folderConfig.schemaType
  };
  
  return {
    folderName: folderConfig.folderName,
    processed: result.totalRows,
    succeeded: result.successRows,
    failed: result.totalRows - result.successRows,
    skipped: files.length - filesToProcess.length,
    metadata,
    errors: result.errors
  };
}

/**
 * Create a specialized configuration for a data category/folder
 */
export function createFolderConfig(
  folderName: string,
  schemaType: string,
  columnMappings: Record<string, string>,
  customValidationRules?: Record<string, (value: any) => boolean>,
  incrementalOnly: boolean = false
): FolderProcessingConfig {
  // Get validation rules based on schema type or use custom rules
  const validationRules = customValidationRules || 
    (validationPresets[schemaType.toLowerCase()] || validationPresets.product);
  
  return {
    folderName,
    schemaType,
    incrementalOnly,
    validationRules,
    mappingConfig: {
      columnMappings,
      defaultValues: {
        category: folderName
      },
      schemaType
    }
  };
}

/**
 * Apply data cleansing procedures to raw data
 */
export function cleanseData(
  data: Record<string, any>[],
  cleansingRules: Record<string, (value: any) => any>
): Record<string, any>[] {
  return data.map(item => {
    const cleansedItem = { ...item };
    
    for (const [field, cleanseFn] of Object.entries(cleansingRules)) {
      if (field in cleansedItem) {
        cleansedItem[field] = cleanseFn(cleansedItem[field]);
      }
    }
    
    return cleansedItem;
  });
}

/**
 * Generate consistency report for processed data
 */
export function generateDataConsistencyReport(
  data: Record<string, any>[],
  requiredFields: string[]
): {
  missingFields: Record<string, number>;
  emptyValues: Record<string, number>;
  totalItems: number;
  completeItems: number;
  incompleteItems: number;
} {
  const missingFields: Record<string, number> = {};
  const emptyValues: Record<string, number> = {};
  let completeItems = 0;
  
  for (const item of data) {
    let isComplete = true;
    
    for (const field of requiredFields) {
      if (!(field in item)) {
        missingFields[field] = (missingFields[field] || 0) + 1;
        isComplete = false;
      } else if (item[field] === '' || item[field] === null || item[field] === undefined) {
        emptyValues[field] = (emptyValues[field] || 0) + 1;
        isComplete = false;
      }
    }
    
    if (isComplete) {
      completeItems++;
    }
  }
  
  return {
    missingFields,
    emptyValues,
    totalItems: data.length,
    completeItems,
    incompleteItems: data.length - completeItems
  };
}

/**
 * Common data cleansing functions for different data types
 */
export const cleansingFunctions = {
  trimText: (value: string): string => 
    typeof value === 'string' ? value.trim() : String(value || ''),
  
  normalizeCase: (value: string): string =>
    typeof value === 'string' 
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() 
      : String(value || ''),
  
  removeHtml: (value: string): string =>
    typeof value === 'string' 
      ? value.replace(/<[^>]*>/g, '') 
      : String(value || ''),
  
  normalizeUrl: (value: string): string => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.href;
    } catch {
      // If not a valid URL, try to fix common issues
      if (value.match(/^www\./)) {
        return `https://${value}`;
      }
      if (!value.match(/^https?:\/\//)) {
        return `https://${value}`;
      }
      return value;
    }
  },
  
  normalizePhone: (value: string): string => {
    if (!value) return '';
    // Remove non-digit characters
    return value.replace(/\D/g, '');
  }
};

/**
 * Schema templates for common data types following schema.org specifications
 */
export const schemaTemplates = {
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "",
    "description": "",
    "image": "",
    "brand": {
      "@type": "Brand",
      "name": ""
    },
    "offers": {
      "@type": "Offer",
      "price": "",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  },
  
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "",
    "description": "",
    "image": "",
    "datePublished": "",
    "author": {
      "@type": "Person",
      "name": ""
    }
  },
  
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "",
    "description": "",
    "url": "",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "email": "",
      "contactType": "Customer Service"
    }
  },
  
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "",
    "description": "",
    "image": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "",
      "addressRegion": "",
      "postalCode": "",
      "addressCountry": "US"
    },
    "telephone": "",
    "openingHours": ""
  },
  
  Person: {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "",
    "description": "",
    "image": "",
    "jobTitle": "",
    "affiliation": {
      "@type": "Organization",
      "name": ""
    }
  },
  
  MedicalEntity: {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    "name": "",
    "description": "",
    "code": {
      "@type": "MedicalCode",
      "codeValue": "",
      "codingSystem": ""
    }
  },
  
  Drug: {
    "@context": "https://schema.org",
    "@type": "Drug",
    "name": "",
    "description": "",
    "activeIngredient": "",
    "administrationRoute": "",
    "nonProprietaryName": "",
    "drugClass": ""
  }
};

/**
 * Get a schema template for a specific schema type
 */
export function getSchemaTemplate(schemaType: string): Record<string, any> {
  return schemaTemplates[schemaType] || schemaTemplates.Product;
}
