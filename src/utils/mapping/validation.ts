
/**
 * Validate that a required field exists
 */
export function validateRequiredField(value: any, fieldName: string, rowIndex: number): string {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required field '${fieldName}' at row ${rowIndex + 1}`);
  }
  return String(value);
}
