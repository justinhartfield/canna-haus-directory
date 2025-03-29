
import React from 'react';
import ApiExample from '@/components/ApiExample';
import { Link } from 'react-router-dom';

const ApiSection: React.FC = () => {
  // Sample API response for example
  const apiResponseExample = `{
  "@context": "https://schema.org",
  "@type": "Product",
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

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
            API-First Approach
          </span>
          <h2 className="text-3xl font-bold mb-4">Designed for Integration</h2>
          <p className="text-muted-foreground">
            Our RESTful API provides structured cannabis data that's perfect for AI systems, researchers, and developers.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <ApiExample
            endpoint="/api/strains/{id}"
            method="GET"
            description="Retrieve detailed information about a specific cannabis strain including genetics, effects, and medical applications."
            responseExample={apiResponseExample}
          />
          
          <div className="mt-10 text-center">
            <Link
              to="/api-docs"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
              bg-cannabis-600 text-white hover:bg-cannabis-700 h-10 px-8 py-2"
            >
              Explore API Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
