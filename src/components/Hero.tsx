
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-visual-900/30 via-background to-background z-0"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-visual-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-visual-700/10 rounded-full blur-3xl animate-float delay-700"></div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-visual-900/80 text-visual-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Cannabis Photography for AI
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Premium Cannabis Visuals
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            High-quality, AI-ready imagery with structured metadata for researchers, marketers, and developers building the future of cannabis technology.
          </p>
          
          <div className="relative max-w-xl mx-auto mb-8">
            <Input 
              type="text" 
              placeholder="Search for cannabis strain images, cultivation photos..." 
              className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-900/60 border-gray-700 text-white placeholder:text-gray-400 focus:ring-visual-500"
            />
            <Search className="absolute top-3 left-4 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Strains</Link>
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Cultivation</Link>
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Extraction</Link>
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Dispensaries</Link>
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Products</Link>
            <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">#Laboratory</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
