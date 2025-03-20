
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ApiExampleProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestExample?: string;
  responseExample: string;
  className?: string;
}

const ApiExample: React.FC<ApiExampleProps> = ({
  endpoint,
  method,
  description,
  requestExample,
  responseExample,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('response');
  
  const methodColors = {
    GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    POST: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };

  const copyToClipboard = () => {
    const textToCopy = activeTab === 'request' ? requestExample : responseExample;
    navigator.clipboard.writeText(textToCopy || '');
    toast.success(`${activeTab === 'request' ? 'Request' : 'Response'} copied to clipboard`);
  };

  return (
    <div className={cn("glass-card rounded-xl overflow-hidden", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className={cn("px-2 py-1 rounded-md text-xs font-medium", methodColors[method])}>
            {method}
          </span>
          <code className="text-sm font-mono">{endpoint}</code>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="border-b border-border">
        <div className="flex">
          {requestExample && (
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium flex-1 text-center transition-colors",
                activeTab === 'request' 
                  ? "text-foreground border-b-2 border-cannabis-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('request')}
            >
              Request
            </button>
          )}
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium flex-1 text-center transition-colors",
              activeTab === 'response' 
                ? "text-foreground border-b-2 border-cannabis-500" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab('response')}
          >
            Response
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-secondary/50 dark:bg-card/50 overflow-x-auto">
        <pre className="text-sm font-mono whitespace-pre">
          {activeTab === 'request' ? requestExample : responseExample}
        </pre>
      </div>
      
      <div className="p-4 flex justify-end border-t border-border">
        <button 
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1"
          onClick={copyToClipboard}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy to clipboard
        </button>
      </div>
    </div>
  );
};

export default ApiExample;
