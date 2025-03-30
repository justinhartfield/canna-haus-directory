
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";

type TableNames = 'directory_items' | 'profiles' | 'user_settings';

/**
 * Core API client for Supabase operations
 * This abstraction allows us to swap out the underlying client if needed
 */
export const apiClient = {
  /**
   * Perform a SELECT query
   */
  select: async <T extends TableNames>(
    table: T,
    options?: { 
      columns?: string, 
      filters?: Record<string, any>,
      single?: boolean
    }
  ) => {
    let query = supabase.from(table).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    if (options?.single) {
      return query.single() as PostgrestResponse<Tables[T]['Row']>;
    }
    
    return query as PostgrestResponse<Tables[T]['Row'][]>;
  },
  
  /**
   * Insert data into a table
   */
  insert: async <T extends TableNames>(
    table: T, 
    data: Tables[T]['Insert'],
    options?: { 
      returning?: boolean 
    }
  ) => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      return query.select('*').single() as PostgrestResponse<Tables[T]['Row']>;
    }
    
    return query as PostgrestResponse<null>;
  },
  
  /**
   * Update data in a table
   */
  update: async <T extends TableNames>(
    table: T,
    id: string, 
    data: Tables[T]['Update'],
    options?: { 
      returning?: boolean,
      idField?: string 
    }
  ) => {
    const idField = options?.idField || 'id';
    const query = supabase.from(table).update(data).eq(idField, id);
    
    if (options?.returning !== false) {
      return query.select('*').single() as PostgrestResponse<Tables[T]['Row']>;
    }
    
    return query as PostgrestResponse<null>;
  },
  
  /**
   * Delete data from a table
   */
  delete: async <T extends TableNames>(
    table: T,
    id: string,
    options?: { idField?: string }
  ) => {
    const idField = options?.idField || 'id';
    return supabase.from(table).delete().eq(idField, id) as PostgrestResponse<null>;
  },

  /**
   * Bulk insert data into a table
   */
  bulkInsert: async <T extends TableNames>(
    table: T,
    data: Tables[T]['Insert'][],
    options?: {
      returning?: boolean
    }
  ) => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      return query.select('*') as PostgrestResponse<Tables[T]['Row'][]>;
    }
    
    return query as PostgrestResponse<null>;
  }
};
