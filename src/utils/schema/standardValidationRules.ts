
import type { SchemaValidationRules } from './validationTypes';

/**
 * Standard validation rule sets for schema.org types
 */
export const standardValidationRules: Record<string, SchemaValidationRules> = {
  Product: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'brand.name': { type: 'string', allowEmpty: true },
    'offers.price': { type: 'string', allowEmpty: true },
    'offers.priceCurrency': { type: 'string', enum: ['USD', 'EUR', 'GBP', 'CAD'], allowEmpty: true }
  },
  
  Article: {
    'headline': { required: true, type: 'string', minLength: 5, maxLength: 110 },
    'description': { required: true, type: 'string', minLength: 10 },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'datePublished': { type: 'string', format: 'date', allowEmpty: true },
    'author.name': { type: 'string', allowEmpty: false }
  },
  
  Person: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'jobTitle': { type: 'string', allowEmpty: true },
    'affiliation.name': { type: 'string', allowEmpty: true }
  },
  
  Organization: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'url': { type: 'string', format: 'url', allowEmpty: true },
    'logo': { type: 'string', format: 'url', allowEmpty: true },
    'contactPoint.telephone': { type: 'string', allowEmpty: true },
    'contactPoint.email': { type: 'string', format: 'email', allowEmpty: true }
  },
  
  LocalBusiness: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { type: 'string', allowEmpty: true },
    'image': { type: 'string', format: 'url', allowEmpty: true },
    'address.streetAddress': { type: 'string', allowEmpty: true },
    'address.addressLocality': { type: 'string', allowEmpty: true },
    'address.addressRegion': { type: 'string', allowEmpty: true },
    'address.postalCode': { type: 'string', allowEmpty: true },
    'telephone': { type: 'string', allowEmpty: true }
  },
  
  MedicalEntity: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'code.codeValue': { type: 'string', allowEmpty: true },
    'code.codingSystem': { type: 'string', allowEmpty: true }
  },
  
  Drug: {
    'name': { required: true, type: 'string', minLength: 2 },
    'description': { required: true, type: 'string', minLength: 10 },
    'activeIngredient': { type: 'string', allowEmpty: true },
    'administrationRoute': { type: 'string', allowEmpty: true },
    'nonProprietaryName': { type: 'string', allowEmpty: true },
    'drugClass': { type: 'string', allowEmpty: true }
  }
};

/**
 * Get a validation rule set for a specific schema type
 */
export function getValidationRules(schemaType: string): SchemaValidationRules {
  return standardValidationRules[schemaType] || standardValidationRules.Product;
}
