
/**
 * Enhance JSON-LD data to match schema.org requirements
 */
export function enhanceJsonLd(
  data: Record<string, any>,
  schemaType: string,
  template: Record<string, any>
): Record<string, any> {
  // Start with the context and type
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType
  };
  
  // Map common fields first
  if (data.title) jsonLd['name'] = data.title;
  if (data.description) jsonLd['description'] = data.description;
  if (data.imageUrl) jsonLd['image'] = data.imageUrl;
  
  // Add custom fields from the source data
  for (const [key, value] of Object.entries(data)) {
    // Skip fields we've already mapped
    if (['title', 'description', 'imageUrl', 'category', 'subcategory', 'tags'].includes(key)) {
      continue;
    }
    
    // Skip null/undefined values
    if (value === null || value === undefined) {
      continue;
    }
    
    // Convert to camelCase if needed
    const formattedKey = key
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part, index) => 
        index === 0 
          ? part.toLowerCase() 
          : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join('');
    
    // Add to the JSON-LD
    jsonLd[formattedKey] = value;
  }
  
  return jsonLd;
}
