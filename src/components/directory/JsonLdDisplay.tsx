
import React from 'react';
import { Button } from '@/components/ui/button';

interface JsonLdDisplayProps {
  jsonLd: Record<string, any>;
}

const JsonLdDisplay: React.FC<JsonLdDisplayProps> = ({ jsonLd }) => {
  return (
    <div className="glass-card p-6 mb-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">JSON-LD Structured Data</h2>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
        <pre className="text-sm">
          <code className="text-slate-800 dark:text-slate-200">
            {JSON.stringify(jsonLd, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default JsonLdDisplay;
