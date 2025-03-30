
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Define the table names as a type literal for type safety
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
  ): Promise<
    PostgrestResponse<T extends 'directory_items' 
      ? Database['public']['Tables']['directory_items']['Row'][] 
      : T extends 'profiles' 
        ? Database['public']['Tables']['profiles']['Row'][] 
        : Database['public']['Tables']['user_settings']['Row'][]
    >
  > {
    let query = supabase.from(table).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    
    if (options?.single) {
      const result = await query.single();
      // We need to explicitly cast here due to TypeScript limitations
      return result as unknown as PostgrestResponse<
        T extends 'directory_items' 
          ? Database['public']['Tables']['directory_items']['Row'][] 
          : T extends 'profiles' 
            ? Database['public']['Tables']['profiles']['Row'][] 
            : Database['public']['Tables']['user_settings']['Row'][]
      >;
    }
    
    return await query as unknown as PostgrestResponse<
      T extends 'directory_items' 
        ? Database['public']['Tables']['directory_items']['Row'][] 
        : T extends 'profiles' 
          ? Database['public']['Tables']['profiles']['Row'][] 
          : Database['public']['Tables']['user_settings']['Row'][]
    >;
  },
  
  /**
   * Insert data into a table
   */
  insert: async <T extends TableNames>(
    table: T, 
    data: T extends 'directory_items' 
      ? Database['public']['Tables']['directory_items']['Insert']
      : T extends 'profiles' 
        ? Database['public']['Tables']['profiles']['Insert']
        : Database['public']['Tables']['user_settings']['Insert'],
    options?: { 
      returning?: boolean 
    }
  ): Promise<
    PostgrestResponse<
      T extends 'directory_items' 
        ? Database['public']['Tables']['directory_items']['Row']
        : T extends 'profiles' 
          ? Database['public']['Tables']['profiles']['Row']
          : Database['public']['Tables']['user_settings']['Row']
    >
  > {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      const result = await query.select('*').single();
      return result as unknown as PostgrestResponse<
        T extends 'directory_items' 
          ? Database['public']['Tables']['directory_items']['Row']
          : T extends 'profiles' 
            ? Database['public']['Tables']['profiles']['Row']
            : Database['public']['Tables']['user_settings']['Row']
      >;
    }
    
    return await query as unknown as PostgrestResponse<null>;
  },
  
  /**
   * Update data in a table
   */
  update: async <T extends TableNames>(
    table: T,
    id: string, 
    data: T extends 'directory_items' 
      ? Database['public']['Tables']['directory_items']['Update']
      : T extends 'profiles' 
        ? Database['public']['Tables']['profiles']['Update']
        : Database['public']['Tables']['user_settings']['Update'],
    options?: { 
      returning?: boolean,
      idField?: string 
    }
  ): Promise<
    PostgrestResponse<
      T extends 'directory_items' 
        ? Database['public']['Tables']['directory_items']['Row']
        : T extends 'profiles' 
          ? Database['public']['Tables']['profiles']['Row']
          : Database['public']['Tables']['user_settings']['Row']
    >
  > {
    const idField = options?.idField || 'id';
    const query = supabase.from(table).update(data).eq(idField, id);
    
    if (options?.returning !== false) {
      const result = await query.select('*').single();
      return result as unknown as PostgrestResponse<
        T extends 'directory_items' 
          ? Database['public']['Tables']['directory_items']['Row']
          : T extends 'profiles' 
            ? Database['public']['Tables']['profiles']['Row']
            : Database['public']['Tables']['user_settings']['Row']
      >;
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
  ): Promise<PostgrestResponse<null>> {
    const idField = options?.idField || 'id';
    return await supabase.from(table).delete().eq(idField, id) as unknown as PostgrestResponse<null>;
  },

  /**
   * Bulk insert data into a table
   */
  bulkInsert: async <T extends TableNames>(
    table: T,
    data: T extends 'directory_items' 
      ? Database['public']['Tables']['directory_items']['Insert'][]
      : T extends 'profiles' 
        ? Database['public']['Tables']['profiles']['Insert'][]
        : Database['public']['Tables']['user_settings']['Insert'][],
    options?: {
      returning?: boolean
    }
  ): Promise<
    PostgrestResponse<
      T extends 'directory_items' 
        ? Database['public']['Tables']['directory_items']['Row'][]
        : T extends 'profiles' 
          ? Database['public']['Tables']['profiles']['Row'][]
          : Database['public']['Tables']['user_settings']['Row'][]
    >
  > {
    const query = supabase.from(table).insert(data);
    
    if (options?.returning !== false) {
      const result = await query.select('*');
      return result as unknown as PostgrestResponse<
        T extends 'directory_items' 
          ? Database['public']['Tables']['directory_items']['Row'][]
          : T extends 'profiles' 
            ? Database['public']['Tables']['profiles']['Row'][]
            : Database['public']['Tables']['user_settings']['Row'][]
      >;
    }
    
    return await query as unknown as PostgrestResponse<null>;
  }
};
