
/**
 * Data cleansing functions for batch processing
 */
export const dataCleansingFunctions = {
  trimWhitespace: (value: string): string => 
    typeof value === 'string' ? value.trim() : String(value || ''),
  
  capitalizeFirst: (value: string): string =>
    typeof value === 'string' 
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() 
      : String(value || ''),
  
  normalizeUrl: (value: string): string => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.href;
    } catch {
      if (value.match(/^www\./)) {
        return `https://${value}`;
      }
      if (!value.match(/^https?:\/\//)) {
        return `https://${value}`;
      }
      return value;
    }
  },
  
  sanitizeHtml: (value: string): string =>
    typeof value === 'string' 
      ? value.replace(/<[^>]*>/g, '') 
      : String(value || '')
};

/**
 * Apply data cleansing functions to a batch of data
 */
export function applyDataCleansing(
  data: Record<string, any>[],
  cleansingConfig: Record<string, (value: any) => any>
): Record<string, any>[] {
  return data.map(item => {
    const cleansedItem = { ...item };
    
    for (const [field, cleanseFn] of Object.entries(cleansingConfig)) {
      if (field in cleansedItem) {
        cleansedItem[field] = cleanseFn(cleansedItem[field]);
      }
    }
    
    return cleansedItem;
  });
}
