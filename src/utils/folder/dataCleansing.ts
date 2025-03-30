
/**
 * Apply data cleansing procedures to raw data
 */
export function cleanseData(data: Record<string, any>[], options?: {
  normalizeText?: boolean;
  capitalizeNames?: boolean;
  trimWhitespace?: boolean;
  convertToLowerCase?: string[];
  convertToUpperCase?: string[];
}): Record<string, any>[] {
  const opts = {
    normalizeText: true,
    capitalizeNames: true,
    trimWhitespace: true,
    convertToLowerCase: ['tags', 'category'],
    convertToUpperCase: ['code', 'id'],
    ...options
  };

  return data.map(item => {
    const result = { ...item };
    
    // Process each field based on options
    Object.entries(result).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Trim whitespace
        if (opts.trimWhitespace) {
          value = value.trim();
        }
        
        // Capitalize names
        if (opts.capitalizeNames && 
            (key.includes('name') || key.includes('title') || key === 'title')) {
          value = value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        // Convert to lowercase for specific fields
        if (opts.convertToLowerCase?.includes(key)) {
          value = value.toLowerCase();
        }
        
        // Convert to uppercase for specific fields
        if (opts.convertToUpperCase?.includes(key)) {
          value = value.toUpperCase();
        }
        
        result[key] = value;
      }
    });
    
    return result;
  });
}

/**
 * Collection of data cleansing functions
 */
export const cleansingFunctions = {
  normalizeText: (text: string) => text.trim(),
  capitalizeFirstLetter: (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  extractNumbers: (text: string) => {
    const matches = text.match(/\d+(\.\d+)?/g);
    return matches ? matches.join('') : '';
  },
  formatPhoneNumber: (phone: string) => {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone;
  },
  formatCurrency: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) ? `$${num.toFixed(2)}` : `$0.00`;
  }
};
