
import { supabase } from "@/integrations/supabase/client";

/**
 * Core API client for Supabase operations
 * This abstraction allows us to swap out the underlying client if needed
 */
export const apiClient = {
  /**
   * Perform a SELECT query
   */
  select: async (table: string, options?: { 
    columns?: string, 
    filters?: Record<string, any>
    single?: boolean
  }) => {
    let query = supabase.from(table).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    if (options?.single) {
      return query.single();
    }
    
    return query;
  },
  
  /**
   * Insert data into a table
   */
  insert: async (table: string, data: Record<string, any>, options?: { 
    returning?: boolean 
  }) => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      return query.select('*').single();
    }
    
    return query;
  },
  
  /**
   * Update data in a table
   */
  update: async (table: string, id: string, data: Record<string, any>, options?: { 
    returning?: boolean,
    idField?: string 
  }) => {
    const idField = options?.idField || 'id';
    const query = supabase.from(table).update(data).eq(idField, id);
    
    if (options?.returning !== false) {
      return query.select('*').single();
    }
    
    return query;
  },
  
  /**
   * Delete data from a table
   */
  delete: async (table: string, id: string, options?: { idField?: string }) => {
    const idField = options?.idField || 'id';
    return supabase.from(table).delete().eq(idField, id);
  }
};
