
import { supabase } from "@/integrations/supabase/client";
import { DirectoryItem } from "@/types/directory";

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
  const transformedData: DirectoryItem[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory || undefined,
    tags: item.tags || [],
    imageUrl: item.imageUrl || undefined,
    thumbnailUrl: item.thumbnailUrl || undefined,
    jsonLd: item.jsonLd || {},
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    metaData: item.metaData || {},
    additionalFields: item.additionalFields || {}
  }));
  
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
  const transformedData: DirectoryItem = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory || undefined,
    tags: data.tags || [],
    imageUrl: data.imageUrl || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    jsonLd: data.jsonLd || {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    metaData: data.metaData || {},
    additionalFields: data.additionalFields || {}
  };
  
  return transformedData;
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
  const transformedData: DirectoryItem[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory || undefined,
    tags: item.tags || [],
    imageUrl: item.imageUrl || undefined,
    thumbnailUrl: item.thumbnailUrl || undefined,
    jsonLd: item.jsonLd || {},
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    metaData: item.metaData || {},
    additionalFields: item.additionalFields || {}
  }));
  
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
      imageUrl: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl,
      jsonLd: item.jsonLd,
      metaData: item.metaData,
      additionalFields: item.additionalFields,
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating directory item:", error);
    throw error;
  }
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory || undefined,
    tags: data.tags || [],
    imageUrl: data.imageUrl || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    jsonLd: data.jsonLd || {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    metaData: data.metaData || {},
    additionalFields: data.additionalFields || {}
  };
  
  return transformedData;
}

/**
 * Updates an existing directory item in Supabase
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>): Promise<DirectoryItem | null> {
  const { data, error } = await supabase
    .from('directory_items')
    .update(item)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating directory item:", error);
    throw error;
  }
  
  if (!data) return null;
  
  // Transform the data to match our DirectoryItem interface
  const transformedData: DirectoryItem = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory || undefined,
    tags: data.tags || [],
    imageUrl: data.imageUrl || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    jsonLd: data.jsonLd || {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    metaData: data.metaData || {},
    additionalFields: data.additionalFields || {}
  };
  
  return transformedData;
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
  // Format items for insertion
  const insertData = items.map(item => ({
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    tags: item.tags,
    imageUrl: item.imageUrl,
    thumbnailUrl: item.thumbnailUrl,
    jsonLd: item.jsonLd,
    metaData: item.metaData || {},
    additionalFields: item.additionalFields || {}
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
  const transformedData: DirectoryItem[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory || undefined,
    tags: item.tags || [],
    imageUrl: item.imageUrl || undefined,
    thumbnailUrl: item.thumbnailUrl || undefined,
    jsonLd: item.jsonLd || {},
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    metaData: item.metaData || {},
    additionalFields: item.additionalFields || {}
  }));
  
  return transformedData;
}
