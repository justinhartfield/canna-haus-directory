
import { DirectoryItem } from './directory';

export type DuplicateAction = 'merge' | 'variant' | 'keep';

export interface DuplicateGroup {
  primaryRecord: DirectoryItem;
  duplicates: DirectoryItem[];
  selectedDuplicates: string[];
  action: DuplicateAction;
}

export interface ProcessingResults {
  processed: number;
  merged: number;
  variants: number;
  kept: number;
  errors: string[];
}
