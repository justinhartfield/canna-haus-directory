
/**
 * Helper function to normalize string values
 */
export function normalizeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Helper function to normalize numeric values
 */
export function normalizeNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Helper function to normalize boolean values
 */
export function normalizeBoolean(value: any): boolean | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (['true', 'yes', 'y', '1'].includes(lowercased)) return true;
    if (['false', 'no', 'n', '0'].includes(lowercased)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return null;
}
