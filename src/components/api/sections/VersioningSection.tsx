
import React from 'react';

const VersioningSection: React.FC = () => {
  return (
    <section id="versioning" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">API Versioning</h2>
      <p className="mb-6">
        The CannaHaus API implements semantic versioning to ensure backward compatibility and 
        to clearly communicate the impact of API changes.
      </p>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">Semantic Versioning Structure</h3>
        <p className="mb-4">
          Our API versions follow the <code className="bg-secondary/50 px-1 py-0.5 rounded">MAJOR.MINOR.PATCH</code> format:
        </p>
        
        <ul className="space-y-2 mb-4">
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
            <div>
              <span className="font-semibold">MAJOR</span>: Incremented for incompatible API changes that require client updates
            </div>
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
            <div>
              <span className="font-semibold">MINOR</span>: Incremented for new, backward-compatible functionality additions
            </div>
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
            <div>
              <span className="font-semibold">PATCH</span>: Incremented for backward-compatible bug fixes
            </div>
          </li>
        </ul>
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">Version Specification in Requests</h3>
        <p className="mb-4">
          Specify the API version in your requests using one of these methods:
        </p>
        
        <h4 className="text-lg font-medium mb-2">1. URL Path Prefix</h4>
        <pre className="bg-secondary/50 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
{`https://cannahausapi.com/v1/strains`}
        </pre>
        
        <h4 className="text-lg font-medium mb-2">2. Accept Header</h4>
        <pre className="bg-secondary/50 p-3 rounded-md font-mono text-sm overflow-x-auto">
{`Accept: application/json; version=1.0`}
        </pre>
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">Version Lifecycle</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left font-semibold">Stage</th>
                <th className="py-2 px-4 text-left font-semibold">Description</th>
                <th className="py-2 px-4 text-left font-semibold">Support Period</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Beta</td>
                <td className="py-3 px-4">Early access preview, subject to change</td>
                <td className="py-3 px-4">No guaranteed support</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Stable</td>
                <td className="py-3 px-4">Production-ready, backward-compatible updates only</td>
                <td className="py-3 px-4">Minimum 12 months</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Deprecated</td>
                <td className="py-3 px-4">Scheduled for removal, migration recommended</td>
                <td className="py-3 px-4">3-6 months notice</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Sunset</td>
                <td className="py-3 px-4">No longer available</td>
                <td className="py-3 px-4">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">Versioning Best Practices</h3>
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
            <span>Always specify a version in your API requests for consistency</span>
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
            <span>Subscribe to our developer newsletter for versioning announcements</span>
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
            <span>Test your integration against the next version before migrating</span>
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
            <span>Check the API changelog regularly for updates and enhancements</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default VersioningSection;
