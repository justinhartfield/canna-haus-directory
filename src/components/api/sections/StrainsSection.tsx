
import React from 'react';
import ApiExample from '@/components/ApiExample';

const StrainsSection: React.FC = () => {
  const strainsGetExample = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "id": "strain-123",
  "name": "Blue Dream",
  "description": "A sativa-dominant hybrid strain...",
  "category": "Sativa-dominant Hybrid",
  "geneticLineage": {
    "parent1": "Blueberry Indica",
    "parent2": "Haze Sativa"
  },
  "thcContent": "18-24%",
  "cbdContent": "0.1-0.2%",
  "dominantTerpenes": ["Myrcene", "Pinene", "Caryophyllene"],
  "effects": ["Relaxed", "Creative", "Euphoric", "Happy"],
  "medicalUses": ["Stress", "Depression", "Pain", "Headaches"],
  "flavorProfile": ["Blueberry", "Sweet", "Berry", "Herbal"],
  "cultivationDifficulty": "Moderate"
}`;

  const strainsListExample = `{
  "total": 245,
  "page": 1,
  "perPage": 10,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-123",
      "name": "Blue Dream",
      "description": "A sativa-dominant hybrid strain...",
      "category": "Sativa-dominant Hybrid",
      "thcContent": "18-24%",
      "cbdContent": "0.1-0.2%",
      "effects": ["Relaxed", "Creative", "Euphoric", "Happy"]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-124",
      "name": "OG Kush",
      "description": "A potent hybrid strain...",
      "category": "Hybrid",
      "thcContent": "20-26%",
      "cbdContent": "0.1-0.3%",
      "effects": ["Euphoric", "Relaxed", "Happy", "Uplifted"]
    },
    // ... more items
  ]
}`;

  return (
    <section id="strains" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Strains API</h2>
      <p className="mb-6">
        Access our comprehensive database of cannabis strains with detailed information on genetics, effects, medical applications, and more.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/strains/{id}"
          method="GET"
          description="Retrieve detailed information about a specific cannabis strain by ID."
          responseExample={strainsGetExample}
        />
        
        <ApiExample
          endpoint="/strains"
          method="GET"
          description="List cannabis strains with pagination and filtering options."
          responseExample={strainsListExample}
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
              <td className="py-3 px-4"><code>page</code></td>
              <td className="py-3 px-4">Integer</td>
              <td className="py-3 px-4">Page number for pagination (default: 1)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>perPage</code></td>
              <td className="py-3 px-4">Integer</td>
              <td className="py-3 px-4">Number of results per page (default: 20, max: 100)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>sort</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Field to sort by (e.g., name, thcContent, popularity)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>order</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Sort order (asc, desc)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4"><code>category</code></td>
              <td className="py-3 px-4">String</td>
              <td className="py-3 px-4">Filter by category (Indica, Sativa, Hybrid, CBD-Dominant)</td>
            </tr>
            <tr>
              <td className="py-3 px-4"><code>effects</code></td>
              <td className="py-3 px-4">Array</td>
              <td className="py-3 px-4">Filter by effects (comma-separated list)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StrainsSection;
