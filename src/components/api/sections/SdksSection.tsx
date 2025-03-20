
import React from 'react';

const SdksSection: React.FC = () => {
  return (
    <section id="sdks" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">SDKs & Libraries</h2>
      <p className="mb-6">
        To make integration with our API easier, we provide official software development kits (SDKs) and 
        libraries for various programming languages and platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <polyline points="9 3 9 9 15 9 15 3" />
            </svg>
            <h3 className="text-xl font-semibold">JavaScript/TypeScript</h3>
          </div>
          <p className="mb-4 text-sm">Official JavaScript SDK with TypeScript support for browser and Node.js environments.</p>
          <div className="bg-secondary/50 p-3 rounded-md font-mono text-xs mb-4">
            npm install @cannahaus/api-sdk
          </div>
          <a 
            href="#" 
            className="text-sm text-primary hover:underline flex items-center gap-1.5"
          >
            View documentation
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M12 2H2v10h10V2zM22 2h-8v10h8V2zM12 14H2v8h10v-8zM22 14h-8v8h8v-8z" />
            </svg>
            <h3 className="text-xl font-semibold">Python</h3>
          </div>
          <p className="mb-4 text-sm">Python SDK for data science, machine learning, and backend integrations.</p>
          <div className="bg-secondary/50 p-3 rounded-md font-mono text-xs mb-4">
            pip install cannahaus-api
          </div>
          <a 
            href="#" 
            className="text-sm text-primary hover:underline flex items-center gap-1.5"
          >
            View documentation
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Community SDKs & Integration Tools</h3>
        <p className="mb-4">
          Our community has developed additional tools and integrations for various platforms:
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <div>
              <h4 className="font-medium">React Components Library</h4>
              <p className="text-sm text-muted-foreground">Ready-to-use React components for displaying strain data, lab results, and more.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <div>
              <h4 className="font-medium">WordPress Plugin</h4>
              <p className="text-sm text-muted-foreground">Integrate CannaHaus data directly into WordPress sites with shortcodes and blocks.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <div>
              <h4 className="font-medium">Zapier Integration</h4>
              <p className="text-sm text-muted-foreground">Connect CannaHaus API with 3,000+ apps through Zapier automation workflows.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SdksSection;
