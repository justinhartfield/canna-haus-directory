
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilter from '@/components/SearchFilter';
import DirectoryCard from '@/components/DirectoryCard';

// Sample data for demonstration
const MOCK_DIRECTORY_DATA = [
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
  },
  {
    id: 4,
    title: "OG Kush",
    description: "A potent strain with high THC content known for its distinctive earthy pine and sour lemon scent with woody undertones.",
    category: "Genetics",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "OG Kush",
      "description": "A potent strain with high THC content known for its distinctive earthy pine and sour lemon scent with woody undertones.",
      "category": "Hybrid",
      "geneticLineage": {
        "parent1": "Chemdawg",
        "parent2": "Hindu Kush",
        "origin": "Northern California"
      },
      "thcContent": "20-26%",
      "cbdContent": "0.1-0.3%",
      "dominantTerpenes": ["Myrcene", "Limonene", "Caryophyllene"],
      "effects": ["Euphoric", "Relaxed", "Happy", "Uplifted"],
      "medicalUses": ["Stress", "Pain", "Depression", "Insomnia"],
      "flavorProfile": ["Earthy", "Pine", "Woody", "Lemon"],
      "cultivationDifficulty": "Moderate to Difficult"
    }
  },
  {
    id: 5,
    title: "Cannabis Terpene Profiles and Effects",
    description: "Research study examining the entourage effect of various terpene profiles and their impact on therapeutic outcomes.",
    category: "Lab Data",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "name": "Cannabis Terpene Profiles and Effects",
      "description": "Research study examining the entourage effect of various terpene profiles and their impact on therapeutic outcomes.",
      "author": {
        "@type": "Person",
        "name": "Dr. Ethan Russo",
        "affiliation": "International Cannabis and Cannabinoids Institute"
      },
      "datePublished": "2023-02-15",
      "publisher": {
        "@type": "Organization",
        "name": "Journal of Cannabis Research"
      },
      "keywords": ["terpenes", "entourage effect", "myrcene", "limonene", "pinene", "therapeutic"],
      "abstract": "This study examines how different terpene profiles in cannabis contribute to therapeutic outcomes beyond what can be explained by cannabinoid content alone.",
      "terpenes": {
        "myrcene": "Sedative, muscle relaxant, anti-inflammatory",
        "limonene": "Elevated mood, stress relief, antifungal",
        "pinene": "Mental alertness, anti-inflammatory, bronchodilator",
        "caryophyllene": "Anti-inflammatory, analgesic, anxiolytic",
        "linalool": "Sedative, anxiolytic, anti-convulsant"
      },
      "methodology": "Gas chromatography-mass spectrometry analysis combined with clinical observation",
      "conclusion": "Specific terpene profiles significantly modify the therapeutic effects of cannabis and can be targeted for specific medical conditions."
    }
  },
  {
    id: 6,
    title: "Greenhouse Cannabis Cultivation Guide",
    description: "Complete resource for greenhouse cultivation techniques, including light deprivation, environmental controls, and IPM strategies.",
    category: "Cultivation",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Greenhouse Cannabis Cultivation Guide",
      "description": "Complete resource for greenhouse cultivation techniques, including light deprivation, environmental controls, and IPM strategies.",
      "tool": [
        "Greenhouse structure",
        "Light deprivation system",
        "Environmental monitoring equipment",
        "Irrigation system",
        "Growing containers",
        "Growing medium"
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Greenhouse Setup",
          "text": "Configure greenhouse with proper orientation, ventilation, and environmental monitoring systems."
        },
        {
          "@type": "HowToStep",
          "name": "Light Management",
          "text": "Install and configure light deprivation systems to control photoperiod for flowering."
        },
        {
          "@type": "HowToStep",
          "name": "Environmental Control",
          "text": "Maintain optimal temperature (70-85°F day, 60-70°F night) and humidity (40-60% during vegetation, 30-40% during flowering)."
        },
        {
          "@type": "HowToStep",
          "name": "Irrigation Strategy",
          "text": "Implement automated drip irrigation with runoff monitoring for nutrient management."
        },
        {
          "@type": "HowToStep",
          "name": "IPM Program",
          "text": "Establish preventative pest management protocols using beneficial insects, organic controls, and environmental management."
        }
      ],
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "5000-25000",
        "unitText": "total setup cost range"
      },
      "yield": "2-3 pounds per light equivalent (4x4 ft area)",
      "timeRequired": "P4M",
      "difficulty": "Moderate to Advanced"
    }
  },
  {
    id: 7,
    title: "Charlotte's Web",
    description: "A high-CBD, low-THC strain developed specifically for medicinal use without psychoactive effects, named after Charlotte Figi.",
    category: "Medical",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Charlotte's Web",
      "description": "A high-CBD, low-THC strain developed specifically for medicinal use without psychoactive effects, named after Charlotte Figi.",
      "category": "CBD-Dominant",
      "geneticLineage": {
        "derived": "Hemp",
        "developers": "Stanley Brothers"
      },
      "thcContent": "<0.3%",
      "cbdContent": "17-20%",
      "dominantTerpenes": ["Myrcene", "Caryophyllene", "Bisabolol"],
      "effects": ["Pain Relief", "Anti-inflammation", "Anti-seizure", "Minimal Psychoactivity"],
      "medicalUses": ["Epilepsy", "Seizure Disorders", "Inflammation", "Pain", "Anxiety"],
      "flavorProfile": ["Earthy", "Olive Oil", "Woody", "Hemp"],
      "cultivationDifficulty": "Moderate",
      "legalStatus": "Farm Bill Compliant in USA",
      "history": "Developed for Charlotte Figi, who had Dravet Syndrome, this strain gained national attention for reducing her seizures dramatically."
    }
  },
  {
    id: 8,
    title: "Colorado Retail Cannabis Compliance Checklist",
    description: "Comprehensive checklist covering all compliance requirements for retail cannabis operations in Colorado.",
    category: "Compliance",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LegalDocument",
      "name": "Colorado Retail Cannabis Compliance Checklist",
      "description": "Comprehensive checklist covering all compliance requirements for retail cannabis operations in Colorado.",
      "jurisdiction": "Colorado, United States",
      "legislationIdentifier": "1 CCR 212-3",
      "legislationType": "Regulation",
      "datePublished": "2022-08-01",
      "dateModified": "2023-03-10",
      "regulatoryAuthority": {
        "@type": "Organization",
        "name": "Colorado Marijuana Enforcement Division",
        "url": "https://sbg.colorado.gov/med"
      },
      "complianceAreas": [
        {
          "area": "Licensing",
          "requirements": ["State license", "Local license", "Badge requirements for employees", "Ownership disclosure"]
        },
        {
          "area": "Security",
          "requirements": ["Video surveillance", "Alarm systems", "Limited access areas", "Visitor management"]
        },
        {
          "area": "Inventory Control",
          "requirements": ["Seed-to-sale tracking", "Daily reconciliation", "METRC compliance", "Transport manifests"]
        },
        {
          "area": "Product Safety",
          "requirements": ["Lab testing", "Packaging standards", "Labeling requirements", "Child-resistant packaging"]
        },
        {
          "area": "Record Keeping",
          "requirements": ["Sales records", "Inventory records", "Employee records", "Tax documentation"]
        }
      ],
      "penalties": {
        "administrative": "Fines up to $100,000",
        "license": "Suspension or revocation",
        "criminal": "Possible criminal charges for severe violations"
      },
      "relatedLink": "https://sbg.colorado.gov/med-rules"
    }
  }
];

