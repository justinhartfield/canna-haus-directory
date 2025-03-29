
import React from 'react';
import DirectoryCard from '@/components/DirectoryCard';
import { Link } from 'react-router-dom';
import { DirectoryItem } from '@/types/directory';

interface DirectorySectionProps {
  featuredItems: DirectoryItem[];
}

const DirectorySection: React.FC<DirectorySectionProps> = ({ featuredItems }) => {
  return (
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
  );
};

export default DirectorySection;
