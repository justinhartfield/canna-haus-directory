
import React from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import DirectorySection from '@/components/home/DirectorySection';
import ApiSection from '@/components/home/ApiSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import { featuredItems } from '@/components/home/FeaturedItemsData';

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Directory Items */}
        <DirectorySection featuredItems={featuredItems} />
        
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
