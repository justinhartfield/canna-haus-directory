
/**
 * Schema templates for common data types following schema.org specifications
 */
export const schemaTemplates = {
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "",
    "description": "",
    "image": "",
    "brand": {
      "@type": "Brand",
      "name": ""
    },
    "offers": {
      "@type": "Offer",
      "price": "",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  },
  
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "",
    "description": "",
    "image": "",
    "datePublished": "",
    "author": {
      "@type": "Person",
      "name": ""
    }
  },
  
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "",
    "description": "",
    "url": "",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "email": "",
      "contactType": "Customer Service"
    }
  },
  
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "",
    "description": "",
    "image": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "",
      "addressRegion": "",
      "postalCode": "",
      "addressCountry": "US"
    },
    "telephone": "",
    "openingHours": ""
  },
  
  Person: {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "",
    "description": "",
    "image": "",
    "jobTitle": "",
    "affiliation": {
      "@type": "Organization",
      "name": ""
    }
  },
  
  MedicalEntity: {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    "name": "",
    "description": "",
    "code": {
      "@type": "MedicalCode",
      "codeValue": "",
      "codingSystem": ""
    }
  },
  
  Drug: {
    "@context": "https://schema.org",
    "@type": "Drug",
    "name": "",
    "description": "",
    "activeIngredient": "",
    "administrationRoute": "",
    "nonProprietaryName": "",
    "drugClass": ""
  }
};

/**
 * Get a schema template for a specific schema type
 */
export function getSchemaTemplate(schemaType: string): Record<string, any> {
  return schemaTemplates[schemaType] || schemaTemplates.Product;
}
