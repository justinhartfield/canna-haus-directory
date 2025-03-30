
/**
 * Apply data cleansing procedures to raw data
 */
export function cleanseData(
  data: Record<string, any>[],
  cleansingRules: Record<string, (value: any) => any>
): Record<string, any>[] {
  return data.map(item => {
    const cleansedItem = { ...item };
    
    for (const [field, cleanseFn] of Object.entries(cleansingRules)) {
      if (field in cleansedItem) {
        cleansedItem[field] = cleanseFn(cleansedItem[field]);
      }
    }
    
    return cleansedItem;
  });
}

/**
 * Common data cleansing functions for different data types
 */
export const cleansingFunctions = {
  trimText: (value: string): string => 
    typeof value === 'string' ? value.trim() : String(value || ''),
  
  normalizeCase: (value: string): string =>
    typeof value === 'string' 
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() 
      : String(value || ''),
  
  removeHtml: (value: string): string =>
    typeof value === 'string' 
      ? value.replace(/<[^>]*>/g, '') 
      : String(value || ''),
  
  normalizeUrl: (value: string): string => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.href;
    } catch {
      // If not a valid URL, try to fix common issues
      if (value.match(/^www\./)) {
        return `https://${value}`;
      }
      if (!value.match(/^https?:\/\//)) {
        return `https://${value}`;
      }
      return value;
    }
  },
  
  normalizePhone: (value: string): string => {
    if (!value) return '';
    // Remove non-digit characters
    return value.replace(/\D/g, '');
  }
};
