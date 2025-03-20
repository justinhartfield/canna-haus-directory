
import React from 'react';
import { Button } from '@/components/ui/button';

interface DirectoryExampleProps {
  title: string;
  language: string;
  code: string;
  description?: string;
}

const DirectoryExample: React.FC<DirectoryExampleProps> = ({
  title,
  language,
  code,
  description
}) => {
  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto mb-4">
        <pre className="text-sm">
          <code className="text-slate-800 dark:text-slate-200">
            {code}
          </code>
        </pre>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(code);
        }}
      >
        Copy Code
      </Button>
    </div>
  );
};

export default DirectoryExample;
