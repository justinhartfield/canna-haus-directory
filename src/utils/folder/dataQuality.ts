
/**
 * Generate consistency report for processed data
 */
export function generateDataConsistencyReport(
  data: Record<string, any>[],
  requiredFields: string[]
): {
  missingFields: Record<string, number>;
  emptyValues: Record<string, number>;
  totalItems: number;
  completeItems: number;
  incompleteItems: number;
} {
  const missingFields: Record<string, number> = {};
  const emptyValues: Record<string, number> = {};
  let completeItems = 0;
  
  for (const item of data) {
    let isComplete = true;
    
    for (const field of requiredFields) {
      if (!(field in item)) {
        missingFields[field] = (missingFields[field] || 0) + 1;
        isComplete = false;
      } else if (item[field] === '' || item[field] === null || item[field] === undefined) {
        emptyValues[field] = (emptyValues[field] || 0) + 1;
        isComplete = false;
      }
    }
    
    if (isComplete) {
      completeItems++;
    }
  }
  
  return {
    missingFields,
    emptyValues,
    totalItems: data.length,
    completeItems,
    incompleteItems: data.length - completeItems
  };
}
