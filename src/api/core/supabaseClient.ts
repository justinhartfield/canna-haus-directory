
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Define the table names as a type literal for type safety
type TableNames = 'directory_items' | 'profiles' | 'user_settings';

// Type helper to get the row type based on table name
type TableRow<T extends TableNames> = 
  T extends 'directory_items' ? Database['public']['Tables']['directory_items']['Row'] :
  T extends 'profiles' ? Database['public']['Tables']['profiles']['Row'] :
  Database['public']['Tables']['user_settings']['Row'];

// Type helper for Insert types
type TableInsert<T extends TableNames> = 
  T extends 'directory_items' ? Database['public']['Tables']['directory_items']['Insert'] :
  T extends 'profiles' ? Database['public']['Tables']['profiles']['Insert'] :
  Database['public']['Tables']['user_settings']['Insert'];

// Type helper for Update types
type TableUpdate<T extends TableNames> = 
  T extends 'directory_items' ? Database['public']['Tables']['directory_items']['Update'] :
  T extends 'profiles' ? Database['public']['Tables']['profiles']['Update'] :
  Database['public']['Tables']['user_settings']['Update'];

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
  ): Promise<PostgrestResponse<TableRow<T>[]>> => {
    let query = supabase.from(table).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    if (options?.single) {
      const result = await query.single();
      return result as unknown as PostgrestResponse<TableRow<T>[]>;
    }
    
    return await query as unknown as PostgrestResponse<TableRow<T>[]>;
  },
  
  /**
   * Insert data into a table
   */
  insert: async <T extends TableNames>(
    table: T, 
    data: TableInsert<T>,
    options?: { 
      returning?: boolean 
    }
  ): Promise<PostgrestResponse<TableRow<T>>> => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      const result = await query.select('*').single();
      return result as unknown as PostgrestResponse<TableRow<T>>;
    }
    
    return await query as unknown as PostgrestResponse<null>;
  },
  
  /**
   * Update data in a table
   */
  update: async <T extends TableNames>(
    table: T,
    id: string, 
    data: TableUpdate<T>,
    options?: { 
      returning?: boolean,
      idField?: string 
    }
  ): Promise<PostgrestResponse<TableRow<T>>> => {
    const idField = options?.idField || 'id';
    const query = supabase.from(table).update(data).eq(idField, id);
    
    if (options?.returning !== false) {
      const result = await query.select('*').single();
      return result as unknown as PostgrestResponse<TableRow<T>>;
    }
    
    return await query as unknown as PostgrestResponse<null>;
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
    return await supabase.from(table).delete().eq(idField, id) as unknown as PostgrestResponse<null>;
  },

  /**
   * Bulk insert data into a table
   */
  bulkInsert: async <T extends TableNames>(
    table: T,
    data: TableInsert<T>[],
    options?: {
      returning?: boolean
    }
  ): Promise<PostgrestResponse<TableRow<T>[]>> => {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      const result = await query.select('*');
      return result as unknown as PostgrestResponse<TableRow<T>[]>;
    }
    
    return await query as unknown as PostgrestResponse<null>;
  }
};
