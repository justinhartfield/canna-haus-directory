
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApiSidebar from '@/components/api/ApiSidebar';
import OverviewSection from '@/components/api/sections/OverviewSection';
import AuthenticationSection from '@/components/api/sections/AuthenticationSection';
import RateLimitsSection from '@/components/api/sections/RateLimitsSection';
import VersioningSection from '@/components/api/sections/VersioningSection';
import StrainsSection from '@/components/api/sections/StrainsSection';
import MedicalSection from '@/components/api/sections/MedicalSection';
import ReviewsSection from '@/components/api/sections/ReviewsSection';
import LicensingSection from '@/components/api/sections/LicensingSection';
import AIRecommendationsSection from '@/components/api/sections/AIRecommendationsSection';
import EndpointOptimizationSection from '@/components/api/sections/EndpointOptimizationSection';
import DispensariesSection from '@/components/api/sections/DispensariesSection';
import ConsumptionMethodsSection from '@/components/api/sections/ConsumptionMethodsSection';
import ExtractionTechniquesSection from '@/components/api/sections/ExtractionTechniquesSection';
import LabDataSection from '@/components/api/sections/LabDataSection';
import ComplianceSection from '@/components/api/sections/ComplianceSection';
import SchemaSection from '@/components/api/sections/SchemaSection';
import SdksSection from '@/components/api/sections/SdksSection';

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
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <ApiSidebar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange} 
            />
            
            <div className="lg:w-3/4">
              <OverviewSection />
              <AuthenticationSection />
              <RateLimitsSection />
              <VersioningSection />
              <EndpointOptimizationSection />
              <StrainsSection />
              <MedicalSection />
              <DispensariesSection />
              <ConsumptionMethodsSection />
              <ExtractionTechniquesSection />
              <LabDataSection />
              <ComplianceSection />
              <ReviewsSection />
              <LicensingSection />
              <SchemaSection />
              <SdksSection />
              <AIRecommendationsSection />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ApiDocs;
