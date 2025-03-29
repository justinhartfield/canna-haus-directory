
// Sample data for featured directory items
export const featuredItems = [
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
