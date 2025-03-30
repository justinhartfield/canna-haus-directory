
// This is a new file to define the necessary types related to folder processing
import { DirectoryItem } from "@/types/directory";

export interface FolderProcessingConfig {
  folderName: string;
  schemaType: string;
  mappingConfig: {
    columnMappings: Record<string, string>;
  };
  options?: Record<string, any>;
  incrementalMode?: boolean;
  duplicateHandling?: {
    duplicateHandlingMode: string;
  };
}

export interface FolderMetadata {
  folderName: string;
  sourceType?: string;
  lastProcessed: string;
  fileCount: number;
  itemCount: number;
  schemaType: string;
}

export interface FolderProcessingResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  duplicates?: number;
  metadata: FolderMetadata;
}

// Export data cleansing functions that were referenced but missing
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

// Add the missing cleansingFunctions export
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

// Add the missing generateDataConsistencyReport function
export function generateDataConsistencyReport(
  data: Record<string, any>[],
  schemaType: string
): { 
  consistency: number; 
  missingFields: Record<string, number>;
  report: string; 
} {
  const requiredFields = getRequiredFieldsForSchema(schemaType);
  const missingFields: Record<string, number> = {};
  let totalMissing = 0;
  let totalFields = requiredFields.length * data.length;
  
  for (const field of requiredFields) {
    missingFields[field] = 0;
    
    for (const item of data) {
      if (!item[field] || item[field] === '') {
        missingFields[field]++;
        totalMissing++;
      }
    }
  }
  
  const consistency = totalFields > 0 
    ? ((totalFields - totalMissing) / totalFields) * 100 
    : 100;
    
  // Generate a human-readable report
  let report = `Data Consistency Report:\n`;
  report += `Overall consistency: ${consistency.toFixed(2)}%\n`;
  report += `Items analyzed: ${data.length}\n\n`;
  report += `Missing required fields:\n`;
  
  for (const [field, count] of Object.entries(missingFields)) {
    if (count > 0) {
      const percentage = ((count / data.length) * 100).toFixed(2);
      report += `${field}: ${count} items (${percentage}%)\n`;
    }
  }
  
  return {
    consistency,
    missingFields,
    report
  };
}

// Helper function to get required fields based on schema type
function getRequiredFieldsForSchema(schemaType: string): string[] {
  switch (schemaType) {
    case 'Product':
      return ['title', 'description', 'category'];
    case 'LocalBusiness':
      return ['title', 'description', 'address', 'telephone'];
    case 'Article':
      return ['title', 'description', 'datePublished', 'author'];
    case 'Person':
      return ['title', 'description'];
    case 'Organization':
      return ['title', 'description', 'address'];
    case 'MedicalEntity':
      return ['title', 'description', 'category'];
    case 'Drug':
      return ['title', 'description', 'activeIngredient'];
    default:
      return ['title', 'description'];
  }
}

// Add schemaTemplates for the export in dataProcessingUtils
export const schemaTemplates = {
  Product: {
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    brand: '',
    additionalFields: {
      breeder: '',
      phenotype: '',
      thcContent: '',
      cbdContent: '',
      effects: '',
      flavors: '',
      growingNotes: '',
      yearIntroduced: ''
    }
  },
  LocalBusiness: {
    title: '',
    description: '',
    address: '',
    telephone: '',
    website: '',
    openingHours: '',
    category: ''
  },
  Article: {
    title: '',
    description: '',
    datePublished: '',
    author: '',
    content: ''
  },
  // Add other schema templates as needed
};

// Stub functions to prevent errors
export function createFolderConfig(
  folderName: string,
  schemaType: string,
  columnMappings: Record<string, string>,
  options?: Record<string, any>,
  incrementalMode?: boolean,
  duplicateHandling?: { duplicateHandlingMode: string }
): FolderProcessingConfig {
  return {
    folderName,
    schemaType,
    mappingConfig: { columnMappings },
    options,
    incrementalMode,
    duplicateHandling
  };
}

export function processFolderData(
  files: File[],
  config: FolderProcessingConfig,
  previousMetadata: FolderMetadata | null,
  progressCallback: (current: number, total: number) => void
): Promise<FolderProcessingResult> {
  // Mock implementation
  return new Promise((resolve) => {
    let current = 0;
    const total = files.length;
    
    // Simulate processing
    const interval = setInterval(() => {
      current++;
      progressCallback(current, total);
      
      if (current >= total) {
        clearInterval(interval);
        
        const result: FolderProcessingResult = {
          processed: total,
          succeeded: Math.floor(total * 0.8),
          failed: Math.floor(total * 0.1),
          skipped: Math.floor(total * 0.1),
          duplicates: Math.floor(total * 0.05),
          metadata: {
            folderName: config.folderName,
            sourceType: 'import',
            lastProcessed: new Date().toISOString(),
            fileCount: total,
            itemCount: Math.floor(total * 0.8),
            schemaType: config.schemaType
          }
        };
        
        resolve(result);
      }
    }, 500);
  });
}

export function getSchemaTemplate(schemaType: string): Record<string, any> {
  return schemaTemplates[schemaType as keyof typeof schemaTemplates] || schemaTemplates.Product;
}
