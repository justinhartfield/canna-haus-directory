
import React from 'react';
import HttpMethodExample from './HttpMethodExample';

const HttpMethodsSection: React.FC = () => {
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
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">HTTP Methods & Use Cases</h3>
      
      <HttpMethodExample
        title="POST Example: Create New Strain"
        endpoint="/strains"
        method="POST"
        description="Create a new strain entry in the database."
        requestExample={createStrainExample}
        responseExample={createStrainResponseExample}
      />
      
      <HttpMethodExample
        title="PATCH Example: Update Strain"
        endpoint="/strains/{id}"
        method="PUT"
        description="Update an existing strain with partial data."
        requestExample={updateStrainExample}
        responseExample={updateStrainResponseExample}
      />
      
      <HttpMethodExample
        title="DELETE Example: Remove Strain"
        endpoint="/strains/{id}"
        method="DELETE"
        description="Remove a strain from the database."
        responseExample={deleteStrainResponseExample}
      />

      <HttpMethodExample
        title="Error Response"
        endpoint="/strains/{id}"
        method="GET"
        description="Example error response when a resource is not found."
        responseExample={errorResponseExample}
      />
    </div>
  );
};

export default HttpMethodsSection;
