
/**
 * Helper function to get a nested property from an object using a dot-notation path
 */
export function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}
