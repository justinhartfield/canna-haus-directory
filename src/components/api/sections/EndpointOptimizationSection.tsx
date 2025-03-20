
import React from 'react';
import ApiExample from '@/components/ApiExample';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const EndpointOptimizationSection: React.FC = () => {
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

  const createStrainExample = `{
  "name": "New Strain Name",
  "category": "Hybrid",
  "description": "This new hybrid strain combines...",
  "thcContent": "18-22%",
  "cbdContent": "0.5-1%",
  "effects": ["Relaxed", "Creative", "Focused"],
  "terpenes": ["Myrcene", "Limonene", "Pinene"],
  "flavorProfile": ["Citrus", "Earthy", "Pine"],
  "medicalApplications": ["Stress", "Mild Pain", "Creativity"],
  "growDifficulty": "Moderate"
}`;

  const createStrainResponseExample = `{
  "success": true,
  "timestamp": "2023-07-21T15:03:27Z",
  "requestId": "req-t7u6v543-w210-x987-y654-z3a2b1c0d321",
  "resource": {
    "id": "strain-789",
    "name": "New Strain Name",
    "category": "Hybrid",
    "createdAt": "2023-07-21T15:03:27Z",
    "updatedAt": "2023-07-21T15:03:27Z"
  },
  "message": "Strain created successfully"
}`;

  const updateStrainExample = `{
  "description": "Updated description for the strain...",
  "thcContent": "19-23%",
  "effects": ["Relaxed", "Creative", "Euphoric", "Focused"]
}`;

  const updateStrainResponseExample = `{
  "success": true,
  "timestamp": "2023-07-21T15:07:54Z",
  "requestId": "req-d3e2f109-g876-h543-i210-j9k8l7m6n543",
  "resource": {
    "id": "strain-123",
    "updatedAt": "2023-07-21T15:07:54Z"
  },
  "message": "Strain updated successfully"
}`;

  const deleteStrainResponseExample = `{
  "success": true,
  "timestamp": "2023-07-21T15:09:37Z",
  "requestId": "req-o5p4q321-r098-s765-t432-u1v0w9x8y765",
  "message": "Strain deleted successfully"
}`;

  const errorResponseExample = `{
  "success": false,
  "timestamp": "2023-07-21T15:12:08Z",
  "requestId": "req-z9a8b765-c432-d109-e876-f5g4h3i2j109",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "status": 404,
    "message": "The requested strain with ID 'strain-999' could not be found",
    "details": {
      "resourceType": "strain",
      "resourceId": "strain-999"
    }
  }
}`;

  return (
    <section id="endpoint-optimization" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Endpoint Optimization</h2>
      <p className="mb-6">
        Our API provides optimized endpoints for filtering and retrieving data based on various parameters. These endpoints support a range of query options to help you find exactly what you're looking for.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">Strain Filtering</h3>
          <ApiExample
            endpoint="/strains/filter"
            method="GET"
            description="Filter strains by various parameters including effects, terpenes, THC/CBD content, and more."
            responseExample={filterStrainsExample}
          />

          <div className="glass-card rounded-xl p-6 mt-4">
            <h4 className="text-lg font-medium mb-3">Query Parameters</h4>
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
                  <td className="py-3 px-4"><code>effects</code></td>
                  <td className="py-3 px-4">Array</td>
                  <td className="py-3 px-4">Filter by effects (e.g., "Relaxed,Euphoric,Creative")</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>terpenes</code></td>
                  <td className="py-3 px-4">Array</td>
                  <td className="py-3 px-4">Filter by terpene profile (e.g., "Myrcene,Limonene,Pinene")</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>thcMin</code></td>
                  <td className="py-3 px-4">Number</td>
                  <td className="py-3 px-4">Minimum THC percentage (e.g., 15 for 15%)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>thcMax</code></td>
                  <td className="py-3 px-4">Number</td>
                  <td className="py-3 px-4">Maximum THC percentage (e.g., 25 for 25%)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>cbdMin</code></td>
                  <td className="py-3 px-4">Number</td>
                  <td className="py-3 px-4">Minimum CBD percentage</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>category</code></td>
                  <td className="py-3 px-4">String</td>
                  <td className="py-3 px-4">Strain category (Indica, Sativa, Hybrid)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>medical</code></td>
                  <td className="py-3 px-4">Array</td>
                  <td className="py-3 px-4">Filter by medical applications (e.g., "Pain,Anxiety,Insomnia")</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4"><code>sort</code></td>
                  <td className="py-3 px-4">String</td>
                  <td className="py-3 px-4">Sort results (popularity, rating, name, newest)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4"><code>page</code> & <code>perPage</code></td>
                  <td className="py-3 px-4">Number</td>
                  <td className="py-3 px-4">Pagination parameters</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Terpene Filtering</h3>
          <ApiExample
            endpoint="/terpenes/filter"
            method="GET"
            description="Filter terpenes by effects, boiling points, aromas, and strains that contain them."
            responseExample={filterTerpenesExample}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Effects Filtering</h3>
          <ApiExample
            endpoint="/effects/filter"
            method="GET"
            description="Filter effects by category, intensity, related conditions, and associated terpenes."
            responseExample={filterEffectsExample}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Location Proximity</h3>
          <ApiExample
            endpoint="/dispensaries/nearby"
            method="GET"
            description="Find dispensaries, delivery services, and products within a specified radius of a location."
            responseExample={locationProximityExample}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Regulatory Compliance</h3>
          <ApiExample
            endpoint="/compliance/states"
            method="GET"
            description="Get detailed information about cannabis regulations in different states and jurisdictions."
            responseExample={complianceStatesExample}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Dosage Recommendations</h3>
          <ApiExample
            endpoint="/recommendations/dosage"
            method="GET"
            description="Get personalized dosage recommendations based on user profile, experience level, and medical conditions."
            responseExample={dosageRecommendationExample}
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">HTTP Methods & Use Cases</h3>
        
        <div className="glass-card rounded-xl p-6 mb-6">
          <h4 className="text-lg font-medium mb-3">POST Example: Create New Strain</h4>
          <ApiExample
            endpoint="/strains"
            method="POST"
            description="Create a new strain entry in the database."
            requestExample={createStrainExample}
            responseExample={createStrainResponseExample}
          />
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-6">
          <h4 className="text-lg font-medium mb-3">PATCH Example: Update Strain</h4>
          <ApiExample
            endpoint="/strains/{id}"
            method="PUT"
            description="Update an existing strain with partial data."
            requestExample={updateStrainExample}
            responseExample={updateStrainResponseExample}
          />
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-6">
          <h4 className="text-lg font-medium mb-3">DELETE Example: Remove Strain</h4>
          <ApiExample
            endpoint="/strains/{id}"
            method="DELETE"
            description="Remove a strain from the database."
            responseExample={deleteStrainResponseExample}
          />
        </div>

        <div className="glass-card rounded-xl p-6">
          <h4 className="text-lg font-medium mb-3">Error Response</h4>
          <ApiExample
            endpoint="/strains/{id}"
            method="GET"
            description="Example error response when a resource is not found."
            responseExample={errorResponseExample}
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-3">Pagination Example</h3>
        <div className="glass-card rounded-xl p-6">
          <p className="mb-4">The API supports pagination for all collection endpoints. Here's an example of the navigation controls you can build:</p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Pagination metadata is included in all list responses, allowing you to easily implement pagination controls in your application.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EndpointOptimizationSection;
