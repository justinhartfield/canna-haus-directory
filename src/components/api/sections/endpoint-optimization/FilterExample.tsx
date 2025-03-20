
import React from 'react';
import ApiExample from '@/components/ApiExample';

interface FilterExampleProps {
  title: string;
  endpoint: string;
  description: string;
  responseExample: string;
  queryParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

const FilterExample: React.FC<FilterExampleProps> = ({
  title,
  endpoint,
  description,
  responseExample,
  queryParameters
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <ApiExample
        endpoint={endpoint}
        method="GET"
        description={description}
        responseExample={responseExample}
      />

      {queryParameters && (
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
              {queryParameters.map((param, index) => (
                <tr key={index} className={index < queryParameters.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3 px-4"><code>{param.name}</code></td>
                  <td className="py-3 px-4">{param.type}</td>
                  <td className="py-3 px-4">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilterExample;
