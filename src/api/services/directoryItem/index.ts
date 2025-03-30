
/**
 * Main export file for all directory item related functionality
 */

// Export CRUD operations
export * from './crudOperations';

// Export bulk operations
export * from './bulkOperations';

// Export duplicate checking utilities
// Explicitly re-export to avoid ambiguity
export { 
  checkBatchForDuplicates,
  checkForDuplicate,
  processBatchWithDuplicateHandling
} from './bulkOperations';
