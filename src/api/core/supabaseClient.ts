
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Define the table names as a type literal for type safety
type TableNames = 'directory_items' | 'profiles' | 'user_settings';

// Type to check if a table name is valid
type ValidTable<T extends string> = T extends TableNames ? T : never;

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
  ): Promise<PostgrestResponse<any>> => {
    let query = supabase.from(table).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    if (options?.single) {
      return await query.single();
    }
    
    return await query;
  },
  
  /**
   * Insert data into a table
   */
  insert: async <T extends TableNames>(
    table: T, 
    data: any,
    options?: { 
      returning?: boolean 
    }
  ): Promise<PostgrestResponse<any>> => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      return await query.select().single();
    }
    
    return await query;
  },
  
  /**
   * Update data in a table
   */
  update: async <T extends TableNames>(
    table: T,
    id: string, 
    data: any,
    options?: { 
      returning?: boolean,
      idField?: string 
    }
  ): Promise<PostgrestResponse<any>> => {
    const idField = options?.idField || 'id';
    const query = supabase.from(table).update(data).eq(idField, id);
    
    if (options?.returning !== false) {
      return await query.select().single();
    }
    
    return await query;
  },
  
  /**
   * Delete data from a table
   */
  delete: async <T extends TableNames>(
    table: T,
    id: string,
    options?: { idField?: string }
  ): Promise<PostgrestResponse<null>> => {
    const idField = options?.idField || 'id';
    return await supabase.from(table).delete().eq(idField, id);
  },

  /**
   * Bulk insert data into a table
   */
  bulkInsert: async <T extends TableNames>(
    table: T,
    data: any[],
    options?: {
      returning?: boolean
    }
  ): Promise<PostgrestResponse<any>> => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      return await query.select();
    }
    
    return await query;
  }
};
