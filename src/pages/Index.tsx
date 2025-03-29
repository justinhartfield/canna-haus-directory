import React from 'react';
import Hero from '@/components/Hero';
import DirectoryCard from '@/components/DirectoryCard';
import ApiExample from '@/components/ApiExample';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  // Sample data for featured directory items
  const featuredItems = [
    {
      id: 1,
      title: "Blue Dream",
      description: "A sativa-dominant hybrid strain that provides a balanced high with full-body relaxation and gentle cerebral invigoration.",
      category: "Genetics",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Blue Dream",
        "description": "A sativa-dominant hybrid strain that provides a balanced high with full-body relaxation and gentle cerebral invigoration.",
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
      }
    },
    {
      id: 2,
      title: "Cannabis and Anxiety Management",
      description: "Comprehensive meta-analysis of studies examining the effects of various cannabis strains and consumption methods on anxiety disorders.",
      category: "Medical",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "MedicalStudy",
        "name": "Cannabis and Anxiety Management",
        "description": "Comprehensive meta-analysis of studies examining the effects of various cannabis strains and consumption methods on anxiety disorders.",
        "healthCondition": {
          "@type": "MedicalCondition",
          "name": "Anxiety Disorders",
          "code": {
            "@type": "MedicalCode",
            "code": "F41",
            "codingSystem": "ICD-10"
          }
        },
        "studyType": "Meta-analysis",
        "studySubject": {
          "@type": "Drug",
          "name": "Cannabis",
          "activeIngredient": ["THC", "CBD", "CBN"]
        },
        "outcome": "Moderate evidence for efficacy of high-CBD, low-THC formulations",
        "adverseOutcome": "Increased anxiety with high-THC formulations in some subjects",
        "citation": "Journal of Cannabis Research, 2022;4(1):15",
        "funding": {
          "@type": "Organization",
          "name": "National Institute on Drug Abuse"
        }
      }
    },
    {
      id: 3,
      title: "California Cultivation Regulations",
      description: "Comprehensive guide to California's cannabis cultivation regulations, licensing requirements, and compliance standards.",
      category: "Compliance",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LegalDocument",
        "name": "California Cultivation Regulations",
        "description": "Comprehensive guide to California's cannabis cultivation regulations, licensing requirements, and compliance standards.",
        "jurisdiction": "California, United States",
        "legislationIdentifier": "MAUCRSA",
        "legislationType": "Statute",
        "datePublished": "2021-07-12",
        "dateModified": "2023-01-15",
        "regulatoryAuthority": {
          "@type": "Organization",
          "name": "California Department of Cannabis Control",
          "url": "https://cannabis.ca.gov/"
        },
        "licenseTypes": [
          "Type 1: Specialty Outdoor",
          "Type 1A: Specialty Indoor",
          "Type 1B: Specialty Mixed-Light",
          "Type 2: Small Outdoor",
          "Type 2A: Small Indoor",
          "Type 2B: Small Mixed-Light",
          "Type 3: Medium Outdoor",
          "Type 3A: Medium Indoor",
          "Type 3B: Medium Mixed-Light"
        ],
        "relatedLink": "https://cannabis.ca.gov/applicants/regulations/"
      }
    }
  ];

  // Sample API response for example
  const apiResponseExample = `{
  "@context": "https://schema.org",
  "@type": "Product",
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Directory Items */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Structured Data
              </span>
              <h2 className="text-3xl font-bold mb-4">Featured Directory Entries</h2>
              <p className="text-muted-foreground">
                Explore our highly structured cannabis data, optimized for AI consumption and analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <DirectoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  category={item.category}
                  jsonLd={item.jsonLd}
                />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/directory"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                border border-input bg-background hover:bg-accent hover:text-accent-foreground 
                h-10 px-8 py-2"
              >
                View Complete Directory
              </Link>
            </div>
          </div>
        </section>
        
        {/* API Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                API-First Approach
              </span>
              <h2 className="text-3xl font-bold mb-4">Designed for Integration</h2>
              <p className="text-muted-foreground">
                Our RESTful API provides structured cannabis data that's perfect for AI systems, researchers, and developers.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <ApiExample
                endpoint="/api/strains/{id}"
                method="GET"
                description="Retrieve detailed information about a specific cannabis strain including genetics, effects, and medical applications."
                responseExample={apiResponseExample}
              />
              
              <div className="mt-10 text-center">
                <Link
                  to="/api-docs"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                  bg-cannabis-600 text-white hover:bg-cannabis-700 h-10 px-8 py-2"
                >
                  Explore API Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Key Features
              </span>
              <h2 className="text-3xl font-bold mb-4">Built for the AI Era</h2>
              <p className="text-muted-foreground">
                Our platform is designed from the ground up to work seamlessly with AI systems and data pipelines.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                }
                title="Standardized Schema"
                description="Consistent JSON-LD schema across all entries ensures AI systems can reliably parse and utilize our data."
              />
              
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="3" x2="21" y1="15" y2="15" />
                    <line x1="9" x2="9" y1="3" y2="21" />
                    <line x1="15" x2="15" y1="3" y2="21" />
                  </svg>
                }
                title="Rich Metadata"
                description="Detailed categorization and relationships between entries enable sophisticated analysis and pattern recognition."
              />
              
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="16.5" x2="7.5" y1="9.4" y2="4.21" />
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" x2="12" y1="22" y2="12" />
                  </svg>
                }
                title="RESTful API"
                description="Well-documented endpoints with consistent response formats make integration with AI systems seamless."
              />
              
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                }
                title="Community Verified"
                description="User reviews and expert contributions ensure the accuracy and relevance of our data."
              />
              
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    <path d="M5 3v4" />
                    <path d="M19 17v4" />
                    <path d="M3 5h4" />
                    <path d="M17 19h4" />
                  </svg>
                }
                title="Analytics Dashboard"
                description="Track user engagement, data accuracy, and API usage through our comprehensive analytics."
              />
              
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                }
                title="Clear Licensing"
                description="Straightforward terms for using our data in AI applications, research, or commercial projects."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-cannabis-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to integrate with our cannabis data?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-cannabis-50">
              Join researchers, AI developers, and cannabis businesses leveraging our structured data for innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/api-docs"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                bg-white text-cannabis-800 hover:bg-cannabis-50 h-10 px-8 py-2"
              >
                Explore API
              </Link>
              <Link
                to="/directory"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                border border-white bg-transparent hover:bg-white/10 text-white h-10 px-8 py-2"
              >
                Browse Directory
              </Link>
              {user && (
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                  bg-cannabis-800 text-white hover:bg-cannabis-900 h-10 px-8 py-2"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 glass-card rounded-xl hover-card-animation">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
