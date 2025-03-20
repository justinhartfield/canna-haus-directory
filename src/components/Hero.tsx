
import React from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <div className={cn(
      "relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24",
      className
    )}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full">
          <div className="absolute top-1/3 -left-64 w-96 h-96 bg-cannabis-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-64 w-96 h-96 bg-cannabis-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block animate-slide-down opacity-0 animation-delay-200 bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            The First AI-Ready Cannabis Directory
          </span>
          
          <h1 className="animate-slide-down opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            Structured Cannabis Data <br className="hidden sm:block" />
            <span className="text-cannabis-600 dark:text-cannabis-400">Built for AI Consumption</span>
          </h1>
          
          <p className="animate-slide-down opacity-0 text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            A standardized, open data platform featuring cannabis genetics, lab tests, medical conditions, and compliance information - all optimized for AI integration and analysis.
          </p>
          
          <div className="animate-slide-down opacity-0 flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
            bg-cannabis-600 text-white hover:bg-cannabis-700 h-10 px-8 py-2 relative overflow-hidden group">
              <span className="relative z-10">Explore Directory</span>
              <span className="absolute inset-0 bg-cannabis-700 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
            
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
            border border-cannabis-200 dark:border-cannabis-800 bg-transparent hover:bg-cannabis-50 dark:hover:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 
            h-10 px-8 py-2">
              API Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
