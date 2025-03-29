
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilter from '@/components/SearchFilter';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { useDirectoryFilters } from '@/hooks/useDirectoryFilters';

// We don't need to redefine DirectoryItem here since we're using the one from useDirectoryFilters

const Directory = () => {
  const { 
    filteredData, 
    handleSearch, 
    handleFilter, 
    clearFilters 
  } = useDirectoryFilters();

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
          
          <DirectoryResults 
            items={filteredData} 
            onClearFilters={clearFilters} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Directory;
