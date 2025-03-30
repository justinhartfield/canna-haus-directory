
import { supabase } from "@/integrations/supabase/client";
import { DirectoryItem } from "@/types/directory";

/**
 * Safely converts a JSON value to a Record<string, any>
 */
function ensureRecord(value: any): Record<string, any> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, any>;
  }
  return {}; // Return empty object if value isn't an object
}

/**
 * Transform database row to DirectoryItem
 */
function transformDatabaseRowToDirectoryItem(data: any): DirectoryItem {
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
 * Fetches all directory items from Supabase
 */
export async function getDirectoryItems(): Promise<DirectoryItem[]> {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*');
  
  if (error) {
    console.error("Error fetching directory items:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}

/**
 * Fetches a directory item by ID from Supabase
 */
export async function getDirectoryItemById(id: string): Promise<DirectoryItem | null> {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Item not found
      return null;
    }
    console.error("Error fetching directory item:", error);
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Fetches directory items by category from Supabase
 */
export async function getDirectoryItemsByCategory(category: string): Promise<DirectoryItem[]> {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error("Error fetching directory items by category:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}

/**
 * Creates a new directory item in Supabase
 */
export async function createDirectoryItem(item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DirectoryItem> {
  const { data, error } = await supabase
    .from('directory_items')
    .insert({
      title: item.title,
      description: item.description,
      category: item.category,
      subcategory: item.subcategory,
      tags: item.tags,
      imageurl: item.imageUrl,
      thumbnailurl: item.thumbnailUrl,
      jsonld: item.jsonLd || {},
      metadata: item.metaData || {},
      additionalfields: item.additionalFields || {},
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating directory item:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Updates an existing directory item in Supabase
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>): Promise<DirectoryItem | null> {
  // Transform the input data to match the database column names
  const updateData: Record<string, any> = {};
  
  if (item.title !== undefined) updateData.title = item.title;
  if (item.description !== undefined) updateData.description = item.description;
  if (item.category !== undefined) updateData.category = item.category;
  if (item.subcategory !== undefined) updateData.subcategory = item.subcategory;
  if (item.tags !== undefined) updateData.tags = item.tags;
  if (item.imageUrl !== undefined) updateData.imageurl = item.imageUrl;
  if (item.thumbnailUrl !== undefined) updateData.thumbnailurl = item.thumbnailUrl;
  if (item.jsonLd !== undefined) updateData.jsonld = item.jsonLd;
  if (item.metaData !== undefined) updateData.metadata = item.metaData;
  if (item.additionalFields !== undefined) updateData.additionalfields = item.additionalFields;
  
  const { data, error } = await supabase
    .from('directory_items')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating directory item:", error);
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our DirectoryItem interface
  return transformDatabaseRowToDirectoryItem(data);
}

/**
 * Deletes a directory item from Supabase
 */
export async function deleteDirectoryItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('directory_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting directory item:", error);
    throw error;
  }
  
  return true;
}

/**
 * Bulk inserts directory items into Supabase
 */
export async function bulkInsertDirectoryItems(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DirectoryItem[]> {
  // Format items for insertion - match database column naming
  const insertData = items.map(item => ({
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    tags: item.tags,
    imageurl: item.imageUrl,
    thumbnailurl: item.thumbnailUrl,
    jsonld: item.jsonLd || {},
    metadata: item.metaData || {},
    additionalfields: item.additionalFields || {}
  }));
  
  const { data, error } = await supabase
    .from('directory_items')
    .insert(insertData)
    .select('*');
  
  if (error) {
    console.error("Error bulk inserting directory items:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem[] = (data || []).map(transformDatabaseRowToDirectoryItem);
  
  return transformedData;
}
