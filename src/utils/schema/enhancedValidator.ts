
import { validateSchemaData } from './schemaValidator';
import { enhanceJsonLd as baseEnhanceJsonLd } from './jsonLdEnhancer';

/**
 * Enhance JSON-LD data to match schema.org requirements
 * (Wrapper that integrates with the template system)
 */
export function enhanceJsonLd(
  data: Record<string, any>,
  schemaType: string
): Record<string, any> {
  // Import needed here to prevent circular dependency
  const { getSchemaTemplate } = require('../folder/schemaTemplates');
  const template = getSchemaTemplate(schemaType);
  
  return baseEnhanceJsonLd(data, schemaType, template);
}
