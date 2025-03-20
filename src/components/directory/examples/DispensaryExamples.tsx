
import React from 'react';

const DispensaryExamples: React.FC = () => {
  return (
    <div className="glass-card p-6 mb-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
      <div className="space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Location Search</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dispensary location search
fetch('https://api.cannabis-data.org/dispensaries?lat=40.0150&lon=-105.2705&radius=10')
  .then(response => response.json())
  .then(data => {
    console.log('Nearby dispensaries:', data);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Inventory Check</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for dispensary inventory check
fetch('https://api.cannabis-data.org/dispensaries/inventory?id=9&product=blue-dream')
  .then(response => response.json())
  .then(data => {
    console.log('Product availability:', data);
  });`}
            </code>
          </pre>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
          <h3 className="font-medium mb-2">Delivery Estimation</h3>
          <pre className="text-sm overflow-x-auto">
            <code className="text-slate-800 dark:text-slate-200">
{`// Example API call for delivery time estimation
fetch('https://api.cannabis-data.org/dispensaries/delivery?id=9&address=123+Main+St+Boulder+CO')
  .then(response => response.json())
  .then(data => {
    console.log('Estimated delivery time:', data.estimatedTime);
    console.log('Delivery fee:', data.fee);
  });`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DispensaryExamples;
