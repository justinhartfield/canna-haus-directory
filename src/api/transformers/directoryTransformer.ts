
import { DirectoryItem } from "@/types/directory";
import { Json } from "@/integrations/supabase/types";

/**
 * Safely converts a JSON value to a Record<string, any>
 */
export function ensureRecord(value: any): Record<string, any> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, any>;
  }
  return {}; // Return empty object if value isn't an object
}

/**
 * Transform database row to DirectoryItem
 * Maps database column names (lowercase with underscores) to DirectoryItem properties (camelCase)
 */
export function transformDatabaseRowToDirectoryItem(data: any): DirectoryItem {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory || undefined,
    tags: data.tags || [],
    imageUrl: data.imageurl || undefined,
    thumbnailUrl: data.thumbnailurl || undefined,
    jsonLd: ensureRecord(data.jsonld),
    createdAt: data.createdat,
    updatedAt: data.updatedat,
    metaData: ensureRecord(data.metadata),
    additionalFields: ensureRecord(data.additionalfields)
  };
}

/**
 * Transform DirectoryItem to database row format
 * Maps DirectoryItem properties (camelCase) to database column names (lowercase with underscores)
 */
export function transformDirectoryItemToDatabaseRow(item: Partial<DirectoryItem>): Record<string, any> {
  const databaseRow: Record<string, any> = {};
  
  // Map properties with different casing conventions
  if (item.title !== undefined) databaseRow.title = item.title;
  if (item.description !== undefined) databaseRow.description = item.description;
  if (item.category !== undefined) databaseRow.category = item.category;
  if (item.subcategory !== undefined) databaseRow.subcategory = item.subcategory;
  if (item.tags !== undefined) databaseRow.tags = item.tags;
  if (item.imageUrl !== undefined) databaseRow.imageurl = item.imageUrl;
  if (item.thumbnailUrl !== undefined) databaseRow.thumbnailurl = item.thumbnailUrl;
  if (item.jsonLd !== undefined) databaseRow.jsonld = item.jsonLd;
  if (item.metaData !== undefined) databaseRow.metadata = item.metaData;
  if (item.additionalFields !== undefined) databaseRow.additionalfields = item.additionalFields;
  
  return databaseRow;
}
