
import { supabase } from "@/integrations/supabase/client";
import { DirectoryItem } from "@/types/directory";

/**
 * Fetches all directory items
 */
export async function getDirectoryItems() {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching directory items:', error);
    throw error;
  }
  
  return data as DirectoryItem[];
}

/**
 * Fetches a directory item by ID
 */
export async function getDirectoryItemById(id: string) {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching directory item with ID ${id}:`, error);
    throw error;
  }
  
  return data as DirectoryItem;
}

/**
 * Fetches directory items by category
 */
export async function getDirectoryItemsByCategory(category: string) {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching directory items with category ${category}:`, error);
    throw error;
  }
  
  return data as DirectoryItem[];
}

/**
 * Creates a new directory item
 */
export async function createDirectoryItem(item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
  // Map DirectoryItem properties to Supabase column names
  const supabaseItem = {
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    tags: item.tags,
    image_url: item.imageUrl,
    thumbnail_url: item.thumbnailUrl,
    json_ld: item.jsonLd,
    meta_data: item.metaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('directory_items')
    .insert([supabaseItem])
    .select();
  
  if (error) {
    console.error('Error creating directory item:', error);
    throw error;
  }
  
  // Map Supabase response back to DirectoryItem format
  return mapToDirectoryItem(data[0]);
}

/**
 * Updates an existing directory item
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>) {
  // Map DirectoryItem properties to Supabase column names
  const supabaseItem: any = {};
  
  if (item.title) supabaseItem.title = item.title;
  if (item.description) supabaseItem.description = item.description;
  if (item.category) supabaseItem.category = item.category;
  if (item.subcategory !== undefined) supabaseItem.subcategory = item.subcategory;
  if (item.tags !== undefined) supabaseItem.tags = item.tags;
  if (item.imageUrl !== undefined) supabaseItem.image_url = item.imageUrl;
  if (item.thumbnailUrl !== undefined) supabaseItem.thumbnail_url = item.thumbnailUrl;
  if (item.jsonLd) supabaseItem.json_ld = item.jsonLd;
  if (item.metaData !== undefined) supabaseItem.meta_data = item.metaData;
  
  supabaseItem.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('directory_items')
    .update(supabaseItem)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating directory item with ID ${id}:`, error);
    throw error;
  }
  
  // Map Supabase response back to DirectoryItem format
  return mapToDirectoryItem(data[0]);
}

/**
 * Deletes a directory item
 */
export async function deleteDirectoryItem(id: string) {
  const { error } = await supabase
    .from('directory_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting directory item with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

/**
 * Bulk inserts directory items
 */
export async function bulkInsertDirectoryItems(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>) {
  // Map all items to Supabase format
  const supabaseItems = items.map(item => ({
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    tags: item.tags,
    image_url: item.imageUrl,
    thumbnail_url: item.thumbnailUrl,
    json_ld: item.jsonLd,
    meta_data: item.metaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('directory_items')
    .insert(supabaseItems)
    .select();
  
  if (error) {
    console.error('Error bulk inserting directory items:', error);
    throw error;
  }
  
  // Map Supabase response back to DirectoryItem format
  return data.map(mapToDirectoryItem) as DirectoryItem[];
}

/**
 * Helper function to map from Supabase database format to DirectoryItem format
 */
function mapToDirectoryItem(item: any): DirectoryItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory || undefined,
    tags: item.tags || undefined,
    imageUrl: item.image_url || undefined,
    thumbnailUrl: item.thumbnail_url || undefined,
    jsonLd: item.json_ld,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    metaData: item.meta_data || undefined
  };
}
