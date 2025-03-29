
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilter from '@/components/SearchFilter';
import DirectoryResults from '@/components/directory/DirectoryResults';
import { useDirectoryFilters } from '@/hooks/useDirectoryFilters';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Directory = () => {
  const [showUntitled, setShowUntitled] = useState(false);
  
  const { 
    filteredData, 
    handleSearch, 
    handleFilter, 
    clearFilters 
  } = useDirectoryFilters({
    filterUntitled: !showUntitled
  });

  // Helper function to convert filter object to categories array
  const handleFilterChange = (filters: Record<string, boolean>) => {
    const selectedCategories = Object.keys(filters).filter(key => filters[key]);
    handleFilter(selectedCategories);
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
                onFilter={handleFilterChange}
                className="mb-8"
              />
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch 
                  id="show-untitled" 
                  checked={showUntitled}
                  onCheckedChange={setShowUntitled}
                />
                <Label htmlFor="show-untitled">Show untitled items</Label>
              </div>
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