const Directory = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState(MOCK_DIRECTORY_DATA);
  
  // Parse query parameters (for direct links to filtered categories)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      const categoryMap: Record<string, string> = {
        'medical': 'Medical',
        'genetics': 'Genetics',
        'labdata': 'Lab Data',
        'cultivation': 'Cultivation',
        'compliance': 'Compliance',
        'consumer': 'Consumer'
      };
      
      const category = categoryMap[categoryParam.toLowerCase()];
      if (category) {
        setActiveFilters({ [categoryParam.toLowerCase()]: true });
        setFilteredData(MOCK_DIRECTORY_DATA.filter(item => item.category === category));
      }
    }
  }, [location.search]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, activeFilters);
  };
  
  const handleFilter = (filters: Record<string, boolean>) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };
  
  const applyFilters = (term: string, filters: Record<string, boolean>) => {
    const filterKeys = Object.keys(filters).filter(key => filters[key]);
    
    let result = [...MOCK_DIRECTORY_DATA];
    
    // Apply search term filter
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowercaseTerm) || 
        item.description.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    // Apply category filters
    if (filterKeys.length > 0) {
      const categoryMap: Record<string, string> = {
        'medical': 'Medical',
        'genetics': 'Genetics',
        'labData': 'Lab Data',
        'cultivation': 'Cultivation',
        'compliance': 'Compliance',
        'consumer': 'Consumer'
      };
      
      result = result.filter(item => {
        for (const key of filterKeys) {
          if (categoryMap[key] === item.category) {
            return true;
          }
        }
        return false;
      });
    }
    
    setFilteredData(result);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl font-bold mb-2">Cannabis Directory</h1>
            <p className="text-muted-foreground">
              Browse our extensive database of AI-optimized cannabis information, categorized for easy discovery and integration.
            </p>
            
            <div className="mt-8">
              <SearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                className="mb-8"
              />
            </div>
          </div>
          
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <DirectoryCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  category={item.category}
                  jsonLd={item.jsonLd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-muted-foreground">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto mb-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p>
                  Try adjusting your search or filter criteria
                </p>
              </div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters({});
                  setFilteredData(MOCK_DIRECTORY_DATA);
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                border border-input bg-background hover:bg-accent hover:text-accent-foreground 
                h-9 px-4 py-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Directory;
