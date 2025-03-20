
export const MOCK_DIRECTORY_DATA = [
  {
    id: 1,
    title: "Blue Dream",
    description: "A sativa-dominant hybrid strain that provides a balanced high with full-body relaxation and gentle cerebral invigoration.",
    category: "Genetics",
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
    hasExamples: true,
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
  },
  {
    id: 9,
    title: "Green Leaf Dispensary",
    description: "Full-service cannabis dispensary offering medical and recreational products with delivery options and detailed inventory.",
    category: "Dispensaries",
    hasExamples: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "Green Leaf Dispensary",
      "description": "Full-service cannabis dispensary offering medical and recreational products with delivery options and detailed inventory.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "420 Main Street",
        "addressLocality": "Boulder",
        "addressRegion": "CO",
        "postalCode": "80302",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "40.0150",
        "longitude": "-105.2705"
      },
      "storeType": ["Medical", "Recreational"],
      "telephone": "+13031234567",
      "openingHours": "Mo-Su 09:00-21:00",
      "paymentAccepted": ["Cash", "Debit Card", "CanPay"],
      "priceRange": "$$",
      "inventory": {
        "categories": ["Flower", "Concentrates", "Edibles", "Tinctures", "Topicals", "Accessories"],
        "featuredProducts": [
          "Blue Dream (Flower)",
          "Northern Lights (Flower)",
          "Cherry Kush Wax (Concentrate)",
          "CBD Relief Balm (Topical)"
        ],
        "inventoryUpdateFrequency": "Daily"
      },
      "ratings": {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "156"
        },
        "aspects": {
          "productQuality": "4.9",
          "staffKnowledge": "4.7",
          "valueForMoney": "4.5",
          "atmosphere": "4.8"
        }
      },
      "specialOffers": [
        "10% off first purchase",
        "Happy Hour: 15% off concentrates 4-6pm daily",
        "Senior discount: 10% every Tuesday"
      ],
      "deliveryDetails": {
        "available": true,
        "radius": "15 miles",
        "minimumOrder": "USD 50",
        "estimatedTime": "45-60 minutes",
        "fee": "USD 5 (free for orders over USD 100)"
      },
      "accessibility": {
        "wheelchairAccessible": true,
        "parkingAvailable": true,
        "petFriendly": false,
        "adaCompliant": true,
        "curbsidePickup": true
      }
    }
  },
  {
    id: 10,
    title: "Vaporization Consumption Method",
    description: "Detailed guide to cannabis vaporization, covering devices, techniques, efficiency, onset times, and health considerations.",
    category: "Consumption Methods",
    hasExamples: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Vaporization Consumption Method",
      "description": "Detailed guide to cannabis vaporization, covering devices, techniques, efficiency, onset times, and health considerations.",
      "methodType": "Vaping",
      "advantages": [
        "Reduced respiratory risks compared to smoking",
        "More efficient cannabinoid extraction",
        "Less odor than combustion methods",
        "Precise temperature control for targeting specific compounds",
        "Immediate onset of effects"
      ],
      "disadvantages": [
        "Higher initial cost for quality devices",
        "Requires charging or power source",
        "Some learning curve for optimal use",
        "Regular maintenance required",
        "Less portable than some other methods"
      ],
      "dosageGuidelines": {
        "beginners": "1-2 inhalations, waiting 10-15 minutes between doses",
        "moderate": "3-5 inhalations per session",
        "experienced": "5+ inhalations as needed",
        "idealTemperatures": {
          "lowTemp": "320-356°F (160-180°C): Targeting terpenes and flavor",
          "midTemp": "356-392°F (180-200°C): Balanced effects",
          "highTemp": "392-428°F (200-220°C): Maximum extraction, stronger effects"
        }
      },
      "onsetAndDuration": {
        "onset": "Within 1-3 minutes",
        "peak": "10-30 minutes",
        "duration": "1-3 hours depending on strain and quantity"
      },
      "requiredEquipment": [
        "Dry herb vaporizer, concentrate vaporizer, or vape pen",
        "Grinder (for flower)",
        "Cleaning tools and isopropyl alcohol",
        "Charging equipment",
        "Storage container for material"
      ],
      "bestPractices": [
        "Grind flower to medium consistency for optimal airflow",
        "Clean device regularly to maintain flavor and efficiency",
        "Start with lower temperatures and work up",
        "Pack chamber loosely for better airflow",
        "Stay hydrated during sessions"
      ],
      "safetyTips": [
        "Purchase vaporizers only from reputable manufacturers",
        "Avoid black market vape cartridges",
        "Replace coils and atomizers as recommended",
        "Allow device to cool between intensive sessions",
        "Store batteries safely away from metal objects"
      ],
      "userExperiences": [
        {
          "userProfile": "Medical patient with asthma",
          "feedback": "Vaporizing at low temperatures allows me to medicate without triggering my asthma symptoms like smoking did."
        },
        {
          "userProfile": "Daily recreational user",
          "feedback": "The efficiency of vaporizing means my cannabis lasts nearly twice as long compared to smoking."
        },
        {
          "userProfile": "Occasional user",
          "feedback": "The ability to precisely control the temperature helps me avoid feeling overwhelmed or anxious."
        }
      ]
    }
  },
  {
    id: 11,
    title: "CO₂ Extraction Technique",
    description: "Comprehensive overview of supercritical and subcritical CO₂ extraction methods for cannabis, equipment specifications, and quality outcomes.",
    category: "Extraction Techniques",
    hasExamples: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "name": "CO₂ Extraction Technique",
      "description": "Comprehensive overview of supercritical and subcritical CO₂ extraction methods for cannabis, equipment specifications, and quality outcomes.",
      "techniqueType": "CO₂ Extraction",
      "articleBody": "Carbon dioxide extraction utilizes CO₂ in its supercritical state to act as a solvent, stripping essential oils, cannabinoids, and terpenes from cannabis plant material. The process can be finely tuned by adjusting temperature and pressure to target specific compounds.",
      "extractionMethods": {
        "supercritical": {
          "description": "Uses CO₂ above its critical point (31.1°C, 1,071 PSI) where it displays properties of both gas and liquid",
          "bestFor": "Full-spectrum extracts with higher throughput",
          "typicalParameters": "Pressure: 1,500-5,000 PSI, Temperature: 32-60°C"
        },
        "subcritical": {
          "description": "Uses CO₂ below its critical point where it remains in a liquid state",
          "bestFor": "Terpene preservation and more selective extraction",
          "typicalParameters": "Pressure: 800-1,070 PSI, Temperature: 25-30°C"
        }
      },
      "equipmentRequired": [
        {
          "name": "CO₂ Extraction System",
          "description": "Complete closed-loop system with pressure vessels, pumps, heat exchangers, and separation vessels",
          "approxCost": "$100,000-$500,000",
          "recommendedSuppliers": ["Apeks Supercritical", "Waters", "Eden Labs", "Precision Extraction"]
        },
        {
          "name": "Chiller System",
          "description": "For cooling CO₂ and maintaining consistent temperatures",
          "approxCost": "$15,000-$40,000"
        },
        {
          "name": "Dewaxing Column",
          "description": "For winterization process within the extraction system",
          "approxCost": "$5,000-$15,000"
        },
        {
          "name": "Material Preparation Equipment",
          "description": "Grinders, mills, and decarboxylation ovens",
          "approxCost": "$10,000-$30,000"
        },
        {
          "name": "Post-Processing Equipment",
          "description": "Rotary evaporators, vacuum ovens, filtration systems",
          "approxCost": "$20,000-$50,000"
        }
      ],
      "qualityDifferences": {
        "advantages": [
          "Solvent-free final product (CO₂ completely dissipates)",
          "Selective extraction capability through parameter adjustment",
          "No toxic residues",
          "Preserves terpene profiles when properly executed",
          "Extended shelf life of final product"
        ],
        "purityLevels": {
          "crude": "70-80% cannabinoids with plant waxes and chlorophyll",
          "refined": "85-95% cannabinoids after winterization and filtration",
          "distilled": "95-99% isolated cannabinoids after distillation"
        },
        "comparisons": {
          "vsEthanol": "Less aggressive than ethanol, better terpene preservation but lower throughput",
          "vsHydrocarbon": "Safer process with no residual solvents, but typically lower yields of certain compounds"
        }
      },
      "safetyConsiderations": {
        "risks": [
          "High-pressure systems require proper engineering and maintenance",
          "Asphyxiation risk in case of large CO₂ leaks",
          "Pressure vessel failures can be catastrophic if not properly maintained"
        ],
        "requiredSafety": [
          "CO₂ monitoring systems",
          "Pressure relief valves",
          "Emergency shutdown systems",
          "Regular pressure vessel inspections",
          "Staff training and certification"
        ],
        "certifications": [
          "Pressure vessel certification",
          "ASME certification for components",
          "Engineer sign-off on installation",
          "Local fire marshal approval",
          "Staff OSHA compliance training"
        ]
      },
      "yieldData": {
        "averageYield": "8-12% by weight from raw flower",
        "costAnalysis": {
          "setupCosts": "$200,000-$500,000",
          "operatingCosts": "$1,000-$2,000 per day including labor, power, and CO₂",
          "roi": "Typically 1-2 years at commercial scale"
        },
        "efficiencyFactors": [
          "Starting material quality and moisture content",
          "Grind size and packing density",
          "Run time and flow rate optimization",
          "Pressure and temperature parameter optimization",
          "Collection efficiency and post-processing methods"
        ]
      }
    }
  }
]
