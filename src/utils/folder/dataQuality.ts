
/**
 * Generate a data consistency report for the given dataset
 */
export function generateDataConsistencyReport(data: Record<string, any>[]): {
  fields: Record<string, {
    presentCount: number;
    missingCount: number;
    uniqueValues: number;
    completeness: number;
    dataType: string;
    examples: any[];
  }>;
  totalRecords: number;
  overallCompleteness: number;
} {
  if (!data || data.length === 0) {
    return {
      fields: {},
      totalRecords: 0,
      overallCompleteness: 0
    };
  }
  
  const totalRecords = data.length;
  const fields: Record<string, {
    presentCount: number;
    missingCount: number;
    uniqueValues: number;
    completeness: number;
    dataType: string;
    examples: any[];
  }> = {};
  
  // Find all unique fields across all records
  const allFields = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => allFields.add(key));
  });
  
  // Initialize stats for each field
  allFields.forEach(field => {
    fields[field] = {
      presentCount: 0,
      missingCount: 0,
      uniqueValues: 0,
      completeness: 0,
      dataType: 'unknown',
      examples: []
    };
  });
  
  // Count occurrences of each field
  data.forEach(item => {
    allFields.forEach(field => {
      const value = item[field];
      
      if (value !== undefined && value !== null && value !== '') {
        fields[field].presentCount += 1;
        
        // Determine data type
        if (fields[field].dataType === 'unknown') {
          if (Array.isArray(value)) {
            fields[field].dataType = 'array';
          } else if (typeof value === 'object') {
            fields[field].dataType = 'object';
          } else {
            fields[field].dataType = typeof value;
          }
        }
        
        // Store examples (max 3)
        if (fields[field].examples.length < 3 && value !== undefined) {
          fields[field].examples.push(value);
        }
      } else {
        fields[field].missingCount += 1;
      }
    });
  });
  
  // Count unique values for each field
  data.forEach(item => {
    allFields.forEach(field => {
      const uniqueValues = new Set(data.map(item => item[field]));
      fields[field].uniqueValues = uniqueValues.size;
    });
  });
  
  // Calculate completeness for each field
  allFields.forEach(field => {
    fields[field].completeness = (fields[field].presentCount / totalRecords) * 100;
  });
  
  // Calculate overall completeness
  let totalPresent = 0;
  let totalPossible = 0;
  
  allFields.forEach(field => {
    totalPresent += fields[field].presentCount;
    totalPossible += totalRecords;
  });
  
  const overallCompleteness = (totalPresent / totalPossible) * 100;
  
  return {
    fields,
    totalRecords,
    overallCompleteness
  };
}
