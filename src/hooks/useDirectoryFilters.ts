
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DirectoryItem } from '@/types/directory';
import { getDirectoryItems } from '@/api/services/directoryItemService';

export const useDirectoryFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<DirectoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: directoryItems = [] } = useQuery({
    queryKey: ['directoryItems'],
    queryFn: getDirectoryItems
  });
  
  // Parse query parameters (for direct links to filtered categories or search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) {
      setActiveFilters({ [categoryParam.toLowerCase()]: true });
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
      setIsSearching(true);
    }
  }, [location.search]);
  
  // Update filtered data when directory items change
  useEffect(() => {
    applyFilters(searchTerm, activeFilters);
  }, [directoryItems, searchTerm, activeFilters]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
    
    // Update URL with search parameter
    if (term) {
      const params = new URLSearchParams(location.search);
      params.set('search', term);
      navigate({ search: params.toString() }, { replace: true });
    } else {
      const params = new URLSearchParams(location.search);
      params.delete('search');
      navigate({ search: params.toString() }, { replace: true });
    }
    
    applyFilters(term, activeFilters);
  };
  
  const handleFilter = (filters: Record<string, boolean>) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };
  
  const applyFilters = (term: string, filters: Record<string, boolean>) => {
    const filterKeys = Object.keys(filters).filter(key => filters[key]);
    
    let result = [...directoryItems];
    
    // Apply search term filter
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowercaseTerm) || 
        item.description.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    // Apply category filters
    if (filterKeys.length > 0) {
      const categoryMap: Record<string, string> = {
        'medical': 'Medical',
        'genetics': 'Genetics',
        'labData': 'Lab Data',
        'cultivation': 'Cultivation',
        'compliance': 'Compliance',
        'consumer': 'Consumer'
      };
      
      result = result.filter(item => {
        for (const key of filterKeys) {
          if (categoryMap[key] === item.category) {
            return true;
          }
        }
        return false;
      });
    }
    
    setFilteredData(result);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setIsSearching(false);
    setFilteredData(directoryItems);
    
    // Clear search parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate({ search: params.toString() }, { replace: true });
  };

  return {
    searchTerm,
    activeFilters,
    filteredData,
    isSearching,
    handleSearch,
    handleFilter,
    clearFilters
  };
};
