
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImplementationGuideProps {
  jsonLd: Record<string, any>;
}

const ImplementationGuide: React.FC<ImplementationGuideProps> = ({ jsonLd }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
      <p className="mb-4">
        You can integrate this structured data into your website by including the following script in your HTML:
      </p>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto mb-6">
        <pre className="text-sm">
          <code className="text-slate-800 dark:text-slate-200">
{`<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`}
          </code>
        </pre>
      </div>
      <Button onClick={() => {
        navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
      }}>
        Copy JSON-LD
      </Button>
    </div>
  );
};

export default ImplementationGuide;
