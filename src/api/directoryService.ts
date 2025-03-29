
import { supabase } from "@/integrations/supabase/client";
import { DirectoryItem } from "@/types/directory";

/**
 * Mock implementation for the directory service
 * This can be replaced with actual API calls when the backend is ready
 */

// Mock data for development
const mockItems: DirectoryItem[] = [];

/**
 * Fetches all directory items
 */
export async function getDirectoryItems(): Promise<DirectoryItem[]> {
  // Mock implementation returns the mock data
  // This should be replaced with actual API calls
  return Promise.resolve([...mockItems]);
}

/**
 * Fetches a directory item by ID
 */
export async function getDirectoryItemById(id: string): Promise<DirectoryItem | null> {
  // Mock implementation finds an item by ID
  const item = mockItems.find(item => item.id === id);
  return Promise.resolve(item || null);
}

/**
 * Fetches directory items by category
 */
export async function getDirectoryItemsByCategory(category: string): Promise<DirectoryItem[]> {
  // Mock implementation filters items by category
  const items = mockItems.filter(item => item.category === category);
  return Promise.resolve(items);
}

/**
 * Creates a new directory item
 */
export async function createDirectoryItem(item: Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<DirectoryItem> {
  // Generate an ID and timestamps
  const newItem: DirectoryItem = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item
  };
  
  // Add to mock data
  mockItems.push(newItem);
  
  return Promise.resolve(newItem);
}

/**
 * Updates an existing directory item
 */
export async function updateDirectoryItem(id: string, item: Partial<DirectoryItem>): Promise<DirectoryItem | null> {
  // Find the item to update
  const index = mockItems.findIndex(item => item.id === id);
  if (index === -1) return Promise.resolve(null);
  
  // Update the item
  const updatedItem: DirectoryItem = {
    ...mockItems[index],
    ...item,
    updatedAt: new Date().toISOString()
  };
  
  mockItems[index] = updatedItem;
  
  return Promise.resolve(updatedItem);
}

/**
 * Deletes a directory item
 */
export async function deleteDirectoryItem(id: string): Promise<boolean> {
  // Find the item to delete
  const index = mockItems.findIndex(item => item.id === id);
  if (index === -1) return Promise.resolve(false);
  
  // Remove the item
  mockItems.splice(index, 1);
  
  return Promise.resolve(true);
}

/**
 * Bulk inserts directory items
 */
export async function bulkInsertDirectoryItems(items: Array<Omit<DirectoryItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DirectoryItem[]> {
  const newItems: DirectoryItem[] = items.map(item => ({
    id: String(Date.now() + Math.floor(Math.random() * 1000)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item
  }));
  
  // Add all items to mock data
  mockItems.push(...newItems);
  
  return Promise.resolve(newItems);
}
