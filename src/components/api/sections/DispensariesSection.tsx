
import React from 'react';
import ApiExample from '@/components/ApiExample';

const DispensariesSection: React.FC = () => {
  const dispensaryGetExample = `{
  "@context": "https://schema.org",
  "@type": "Store",
  "id": "disp-123",
  "name": "Green Wellness Dispensary",
  "description": "Premier medical and recreational cannabis dispensary...",
  "storeType": ["Medical", "Recreational"],
  "address": {
    "streetAddress": "123 Cannabis Blvd",
    "addressLocality": "Portland",
    "addressRegion": "OR",
    "postalCode": "97205",
    "addressCountry": "US"
  },
  "geo": {
    "latitude": 45.5231,
    "longitude": -122.6765
  },
  "telephone": "+15035551234",
  "openingHours": "Mo-Fr 09:00-21:00, Sa-Su 10:00-19:00",
  "paymentAccepted": ["Cash", "Debit Card", "ACH Transfer"],
  "priceRange": "$$",
  "accessibility": {
    "wheelchairAccessible": true,
    "petFriendly": false,
    "parking": "On-site parking available",
    "additionalAccommodations": "Audio menus, ASL staff available on weekends"
  },
  "delivery": {
    "available": true,
    "minimumOrder": 50,
    "estimatedTime": "45-60 min",
    "deliveryRadius": "15 miles",
    "schedulingOptions": "Same-day and pre-scheduled available"
  },
  "promotions": [
    {
      "name": "First-Time Patient Discount",
      "description": "20% off first purchase for new medical patients",
      "validThrough": "2023-12-31"
    },
    {
      "name": "Senior Sundays",
      "description": "15% off for seniors 65+ every Sunday",
      "validThrough": "2023-12-31"
    }
  ],
  "rating": {
    "ratingValue": 4.7,
    "reviewCount": 312
  }
}`;

  const dispensariesListExample = `{
  "total": 157,
  "page": 1,
  "perPage": 10,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "Store",
      "id": "disp-123",
      "name": "Green Wellness Dispensary",
      "storeType": ["Medical", "Recreational"],
      "address": {
        "addressLocality": "Portland",
        "addressRegion": "OR"
      },
      "rating": {
        "ratingValue": 4.7,
        "reviewCount": 312
      },
      "delivery": {
        "available": true
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Store",
      "id": "disp-124",
      "name": "Emerald City Cannabis",
      "storeType": ["Recreational"],
      "address": {
        "addressLocality": "Seattle",
        "addressRegion": "WA"
      },
      "rating": {
        "ratingValue": 4.5,
        "reviewCount": 287
      },
      "delivery": {
        "available": false
      }
    }
    // ... more items
  ]
}`;

  const inventoryExample = `{
  "dispensaryId": "disp-123",
  "updatedAt": "2023-07-22T14:03:27Z",
  "products": [
    {
      "id": "prod-456",
      "name": "Blue Dream",
      "category": "Flower",
      "strain": "strain-123",
      "thcContent": "18-24%",
      "cbdContent": "0.1-0.2%",
      "weight": "3.5g",
      "price": 45.00,
      "discountedPrice": 40.50,
      "inStock": true,
      "stockLevel": "High"
    },
    {
      "id": "prod-457",
      "name": "Sour Diesel Vape Cartridge",
      "category": "Vape",
      "strain": "strain-145",
      "thcContent": "85-90%",
      "cbdContent": "0.5-1%",
      "weight": "1g",
      "price": 60.00,
      "discountedPrice": null,
      "inStock": true,
      "stockLevel": "Low"
    }
    // ... more items
  ]
}`;

  return (
    <section id="dispensaries" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Dispensaries & Retailers API</h2>
      <p className="mb-6">
        Access comprehensive data on cannabis dispensaries and retailers, including location details, inventory, 
        pricing, delivery options, and accessibility features.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/dispensaries/{id}"
          method="GET"
          description="Retrieve detailed information about a specific dispensary by ID."
          responseExample={dispensaryGetExample}
        />
        
        <ApiExample
          endpoint="/dispensaries"
          method="GET"
          description="List dispensaries with pagination and filtering options."
          responseExample={dispensariesListExample}
        />
        
        <ApiExample
          endpoint="/dispensaries/{id}/inventory"
          method="GET"
          description="Get the current product inventory for a specific dispensary."
          responseExample={inventoryExample}
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Query Parameters</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Parameter</th>
              <th className="py-2 px-4 text-left font-semibold">Type</th>
              <th className="py-2 px-4 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>location</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Filter by city, state, or zip code</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>radius</code></td>
              <td className="py-3 px-4">Number</td>
              <td className="py-3 px-4">Search radius in miles from specified coordinates</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>storeType</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Filter by store type (Medical, Recreational, Both)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>delivery</code></td>
              <td className="py-3 px-4">Boolean</td>
              <td className="py-3 px-4">Filter by delivery availability</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>minRating</code></td>
              <td className="py-3 px-4">Number</td>
              <td className="py-3 px-4">Minimum rating threshold (1-5)</td>
            </tr>
            <tr>
              <td className="py-3 px-4"><code>product</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Filter by product availability</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DispensariesSection;
