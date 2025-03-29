
import { supabase } from "@/integrations/supabase/client";
import { DirectoryItem } from "@/types/directory";

/**
 * Fetches all directory items
 */
export async function getDirectoryItems() {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .order('createdAt', { ascending: false });
  
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
    .order('createdAt', { ascending: false });
  
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
  const { data, error } = await supabase
    .from('directory_items')
    .insert([{
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select();
  
  if (error) {
    console.error('Error creating directory item:', error);
    throw error;
  }
  
  return data[0] as DirectoryItem;
}

/**
 * Updates an existing directory item
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>) {
  const { data, error } = await supabase
    .from('directory_items')
    .update({
      ...item,
      updatedAt: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating directory item with ID ${id}:`, error);
    throw error;
  }
  
  return data[0] as DirectoryItem;
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
  const itemsWithTimestamps = items.map(item => ({
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('directory_items')
    .insert(itemsWithTimestamps)
    .select();
  
  if (error) {
    console.error('Error bulk inserting directory items:', error);
    throw error;
  }
  
  return data as DirectoryItem[];
}
