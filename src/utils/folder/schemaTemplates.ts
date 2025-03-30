
/**
 * Predefined schema templates for different entity types
 */
export const schemaTemplates = {
  Product: {
    '@type': 'Product',
    name: '',
    description: '',
    image: '',
    brand: {
      '@type': 'Brand',
      name: ''
    },
    offers: {
      '@type': 'Offer',
      price: '',
      priceCurrency: 'USD'
    }
  },
  
  LocalBusiness: {
    '@type': 'LocalBusiness',
    name: '',
    description: '',
    image: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US'
    },
    telephone: '',
    openingHours: ''
  },
  
  Person: {
    '@type': 'Person',
    name: '',
    description: '',
    image: '',
    jobTitle: '',
    worksFor: {
      '@type': 'Organization',
      name: ''
    }
  },
  
  Organization: {
    '@type': 'Organization',
    name: '',
    description: '',
    logo: '',
    url: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US'
    }
  },
  
  MedicalEntity: {
    '@type': 'MedicalEntity',
    name: '',
    description: '',
    medicineSystem: '',
    relevantSpecialty: ''
  },
  
  Article: {
    '@type': 'Article',
    headline: '',
    description: '',
    image: '',
    datePublished: '',
    author: {
      '@type': 'Person',
      name: ''
    }
  },
  
  Event: {
    '@type': 'Event',
    name: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    location: {
      '@type': 'Place',
      name: '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: 'US'
      }
    }
  },
  
  Drug: {
    '@type': 'Drug',
    name: '',
    description: '',
    activeIngredient: '',
    administrationRoute: '',
    dosageForm: ''
  }
};
