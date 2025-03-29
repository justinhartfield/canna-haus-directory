
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import DirectorySection from '@/components/home/DirectorySection';
import ApiSection from '@/components/home/ApiSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import { getDirectoryItems } from '@/api/directoryService';

const Index = () => {
  const { data: directoryItems, isLoading } = useQuery({
    queryKey: ['featured-directory-items'],
    queryFn: getDirectoryItems,
    select: (data) => data.filter(item => item.title !== "Untitled Item").slice(0, 3),
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Directory Items */}
        <DirectorySection 
          featuredItems={directoryItems || []} 
        />
        
        {/* API Section */}
        <ApiSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* CTA Section */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
