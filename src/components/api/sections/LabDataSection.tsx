
import React from 'react';
import ApiExample from '@/components/ApiExample';

const LabDataSection: React.FC = () => {
  const labDataExample = `{
  "id": "lab-123",
  "sampleId": "sample-456",
  "batchId": "batch-789",
  "testedAt": "2023-07-15T10:30:00Z",
  "expiresAt": "2024-07-15T10:30:00Z",
  "labName": "CannaTest Labs",
  "labLicense": "L-123-456-789",
  "testResults": {
    "potency": {
      "thc": {
        "total": 21.45,
        "delta9": 19.87,
        "delta8": 0.58,
        "thca": 23.63
      },
      "cbd": {
        "total": 0.42,
        "cbda": 0.45
      },
      "cbn": 0.12,
      "cbg": 0.87,
      "terpenes": [
        {
          "name": "Myrcene",
          "value": 0.35
        },
        {
          "name": "Limonene",
          "value": 0.28
        },
        {
          "name": "Caryophyllene",
          "value": 0.21
        }
      ]
    },
    "contaminants": {
      "pesticides": {
        "passed": true,
        "details": []
      },
      "heavyMetals": {
        "passed": true,
        "details": []
      },
      "microbiological": {
        "passed": true,
        "details": []
      },
      "residualSolvents": {
        "passed": true,
        "details": []
      }
    },
    "moisture": 12.3,
    "waterActivity": 0.58
  },
  "productInfo": {
    "name": "Blue Dream",
    "type": "Flower",
    "strain": "strain-123",
    "producer": "GreenGrow Farms",
    "producerLicense": "P-456-789-012"
  },
  "certification": {
    "certifiedBy": "Jane Smith, PhD",
    "signature": "https://example.com/signatures/lab-123.png",
    "notes": "Sample meets all regulatory requirements for medical and adult use."
  }
}`;

  return (
    <section id="lab-data" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Lab Data API</h2>
      <p className="mb-6">
        Access comprehensive laboratory testing data for cannabis products, including potency analysis, 
        contaminant screening, terpene profiles, and certification information.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/lab-data/{id}"
          method="GET"
          description="Retrieve detailed laboratory test results for a specific product by ID."
          responseExample={labDataExample}
        />
      </div>

      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Test Data Categories</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Category</th>
              <th className="py-2 px-4 text-left font-semibold">Description</th>
              <th className="py-2 px-4 text-left font-semibold">Key Measurements</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Potency</td>
              <td className="py-3 px-4">Cannabinoid profile and strength</td>
              <td className="py-3 px-4">THC, CBD, CBN, CBG percentages</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Terpenes</td>
              <td className="py-3 px-4">Aromatic compounds affecting flavor and effects</td>
              <td className="py-3 px-4">Myrcene, Limonene, Pinene levels</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Contaminants</td>
              <td className="py-3 px-4">Testing for harmful substances</td>
              <td className="py-3 px-4">Pesticides, heavy metals, microbes, solvents</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Physical Properties</td>
              <td className="py-3 px-4">Physical characteristics of the product</td>
              <td className="py-3 px-4">Moisture content, water activity</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Certification</td>
              <td className="py-3 px-4">Verification of test results</td>
              <td className="py-3 px-4">Certifier credentials, timestamp, notes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LabDataSection;
