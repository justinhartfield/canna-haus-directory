
import React from 'react';
import FilterExample from './FilterExample';

const FilterExamplesSection: React.FC = () => {
  const filterStrainsExample = `{
  "total": 103,
  "page": 1,
  "perPage": 10,
  "timestamp": "2023-07-21T14:32:08Z",
  "requestId": "req-f8c7d654-a941-4843-9b1d-6a0f3e2c9087",
  "results": [
    {
      "id": "strain-123",
      "name": "Blue Dream",
      "category": "Sativa-dominant Hybrid",
      "thcContent": "18-24%",
      "cbdContent": "0.1-0.2%",
      "effects": ["Relaxed", "Creative", "Euphoric"],
      "popularity": 4.8,
      "updatedAt": "2023-06-12T09:18:45Z"
    },
    // Additional results
  ]
}`;

  const filterTerpenesExample = `{
  "total": 28,
  "page": 1,
  "perPage": 10,
  "timestamp": "2023-07-21T14:35:12Z",
  "requestId": "req-e9b3a567-c234-4989-8321-f76e2c1d8a90",
  "results": [
    {
      "id": "terpene-001",
      "name": "Myrcene",
      "description": "Earthy, musky aroma with hints of tropical fruit",
      "effects": ["Sedative", "Relaxing", "Analgesic"],
      "strains": ["Blue Dream", "OG Kush", "Granddaddy Purple"],
      "boilingPoint": "168°C (334°F)"
    },
    // Additional results
  ]
}`;

  const filterEffectsExample = `{
  "total": 42,
  "page": 1,
  "perPage": 10,
  "timestamp": "2023-07-21T14:37:22Z",
  "requestId": "req-d2c4b987-e871-4231-a654-b9c7e3d2f190",
  "results": [
    {
      "id": "effect-123",
      "name": "Relaxed",
      "category": "Physical",
      "description": "A calming sensation that reduces tension in the body",
      "commonTerpenes": ["Myrcene", "Linalool"],
      "commonStrains": ["Northern Lights", "Granddaddy Purple", "Blue Dream"],
      "medicalApplications": ["Anxiety", "Insomnia", "Muscle tension"]
    },
    // Additional results
  ]
}`;

  const locationProximityExample = `{
  "total": 15,
  "page": 1,
  "perPage": 10,
  "timestamp": "2023-07-21T14:39:46Z",
  "requestId": "req-a1b2c987-d654-4e21-f987-g6h5i4j3k210",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "radiusKm": 25,
  "results": [
    {
      "id": "disp-456",
      "name": "CannaHaus Dispensary SF",
      "distance": 3.2,
      "unit": "km",
      "address": "123 Cannabis Boulevard, San Francisco, CA 94107",
      "availableStrains": 112,
      "rating": 4.7,
      "openNow": true
    },
    // Additional results
  ]
}`;

  const complianceStatesExample = `{
  "total": 18,
  "page": 1,
  "perPage": 10,
  "timestamp": "2023-07-21T14:42:33Z",
  "requestId": "req-h8i7j654-k321-l987-m654-n3o2p1q0r987",
  "results": [
    {
      "id": "state-ca",
      "name": "California",
      "medicalLegal": true,
      "recreationalLegal": true,
      "possession": {
        "amount": "28.5g",
        "details": "Adults 21+ can possess up to 28.5g of cannabis flower"
      },
      "cultivation": {
        "plants": 6,
        "details": "Adults 21+ can grow up to six plants per household"
      },
      "purchaseLimits": {
        "recreational": "28.5g cannabis, 8g concentrate",
        "medical": "8oz cannabis"
      },
      "lastUpdated": "2023-06-01T00:00:00Z"
    },
    // Additional results
  ]
}`;

  const dosageRecommendationExample = `{
  "timestamp": "2023-07-21T14:45:19Z",
  "requestId": "req-s9t8u765-v432-w109-x876-y5z4a3b2c165",
  "patient": {
    "experienceLevel": "beginner",
    "medicalCondition": "chronic pain",
    "weight": "70-80kg",
    "previousResponses": []
  },
  "recommendations": [
    {
      "consumptionMethod": "Tincture",
      "startingDose": "5mg CBD : 2.5mg THC",
      "frequency": "Once daily",
      "timing": "Evening",
      "titrationSchedule": "Increase by 2.5mg CBD : 1.25mg THC every 3 days if needed",
      "maxRecommendedDose": "40mg CBD : 20mg THC",
      "notes": "Start low and go slow. Wait for full effects before increasing dosage."
    },
    {
      "consumptionMethod": "Vaporization",
      "startingDose": "1-2 inhalations",
      "frequency": "As needed",
      "timing": "When pain occurs",
      "titrationSchedule": "Wait 15 minutes between inhalations",
      "maxRecommendedDose": "As needed for symptom control",
      "notes": "Effects are felt quickly but may not last as long as other methods."
    }
  ],
  "disclaimer": "These recommendations are not medical advice. Consult with a healthcare provider before beginning any cannabis regimen."
}`;

  const strainQueryParams = [
    { name: "effects", type: "Array", description: "Filter by effects (e.g., \"Relaxed,Euphoric,Creative\")" },
    { name: "terpenes", type: "Array", description: "Filter by terpene profile (e.g., \"Myrcene,Limonene,Pinene\")" },
    { name: "thcMin", type: "Number", description: "Minimum THC percentage (e.g., 15 for 15%)" },
    { name: "thcMax", type: "Number", description: "Maximum THC percentage (e.g., 25 for 25%)" },
    { name: "cbdMin", type: "Number", description: "Minimum CBD percentage" },
    { name: "category", type: "String", description: "Strain category (Indica, Sativa, Hybrid)" },
    { name: "medical", type: "Array", description: "Filter by medical applications (e.g., \"Pain,Anxiety,Insomnia\")" },
    { name: "sort", type: "String", description: "Sort results (popularity, rating, name, newest)" },
    { name: "page & perPage", type: "Number", description: "Pagination parameters" }
  ];

  return (
    <div className="space-y-8">
      <FilterExample
        title="Strain Filtering"
        endpoint="/strains/filter"
        description="Filter strains by various parameters including effects, terpenes, THC/CBD content, and more."
        responseExample={filterStrainsExample}
        queryParameters={strainQueryParams}
      />

      <FilterExample
        title="Terpene Filtering"
        endpoint="/terpenes/filter"
        description="Filter terpenes by effects, boiling points, aromas, and strains that contain them."
        responseExample={filterTerpenesExample}
      />

      <FilterExample
        title="Effects Filtering"
        endpoint="/effects/filter"
        description="Filter effects by category, intensity, related conditions, and associated terpenes."
        responseExample={filterEffectsExample}
      />

      <FilterExample
        title="Location Proximity"
        endpoint="/dispensaries/nearby"
        description="Find dispensaries, delivery services, and products within a specified radius of a location."
        responseExample={locationProximityExample}
      />

      <FilterExample
        title="Regulatory Compliance"
        endpoint="/compliance/states"
        description="Get detailed information about cannabis regulations in different states and jurisdictions."
        responseExample={complianceStatesExample}
      />

      <FilterExample
        title="Dosage Recommendations"
        endpoint="/recommendations/dosage"
        description="Get personalized dosage recommendations based on user profile, experience level, and medical conditions."
        responseExample={dosageRecommendationExample}
      />
    </div>
  );
};

export default FilterExamplesSection;
