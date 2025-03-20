
import React from 'react';

const OverviewSection: React.FC = () => {
  return (
    <section id="overview" className="mb-12">
      <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Welcome to the CannaHaus Directory API, designed to provide structured cannabis data optimized for AI consumption and integration.
      </p>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Base URL</h2>
        <code className="block p-3 bg-secondary/50 rounded-md font-mono text-sm">
          https://api.cannahaus.io/v1
        </code>
        <p className="mt-3 text-sm text-muted-foreground">
          All API calls should be made to this base URL with the appropriate endpoint appended.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">API Features</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>Standardized JSON-LD schema for all data</span>
          </li>
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>Advanced filtering, sorting, and pagination</span>
          </li>
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>Comprehensive search capabilities across all data categories</span>
          </li>
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>User contribution endpoints for reviews and data validation</span>
          </li>
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>Webhook support for real-time updates and notifications</span>
          </li>
          <li className="flex items-start gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-cannabis-600 mt-0.5"
            >
              <path d="m5 12 5 5 10-10" />
            </svg>
            <span>GraphQL support for complex data queries</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default OverviewSection;
