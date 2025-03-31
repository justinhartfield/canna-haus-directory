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
      returning?: boolean,
      columns?: string[]  // Optional columns to include
    }
  ): Promise<PostgrestResponse<any>> => {
    // If specific columns are provided, filter the data
    let filteredData = data;
    if (options?.columns) {
      filteredData = {};
      for (const col of options.columns) {
        if (col in data) {
          filteredData[col] = data[col];
        }
      }
    }
    
    let query = supabase.from(table).insert(filteredData);
    
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
      idField?: string,
      columns?: string[]  // Optional columns to include
    }
  ): Promise<PostgrestResponse<any>> => {
    const idField = options?.idField || 'id';
    
    // If specific columns are provided, filter the data
    let filteredData = data;
    if (options?.columns) {
      filteredData = {};
      for (const col of options.columns) {
        if (col in data) {
          filteredData[col] = data[col];
        }
      }
    }
    
    // Use `any` cast to bypass TypeScript's strict checking on the eq() method
    const query = supabase.from(table).update(filteredData).eq(idField as any, id);
    
    // Log the update operation
    console.log(`Executing update on ${table} with id ${id}`, {
      fields: Object.keys(filteredData).join(', ')
    });
    
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
    // Use `any` cast to bypass TypeScript's strict checking on the eq() method
    return await supabase.from(table).delete().eq(idField as any, id);
  },

  /**
   * Bulk insert data into a table
   */
  bulkInsert: async <T extends TableNames>(
    table: T,
    data: any[],
    options?: {
      returning?: boolean,
      columns?: string[] // Optional columns to include
    }
  ): Promise<PostgrestResponse<any>> => {
    if (data.length === 0) {
      return { data: [], error: null, count: null, status: 200, statusText: 'OK' };
    }
    
    // If specific columns are provided, filter each data item
    let processedData = data;
    if (options?.columns) {
      processedData = data.map(item => {
        const filtered: any = {};
        for (const col of options.columns!) {
          if (col in item) {
            filtered[col] = item[col];
          }
        }
        return filtered;
      });
    }
    
    // Enhanced error handling for bulk inserts
    try {
      let query = supabase.from(table).insert(processedData);
      
      if (options?.returning !== false) {
        return await query.select();
      }
      
      return await query;
    } catch (error) {
      console.error('Error in bulkInsert:', error);
      
      // Check if it's a specific error that we can handle
      if (error instanceof Error && 
          error.message.includes("Could not find") && 
          error.message.includes("column")) {
        
        // Fall back to safer columns
        console.warn('Attempting fallback with only core columns');
        const safeColumns = ['title', 'description', 'category', 'subcategory', 'tags', 'jsonLd', 'metaData'];
        
        const safeData = data.map(item => {
          const safeItem: any = {};
          for (const key of safeColumns) {
            if (key in item) {
              safeItem[key] = item[key];
            }
          }
          return safeItem;
        });
        
        let retryQuery = supabase.from(table).insert(safeData);
        
        if (options?.returning !== false) {
          return await retryQuery.select();
        }
        
        return await retryQuery;
      }
      
      // Re-throw if we can't handle it
      throw error;
    }
  }
};
