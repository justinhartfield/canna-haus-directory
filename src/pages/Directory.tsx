
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilter from '@/components/SearchFilter';
import { getDirectoryItems } from '@/api/services/directoryItemService';
import DirectoryCategories from '@/components/directory/DirectoryCategories';
import { useDirectoryFilters } from '@/hooks/useDirectoryFilters';

const Directory = () => {
  const location = useLocation();
  const [searchMode, setSearchMode] = useState(false);
  const { 
    filteredData, 
    handleSearch, 
    handleFilter, 
    clearFilters,
    searchTerm,
    isSearching
  } = useDirectoryFilters();

  const { data: directoryItems = [], isLoading, error } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: getDirectoryItems
  });

  // Check URL for search parameters on mount and navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    // Set search mode if there's a search parameter
    if (searchParam) {
      setSearchMode(true);
      handleSearch(searchParam);
    }
  }, [location.search]);

  const handleSearchInput = (term: string) => {
    handleSearch(term);
    setSearchMode(!!term || isSearching);
  };

  const handleFilterChange = (filters: Record<string, boolean>) => {
    handleFilter(filters);
    setSearchMode(Object.values(filters).some(value => value === true) || isSearching);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchMode(false);
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
                onSearch={handleSearchInput}
                onFilter={handleFilterChange}
                className="mb-8"
              />
            </div>
          </div>
          
          <DirectoryCategories 
            items={directoryItems} 
            filteredItems={filteredData}
            isSearchMode={searchMode}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Directory;
