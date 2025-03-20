
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApiExample from '@/components/ApiExample';
import { cn } from '@/lib/utils';

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Smooth scroll to the section
    const element = document.getElementById(section);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };
  
  // Sample API examples
  const strainsGetExample = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "id": "strain-123",
  "name": "Blue Dream",
  "description": "A sativa-dominant hybrid strain...",
  "category": "Sativa-dominant Hybrid",
  "geneticLineage": {
    "parent1": "Blueberry Indica",
    "parent2": "Haze Sativa"
  },
  "thcContent": "18-24%",
  "cbdContent": "0.1-0.2%",
  "dominantTerpenes": ["Myrcene", "Pinene", "Caryophyllene"],
  "effects": ["Relaxed", "Creative", "Euphoric", "Happy"],
  "medicalUses": ["Stress", "Depression", "Pain", "Headaches"],
  "flavorProfile": ["Blueberry", "Sweet", "Berry", "Herbal"],
  "cultivationDifficulty": "Moderate"
}`;

  const strainsListExample = `{
  "total": 245,
  "page": 1,
  "perPage": 10,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-123",
      "name": "Blue Dream",
      "description": "A sativa-dominant hybrid strain...",
      "category": "Sativa-dominant Hybrid",
      "thcContent": "18-24%",
      "cbdContent": "0.1-0.2%",
      "effects": ["Relaxed", "Creative", "Euphoric", "Happy"]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-124",
      "name": "OG Kush",
      "description": "A potent hybrid strain...",
      "category": "Hybrid",
      "thcContent": "20-26%",
      "cbdContent": "0.1-0.3%",
      "effects": ["Euphoric", "Relaxed", "Happy", "Uplifted"]
    },
    // ... more items
  ]
}`;

  const medicalSearchExample = `{
  "query": "anxiety treatment",
  "total": 28,
  "page": 1,
  "perPage": 10,
  "results": [
    {
      "@context": "https://schema.org",
      "@type": "MedicalStudy",
      "id": "study-057",
      "name": "Cannabis and Anxiety Management",
      "description": "Comprehensive meta-analysis of studies...",
      "healthCondition": {
        "@type": "MedicalCondition",
        "name": "Anxiety Disorders"
      },
      "outcome": "Moderate evidence for efficacy of high-CBD, low-THC formulations"
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "id": "strain-181",
      "name": "Charlotte's Web",
      "medicalUses": ["Anxiety", "Epilepsy", "Inflammation"],
      "cbdContent": "17-20%",
      "thcContent": "<0.3%"
    },
    // ... more items
  ]
}`;

  const postReviewExample = `{
  "entityId": "strain-123",
  "rating": 4.5,
  "review": "This strain has been very effective for my chronic pain...",
  "medicalCondition": "Chronic Pain",
  "effectivenessRating": 5,
  "sideEffects": ["Dry Mouth", "Hunger"],
  "verifiedPurchase": true
}`;

  const postReviewResponseExample = `{
  "success": true,
  "reviewId": "review-789",
  "status": "pending-verification",
  "message": "Thank you for your review. It will be published after verification."
}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="glass-card rounded-xl p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
                <nav className="space-y-1">
                  <SidebarNavItem 
                    active={activeSection === 'overview'} 
                    onClick={() => handleSectionChange('overview')}
                  >
                    Overview
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'authentication'} 
                    onClick={() => handleSectionChange('authentication')}
                  >
                    Authentication
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'rate-limits'} 
                    onClick={() => handleSectionChange('rate-limits')}
                  >
                    Rate Limits
                  </SidebarNavItem>
                  
                  <div className="pt-2 pb-1">
                    <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Endpoints</p>
                  </div>
                  
                  <SidebarNavItem 
                    active={activeSection === 'strains'} 
                    onClick={() => handleSectionChange('strains')}
                  >
                    Strains
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'medical'} 
                    onClick={() => handleSectionChange('medical')}
                  >
                    Medical Research
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'lab-data'} 
                    onClick={() => handleSectionChange('lab-data')}
                  >
                    Lab Data
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'compliance'} 
                    onClick={() => handleSectionChange('compliance')}
                  >
                    Compliance
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'reviews'} 
                    onClick={() => handleSectionChange('reviews')}
                  >
                    User Reviews
                  </SidebarNavItem>
                  
                  <div className="pt-2 pb-1">
                    <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Resources</p>
                  </div>
                  
                  <SidebarNavItem 
                    active={activeSection === 'schema'} 
                    onClick={() => handleSectionChange('schema')}
                  >
                    Data Schema
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'licensing'} 
                    onClick={() => handleSectionChange('licensing')}
                  >
                    Licensing & Terms
                  </SidebarNavItem>
                  <SidebarNavItem 
                    active={activeSection === 'sdks'} 
                    onClick={() => handleSectionChange('sdks')}
                  >
                    SDKs & Libraries
                  </SidebarNavItem>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
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
              
              <section id="authentication" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                <p className="mb-6">
                  Access to the CannaHaus API requires an API key. You can obtain an API key by registering for an account on our developer portal.
                </p>
                
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
                  <p className="mb-4">
                    Include your API key in the request headers using the <code className="bg-secondary/50 px-1 py-0.5 rounded">X-API-Key</code> header:
                  </p>
                  
                  <pre className="bg-secondary/50 p-3 rounded-md font-mono text-sm overflow-x-auto">
{`curl -X GET "https://api.cannahaus.io/v1/strains" \\
  -H "X-API-Key: your_api_key_here"`}
                  </pre>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">Access Tiers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 px-4 text-left font-semibold">Tier</th>
                          <th className="py-2 px-4 text-left font-semibold">Rate Limit</th>
                          <th className="py-2 px-4 text-left font-semibold">Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">Free</td>
                          <td className="py-3 px-4">100 requests/day</td>
                          <td className="py-3 px-4">Basic read access to public data</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">Developer</td>
                          <td className="py-3 px-4">1,000 requests/day</td>
                          <td className="py-3 px-4">Full read access, basic write access</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">Business</td>
                          <td className="py-3 px-4">10,000 requests/day</td>
                          <td className="py-3 px-4">Full read/write access, webhook support</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Enterprise</td>
                          <td className="py-3 px-4">Custom limits</td>
                          <td className="py-3 px-4">All features, dedicated support, SLA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              
              <section id="rate-limits" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                <p className="mb-6">
                  To ensure availability for all users, the API employs rate limiting based on your subscription tier. Rate limit information is included in the response headers.
                </p>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">Rate Limit Headers</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-4 text-left font-semibold">Header</th>
                        <th className="py-2 px-4 text-left font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>X-RateLimit-Limit</code></td>
                        <td className="py-3 px-4">Maximum number of requests allowed per day</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>X-RateLimit-Remaining</code></td>
                        <td className="py-3 px-4">Number of requests remaining in the current period</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code>X-RateLimit-Reset</code></td>
                        <td className="py-3 px-4">Unix timestamp for when the rate limit resets</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section id="strains" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Strains API</h2>
                <p className="mb-6">
                  Access our comprehensive database of cannabis strains with detailed information on genetics, effects, medical applications, and more.
                </p>
                
                <div className="space-y-6">
                  <ApiExample
                    endpoint="/strains/{id}"
                    method="GET"
                    description="Retrieve detailed information about a specific cannabis strain by ID."
                    responseExample={strainsGetExample}
                  />
                  
                  <ApiExample
                    endpoint="/strains"
                    method="GET"
                    description="List cannabis strains with pagination and filtering options."
                    responseExample={strainsListExample}
                  />
                </div>
                
                <div className="glass-card rounded-xl p-6 mt-6">
                  <h3 className="text-xl font-semibold mb-3">Query Parameters</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-4 text-left font-semibold">Parameter</th>
                        <th className="py-2 px-4 text-left font-semibold">Type</th>
                        <th className="py-2 px-4 text-left font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>page</code></td>
                        <td className="py-3 px-4">Integer</td>
                        <td className="py-3 px-4">Page number for pagination (default: 1)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>perPage</code></td>
                        <td className="py-3 px-4">Integer</td>
                        <td className="py-3 px-4">Number of results per page (default: 20, max: 100)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>sort</code></td>
                        <td className="py-3 px-4">String</td>
                        <td className="py-3 px-4">Field to sort by (e.g., name, thcContent, popularity)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>order</code></td>
                        <td className="py-3 px-4">String</td>
                        <td className="py-3 px-4">Sort order (asc, desc)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4"><code>category</code></td>
                        <td className="py-3 px-4">String</td>
                        <td className="py-3 px-4">Filter by category (Indica, Sativa, Hybrid, CBD-Dominant)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code>effects</code></td>
                        <td className="py-3 px-4">Array</td>
                        <td className="py-3 px-4">Filter by effects (comma-separated list)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section id="medical" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Medical Research API</h2>
                <p className="mb-6">
                  Access to peer-reviewed research, case studies, and medical applications of cannabis for various health conditions.
                </p>
                
                <ApiExample
                  endpoint="/medical/search"
                  method="GET"
                  description="Search for medical research, case studies, and cannabis applications for specific health conditions."
                  responseExample={medicalSearchExample}
                />
              </section>
              
              <section id="reviews" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">User Reviews API</h2>
                <p className="mb-6">
                  Submit and retrieve user reviews for cannabis strains, products, and research with detailed effectiveness ratings.
                </p>
                
                <div className="space-y-6">
                  <ApiExample
                    endpoint="/reviews"
                    method="POST"
                    description="Submit a new user review for a cannabis-related entry."
                    requestExample={postReviewExample}
                    responseExample={postReviewResponseExample}
                  />
                </div>
              </section>
              
              <section id="licensing" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Licensing & Terms</h2>
                <p className="mb-6">
                  Our data is available under different licensing terms depending on your intended use and subscription tier.
                </p>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">Available Licenses</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Academic & Research License</h4>
                      <p className="text-sm text-muted-foreground">
                        For non-commercial academic and research purposes. Requires attribution and sharing of derived research.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Developer License</h4>
                      <p className="text-sm text-muted-foreground">
                        For building applications and services with our data. Has usage limitations and requires attribution.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Commercial License</h4>
                      <p className="text-sm text-muted-foreground">
                        For commercial applications and products. Includes broader usage rights with tiered pricing based on volume.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Enterprise License</h4>
                      <p className="text-sm text-muted-foreground">
                        Custom licensing terms for large-scale commercial use, including redistribution rights and dedicated support.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

interface SidebarNavItemProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
        active 
          ? "bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
};

export default ApiDocs;
