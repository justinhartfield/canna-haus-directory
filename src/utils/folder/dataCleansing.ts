
/**
 * Apply data cleansing procedures to raw data
 * 
 * Note: This is now a re-export of the main cleanseData function in folderProcessingUtils
 * to maintain compatibility with existing code.
 */
import { cleanseData as cleanseDataFn, cleansingFunctions as cleansingFunctionsFn } from '../folderProcessingUtils';

export const cleanseData = cleanseDataFn;
export const cleansingFunctions = cleansingFunctionsFn;
