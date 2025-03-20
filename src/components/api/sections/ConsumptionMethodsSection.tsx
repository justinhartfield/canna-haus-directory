
import React from 'react';
import ApiExample from '@/components/ApiExample';

const ConsumptionMethodsSection: React.FC = () => {
  const methodGetExample = `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "id": "method-123",
  "name": "Vaporization",
  "description": "Cannabis vaporization heats the material to a temperature that releases cannabinoids and terpenes as vapor without combustion.",
  "category": "Inhalation",
  "prosAndCons": {
    "pros": [
      "Less harmful to lungs than smoking",
      "More efficient cannabinoid extraction",
      "Better flavor preservation",
      "Less odor than smoking",
      "More precise temperature control"
    ],
    "cons": [
      "Higher upfront cost for quality equipment",
      "Requires technical knowledge",
      "Regular maintenance and cleaning required",
      "Battery life limitations for portable devices"
    ]
  },
  "recommendedDosage": {
    "beginners": "1-2 small inhalations, waiting 10-15 minutes between doses",
    "intermediate": "3-5 inhalations per session",
    "experienced": "Personal discretion based on tolerance"
  },
  "onset": {
    "initialEffects": "30 seconds to 2 minutes",
    "peakEffects": "10-30 minutes",
    "duration": "1-3 hours",
    "influencingFactors": ["Temperature setting", "Material quality", "Individual metabolism"]
  },
  "requiredEquipment": [
    {
      "name": "Dry Herb Vaporizer",
      "description": "Device specifically designed for vaporizing cannabis flower",
      "suggestedBrands": ["Storz & Bickel Volcano", "PAX", "Arizer", "DynaVap"]
    },
    {
      "name": "Concentrate Vaporizer",
      "description": "Device designed for cannabis extracts and concentrates",
      "suggestedBrands": ["Puffco Peak", "Dr. Dabber", "Kandypens"]
    }
  ],
  "bestPractices": [
    "Start with a lower temperature (355°F/180°C) for more flavorful terpenes",
    "Increase temperature (390°F/200°C+) to extract maximum cannabinoids",
    "Grind flower to medium consistency for optimal airflow",
    "Clean device regularly for best performance and flavor",
    "Store materials properly to maintain potency and prevent contamination"
  ],
  "safetyConsiderations": [
    "Purchase devices from reputable manufacturers to avoid harmful materials",
    "Avoid black market vape cartridges which may contain harmful additives",
    "Start with small doses until familiar with effects",
    "Do not use while driving or operating heavy machinery",
    "Keep equipment and materials away from children and pets"
  ],
  "userExperiences": [
    {
      "userType": "Medical patient",
      "condition": "Chronic pain",
      "experience": "Vaporizing at lower temperatures helps manage my pain while allowing me to remain functional throughout the day."
    },
    {
      "userType": "Recreational user",
      "experience": "I find the effects cleaner and clearer than smoking, with less negative impact on my athletic performance."
    }
  ]
}`;

  const methodsListExample = `{
  "total": 6,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "id": "method-123",
      "name": "Vaporization",
      "category": "Inhalation",
      "description": "Cannabis vaporization heats the material to a temperature that releases cannabinoids and terpenes as vapor without combustion.",
      "onset": {
        "initialEffects": "30 seconds to 2 minutes",
        "duration": "1-3 hours"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "id": "method-124",
      "name": "Edibles",
      "category": "Ingestion",
      "description": "Cannabis-infused foods and beverages that are metabolized through the digestive system.",
      "onset": {
        "initialEffects": "30 minutes to 2 hours",
        "duration": "4-8 hours"
      }
    },
    // ... more items
  ]
}`;

  return (
    <section id="consumption-methods" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Consumption Methods API</h2>
      <p className="mb-6">
        Access comprehensive data on various cannabis consumption methods, including details about their effects, 
        recommended usage, required equipment, and safety considerations.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/consumption-methods/{id}"
          method="GET"
          description="Retrieve detailed information about a specific consumption method by ID."
          responseExample={methodGetExample}
        />
        
        <ApiExample
          endpoint="/consumption-methods"
          method="GET"
          description="List all available consumption methods."
          responseExample={methodsListExample}
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Consumption Categories</h3>
        <p className="mb-4">The API categorizes consumption methods into several major types:</p>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Category</th>
              <th className="py-2 px-4 text-left font-semibold">Methods</th>
              <th className="py-2 px-4 text-left font-semibold">Key Characteristics</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Inhalation</td>
              <td className="py-3 px-4">Smoking, Vaporization</td>
              <td className="py-3 px-4">Rapid onset, shorter duration, efficient delivery</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Ingestion</td>
              <td className="py-3 px-4">Edibles, Capsules, Beverages</td>
              <td className="py-3 px-4">Delayed onset, longer duration, stronger effects</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Sublingual</td>
              <td className="py-3 px-4">Tinctures, Strips, Sprays</td>
              <td className="py-3 px-4">Medium-fast onset, moderate duration, discreet</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Topical</td>
              <td className="py-3 px-4">Creams, Lotions, Balms</td>
              <td className="py-3 px-4">Localized effects, non-intoxicating, targeted relief</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Concentrates</td>
              <td className="py-3 px-4">Dabbing, Oils, Wax</td>
              <td className="py-3 px-4">Very potent, rapid onset, specialized equipment</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ConsumptionMethodsSection;
