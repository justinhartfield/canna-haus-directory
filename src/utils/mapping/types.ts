
/**
 * Types for data mapping functionality
 */

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
