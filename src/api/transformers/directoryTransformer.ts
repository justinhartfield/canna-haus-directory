
import { DirectoryItem } from "@/types/directory";

/**
 * Transform a database row to a DirectoryItem
 */
export function transformDatabaseRowToDirectoryItem(row: any): DirectoryItem {
  // Log the row structure during transformation to help debug
  if (process.env.NODE_ENV === 'development') {
    console.log('Database row keys:', Object.keys(row));
  }
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory || '',
    tags: row.tags || [],
    imageUrl: row.imageurl,
    thumbnailUrl: row.thumbnailurl,
    jsonLd: row.jsonld || {},
    createdAt: row.createdat,
    updatedAt: row.updatedat,
    metaData: row.metadata || {},
    // Map the lowercase database column name to camelCase in our code
    additionalFields: row.additionalfields || {}
  };
}

/**
 * Transform a DirectoryItem to a database row
 */
export function transformDirectoryItemToDatabaseRow(item: Partial<DirectoryItem>): Record<string, any> {
  const row: Record<string, any> = {};
  
  if (item.title !== undefined) row.title = item.title;
  if (item.description !== undefined) row.description = item.description;
  if (item.category !== undefined) row.category = item.category;
  if (item.subcategory !== undefined) row.subcategory = item.subcategory;
  if (item.tags !== undefined) row.tags = item.tags;
  if (item.imageUrl !== undefined) row.imageurl = item.imageUrl;
  if (item.thumbnailUrl !== undefined) row.thumbnailurl = item.thumbnailUrl;
  if (item.jsonLd !== undefined) row.jsonld = item.jsonLd;
  if (item.metaData !== undefined) row.metadata = item.metaData;
  // Map camelCase from our code to lowercase database column name
  if (item.additionalFields !== undefined) row.additionalfields = item.additionalFields;
  
  // Log the transformation for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Transformed item to row:', { 
      itemKeys: item.additionalFields ? 'additionalFields present' : 'no additionalFields',
      rowKeys: row.additionalfields ? 'additionalfields present' : 'no additionalfields' 
    });
  }
  
  return row;
}
