
import React from 'react';
import { JsonLdDisplay } from '@/components/directory/JsonLdDisplay';

const SchemaSection: React.FC = () => {
  const schemaExample = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cannabis Strain Schema",
    "description": "Standardized schema for cannabis strain data",
    "properties": [
      {
        "name": "name",
        "type": "Text",
        "description": "Name of the cannabis strain"
      },
      {
        "name": "alternateNames",
        "type": "Text[]",
        "description": "Alternative names for the strain"
      },
      {
        "name": "category",
        "type": "Text",
        "description": "Indica, Sativa, Hybrid, or more specific categorization"
      },
      {
        "name": "cannabinoids",
        "type": "Object",
        "properties": [
          {
            "name": "thc",
            "type": "Number",
            "description": "THC content percentage range"
          },
          {
            "name": "cbd",
            "type": "Number",
            "description": "CBD content percentage range"
          }
        ]
      },
      {
        "name": "terpenes",
        "type": "Object[]",
        "properties": [
          {
            "name": "name",
            "type": "Text",
            "description": "Name of the terpene"
          },
          {
            "name": "percentage",
            "type": "Number",
            "description": "Percentage of the terpene"
          }
        ]
      },
      {
        "name": "effects",
        "type": "Text[]",
        "description": "Reported effects of the strain"
      },
      {
        "name": "medicalApplications",
        "type": "Text[]",
        "description": "Medical conditions this strain may help with"
      },
      {
        "name": "flavorProfile",
        "type": "Text[]",
        "description": "Flavor descriptors"
      },
      {
        "name": "growDifficulty",
        "type": "Text",
        "description": "Difficulty level for growing this strain"
      },
      {
        "name": "growingConditions",
        "type": "Object",
        "properties": [
          {
            "name": "indoor",
            "type": "Boolean",
            "description": "Suitable for indoor growing"
          },
          {
            "name": "outdoor",
            "type": "Boolean",
            "description": "Suitable for outdoor growing"
          },
          {
            "name": "floweringTime",
            "type": "Text",
            "description": "Typical flowering time"
          },
          {
            "name": "height",
            "type": "Text",
            "description": "Typical height range of the plant"
          },
          {
            "name": "yield",
            "type": "Text",
            "description": "Expected yield range"
          }
        ]
      }
    ]
  };

  return (
    <section id="schema" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Data Schema</h2>
      <p className="mb-6">
        Our API follows standardized schema.org-compatible JSON-LD schemas for all data types. 
        Below is a reference for our core data schemas.
      </p>

      <div className="glass-card p-6 mb-8 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Schema Structure</h3>
        <p className="mb-4">
          All resource objects in the CannaHaus API follow a standardized structure to make integration and AI consumption easier:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Every object includes <code className="bg-secondary/50 px-1 py-0.5 rounded">@context</code> and <code className="bg-secondary/50 px-1 py-0.5 rounded">@type</code> fields for JSON-LD compatibility</li>
          <li>Properties use consistent naming conventions across all resources</li>
          <li>Nested objects are used for complex property groups</li>
          <li>Arrays are used for multiple values of the same type</li>
          <li>Timestamps follow ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)</li>
        </ul>
      </div>

      <JsonLdDisplay jsonLd={schemaExample} />
    </section>
  );
};

export default SchemaSection;
