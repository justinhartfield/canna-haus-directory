
import React from 'react';

const ConsumptionMethodsExamples: React.FC = () => {
  return (
    <div className="glass-card p-6 mb-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
      <div className="space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Method Comparison</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for consumption method comparison
fetch('https://api.cannabis-data.org/consumption-methods/compare?methods=vaping,smoking,edibles')
  .then(response => response.json())
  .then(data => {
    console.log('Method comparison:', data);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Dosage Calculator</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dosage calculation
fetch('https://api.cannabis-data.org/consumption-methods/dosage?method=vaping&experience=beginner&weight=70&desired_effect=relaxation')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended dosage:', data.recommendation);
    console.log('Expected onset:', data.expectedOnset);
    console.log('Expected duration:', data.expectedDuration);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Equipment Finder</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for equipment recommendations
fetch('https://api.cannabis-data.org/consumption-methods/equipment?method=vaping&budget=medium&experience=intermediate')
  .then(response => response.json())
  .then(data => {
    console.log('Recommended equipment:', data.recommendations);
    console.log('Retailers:', data.retailers);
  });`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionMethodsExamples;
