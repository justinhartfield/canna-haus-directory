
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DirectoryItem } from '@/types/directory';
import { getDirectoryItems } from '@/api/services/directoryItem/crudOperations';

export const useDirectoryFilters = () => {
  // States for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({});
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all directory items
  const { data: allItems = [] } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: () => getDirectoryItems(),
  });

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    let filtered = [...allItems];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // Apply category filters
    const activeCategories = Object.entries(categoryFilters)
      .filter(([_, isActive]) => isActive)
      .map(([category]) => category);

    if (activeCategories.length > 0) {
      filtered = filtered.filter(item => 
        activeCategories.includes(item.category)
      );
    }

    return filtered;
  }, [allItems, searchTerm, categoryFilters]);

  // Handler for search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
  }, []);

  // Handler for category filter
  const handleFilter = useCallback((filters: Record<string, boolean>) => {
    setCategoryFilters(filters);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilters({});
    setIsSearching(false);
  }, []);

  return {
    filteredData,
    handleSearch,
    handleFilter,
    clearFilters,
    searchTerm,
    categoryFilters,
    isSearching
  };
};
