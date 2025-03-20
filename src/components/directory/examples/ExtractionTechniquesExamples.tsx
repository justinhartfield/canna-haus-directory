
import React from 'react';

const ExtractionTechniquesExamples: React.FC = () => {
  return (
    <div className="glass-card p-6 mb-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
      <div className="space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Technique Comparison</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for extraction technique comparison
fetch('https://api.cannabis-data.org/extraction-techniques/compare?techniques=co2,ethanol,hydrocarbon&factors=purity,safety,cost')
  .then(response => response.json())
  .then(data => {
    console.log('Technique comparison:', data);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Equipment Suppliers</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for equipment supplier information
fetch('https://api.cannabis-data.org/extraction-techniques/suppliers?technique=co2&region=north-america')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended suppliers:', data.suppliers);
    console.log('Equipment options:', data.equipment);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Yield Calculator</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for yield estimation
fetch('https://api.cannabis-data.org/extraction-techniques/yield-calculator?technique=co2&material=high-quality-flower&amount=5000&unit=grams')
  .then(response => response.json())
  .then(data => {
    console.log('Estimated yield:', data.estimatedYield);
    console.log('Operating costs:', data.operatingCosts);
    console.log('Estimated value:', data.estimatedValue);
  });`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExtractionTechniquesExamples;
