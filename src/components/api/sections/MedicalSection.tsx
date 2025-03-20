
import React from 'react';
import ApiExample from '@/components/ApiExample';

const MedicalSection: React.FC = () => {
  const medicalSearchExample = `{
  "query": "anxiety treatment",
  "total": 28,
  "page": 1,
  "perPage": 10,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "MedicalStudy",
      "id": "study-057",
      "name": "Cannabis and Anxiety Management",
      "description": "Comprehensive meta-analysis of studies...",
      "healthCondition": {
        "@type": "MedicalCondition",
        "name": "Anxiety Disorders"
      },
      "outcome": "Moderate evidence for efficacy of high-CBD, low-THC formulations"
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-181",
      "name": "Charlotte's Web",
      "medicalUses": ["Anxiety", "Epilepsy", "Inflammation"],
      "cbdContent": "17-20%",
      "thcContent": "<0.3%"
    },
    // ... more items
  ]
}`;

  return (
    <section id="medical" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Medical Research API</h2>
      <p className="mb-6">
        Access to peer-reviewed research, case studies, and medical applications of cannabis for various health conditions.
      </p>
      
      <ApiExample
        endpoint="/medical/search"
        method="GET"
        description="Search for medical research, case studies, and cannabis applications for specific health conditions."
        responseExample={medicalSearchExample}
      />
    </section>
  );
};

export default MedicalSection;
