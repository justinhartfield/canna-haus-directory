
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDirectoryItems } from '@/api/directoryService';

interface UseDirectoryFiltersOptions {
  filterUntitled?: boolean;
}

export interface DirectoryFilter {
  categories: string[];
  searchTerm: string;
}

export const useDirectoryFilters = (options: UseDirectoryFiltersOptions = {}) => {
  const { filterUntitled = true } = options;
  const [filters, setFilters] = useState<DirectoryFilter>({
    categories: [],
    searchTerm: '',
  });

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['directory-items'],
    queryFn: getDirectoryItems,
  });

  // Filter data based on search term and categories
  const filteredData = allItems.filter((item) => {
    // Filter out "Untitled Item" if specified
    if (filterUntitled && item.title === "Untitled Item") {
      return false;
    }
    
    // If no active filters, return all items (except untitled if filtered)
    if (filters.searchTerm === '' && filters.categories.length === 0) {
      return true;
    }

    // Check if search term matches
    const matchesSearch = filters.searchTerm === '' || 
      item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(filters.searchTerm.toLowerCase());

    // Check if category filter matches
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(item.category);

    return matchesSearch && matchesCategory;
  });

  // Update search term
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Update category filters
  const handleFilter = (categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      searchTerm: '',
    });
  };

  return {
    filteredData,
    isLoading,
    handleSearch,
    handleFilter,
    clearFilters,
  };
};
