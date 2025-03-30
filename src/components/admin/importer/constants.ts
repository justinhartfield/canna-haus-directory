
// Schema type options
export const SCHEMA_TYPE_OPTIONS = [
  'Thing', 'Product', 'Event', 'Organization', 'Person', 'Place',
  'CreativeWork', 'Article', 'MedicalEntity', 'Drug', 'Store'
];

// Default category options
export const DEFAULT_CATEGORIES = [
  'Strains', 'Medical', 'Extraction', 'Cultivation',
  'Dispensaries', 'Lab Data', 'Compliance', 'Products', 'Educational'
];

// Available target fields for mapping
export const AVAILABLE_TARGET_FIELDS = [
  { value: 'title', label: 'Title' },
  { value: 'description', label: 'Description' },
  { value: 'subcategory', label: 'Subcategory' },
  { value: 'tags', label: 'Tags' },
  { value: 'imageUrl', label: 'Image URL' },
  { value: 'thumbnailUrl', label: 'Thumbnail URL' },
  { value: 'metaData', label: 'Meta Data' }
];
