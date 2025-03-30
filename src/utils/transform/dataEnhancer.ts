
/**
 * Enhances raw data by adding placeholders for missing mapped columns
 */
export function enhanceRawItemWithPlaceholders(
  rawItem: Record<string, any>,
  missingColumnsMap: Map<string, string>
): Record<string, any> {
  // Create a copy of the raw item
  const enhancedRawItem = { ...rawItem };
  
  // For each missing column that maps to an additional field, add a placeholder
  missingColumnsMap.forEach((targetField, sourceField) => {
    if (!enhancedRawItem[sourceField]) {
      // Add an empty placeholder for the missing field
      // This ensures the field is created in the output
      enhancedRawItem[sourceField] = '';
      console.log(`Adding placeholder for missing field: ${sourceField} -> ${targetField}`);
    }
  });
  
  return enhancedRawItem;
}
