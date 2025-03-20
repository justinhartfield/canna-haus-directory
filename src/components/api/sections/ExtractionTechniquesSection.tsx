
import React from 'react';
import ApiExample from '@/components/ApiExample';

const ExtractionTechniquesSection: React.FC = () => {
  const techniqueGetExample = `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "id": "extract-123",
  "name": "CO₂ Extraction",
  "description": "A solventless extraction method using pressurized carbon dioxide to pull cannabinoids and terpenes from plant material.",
  "category": "Solventless Extraction",
  "technicalDetails": {
    "process": "Supercritical or subcritical CO₂ is passed through cannabis material in an extraction vessel, dissolving the cannabinoids and terpenes. The CO₂ mixture then passes into a separator where pressure changes cause the extract to separate from the gas.",
    "temperatures": "31-60°C for supercritical extraction, below 31°C for subcritical extraction",
    "pressures": "1,070-7,500 PSI depending on desired compounds",
    "runTime": "4-8 hours for a full production run",
    "throughput": "5-10 lbs of plant material per day on mid-size equipment"
  },
  "equipmentRequired": [
    {
      "name": "Extraction System",
      "description": "Complete CO₂ extraction system with extraction vessel, separator, and collection vessels",
      "estimatedCost": "$100,000-$450,000",
      "suppliers": [
        {"name": "Apeks Supercritical", "website": "https://www.apekssupercritical.com"},
        {"name": "Waters Supercritical Extraction Systems", "website": "https://www.waters.com"},
        {"name": "Precision Extraction Solutions", "website": "https://precisionextraction.com"}
      ],
      "specifications": "20-100L capacity vessels depending on scale"
    },
    {
      "name": "Winterization Equipment",
      "description": "Equipment for post-processing to remove waxes and lipids",
      "estimatedCost": "$15,000-$50,000",
      "specifications": "Includes centrifuge, filters, cold storage"
    },
    {
      "name": "Safety Infrastructure",
      "description": "CO₂ monitors, ventilation systems, emergency protocols",
      "estimatedCost": "$10,000-$30,000",
      "specifications": "OSHA compliant CO₂ monitoring and ventilation"
    }
  ],
  "qualityDifferences": {
    "advantages": [
      "High selectivity for specific compounds by adjusting temperature and pressure",
      "No toxic solvent residue in final product",
      "Preserves terpene profiles when run at lower temperatures",
      "Environmentally friendly with recyclable CO₂",
      "Generally recognized as safe (GRAS) by FDA"
    ],
    "disadvantages": [
      "Lower yields compared to some solvent-based methods",
      "High initial equipment investment",
      "Complex process requiring technical expertise",
      "Longer run times than hydrocarbon extraction"
    ],
    "productTypes": ["Full-spectrum oil", "Terpene-rich extracts", "Mid-potency concentrates"],
    "purityLevels": {
      "typicalPotency": "65-85% cannabinoids",
      "residualSolvents": "None (CO₂ fully evaporates)",
      "contaminants": "Minimal with proper post-processing"
    }
  },
  "safetyConsiderations": {
    "hazards": [
      "High-pressure vessel risks",
      "Asphyxiation risk from CO₂ in case of leaks",
      "Extreme cold temperatures in some parts of process"
    ],
    "requiredCertifications": [
      "Pressure vessel safety certification",
      "OSHA compliance for industrial processes",
      "State-specific cannabis processing license"
    ],
    "regulatoryFramework": "FDA guidelines for food-grade extraction, state cannabis regulations",
    "personalProtection": "Training in high-pressure systems, CO₂ monitoring, emergency protocols"
  },
  "economicData": {
    "initialInvestment": "$150,000-$500,000 for complete setup",
    "operatingCosts": "$15-25 per pound of processed material",
    "laborRequirements": "2-3 trained technicians per shift",
    "yields": {
      "average": "8-12% by weight from flower material",
      "range": "5-15% depending on input quality and parameters"
    },
    "roi": {
      "estimatedTimeframe": "1-3 years depending on scale",
      "marketPricing": "Wholesale $15-30/g depending on product type and quality"
    }
  }
}`;

  const techniquesListExample = `{
  "total": 5,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "id": "extract-123",
      "name": "CO₂ Extraction",
      "category": "Solventless Extraction",
      "description": "A solventless extraction method using pressurized carbon dioxide to pull cannabinoids and terpenes from plant material.",
      "qualityDifferences": {
        "productTypes": ["Full-spectrum oil", "Terpene-rich extracts", "Mid-potency concentrates"],
        "purityLevels": {
          "typicalPotency": "65-85% cannabinoids"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "id": "extract-124",
      "name": "Hydrocarbon Extraction",
      "category": "Solvent-based Extraction",
      "description": "Extraction using hydrocarbon solvents like butane or propane to dissolve and separate cannabinoids from plant material.",
      "qualityDifferences": {
        "productTypes": ["Shatter", "Wax", "Budder", "High-terpene extracts"],
        "purityLevels": {
          "typicalPotency": "70-90% cannabinoids"
        }
      }
    },
    // ... more items
  ]
}`;

  return (
    <section id="extraction-techniques" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Extraction & Processing Techniques API</h2>
      <p className="mb-6">
        Access comprehensive data on various cannabis extraction and processing techniques, including detailed technical 
        specifications, equipment requirements, quality outcomes, safety considerations, and economic data.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/extraction-techniques/{id}"
          method="GET"
          description="Retrieve detailed information about a specific extraction technique by ID."
          responseExample={techniqueGetExample}
        />
        
        <ApiExample
          endpoint="/extraction-techniques"
          method="GET"
          description="List all available extraction techniques."
          responseExample={techniquesListExample}
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Extraction Categories</h3>
        <p className="mb-4">The API categorizes extraction techniques into several major types:</p>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Category</th>
              <th className="py-2 px-4 text-left font-semibold">Techniques</th>
              <th className="py-2 px-4 text-left font-semibold">Key Characteristics</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Solventless</td>
              <td className="py-3 px-4">CO₂ Extraction, Ice Water Hash, Rosin Press</td>
              <td className="py-3 px-4">No chemical solvents, generally safer, often preserves terpenes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Hydrocarbon-based</td>
              <td className="py-3 px-4">Butane, Propane, Mixed Hydrocarbon</td>
              <td className="py-3 px-4">Efficient yields, requires purging, specialized equipment</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Alcohol-based</td>
              <td className="py-3 px-4">Ethanol Extraction, QWET, QWISO</td>
              <td className="py-3 px-4">Scalable, extracts wide range of compounds, polar solvent</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Mechanical</td>
              <td className="py-3 px-4">Dry Sift, Kief Collection, Cold Press</td>
              <td className="py-3 px-4">Minimal processing, lower yields, traditional methods</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ExtractionTechniquesSection;
