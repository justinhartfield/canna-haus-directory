
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDirectoryItems } from '@/api/directoryService';
import { DirectoryItem } from '@/types/directory';
import { useQuery } from '@tanstack/react-query';

export const useDirectoryFilters = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<DirectoryItem[]>([]);
  
  // Fetch directory items from Supabase
  const { data: directoryItems = [] } = useQuery({
    queryKey: ['directory-items'],
    queryFn: getDirectoryItems,
  });
  
  // Update filtered data when directory items change
  useEffect(() => {
    applyFilters(searchTerm, activeFilters, directoryItems);
  }, [directoryItems]);
  
  // Parse query parameters (for direct links to filtered categories)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      const categoryMap: Record<string, string> = {
        'medical': 'Medical',
        'genetics': 'Genetics',
        'labdata': 'Lab Data',
        'cultivation': 'Cultivation',
        'compliance': 'Compliance',
        'consumer': 'Consumer'
      };
      
      const category = categoryMap[categoryParam.toLowerCase()];
      if (category && directoryItems.length > 0) {
        const newFilters = { [categoryParam.toLowerCase()]: true };
        setActiveFilters(newFilters);
        applyFilters('', newFilters, directoryItems);
      }
    }
  }, [location.search, directoryItems]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, activeFilters, directoryItems);
  };
  
  const handleFilter = (filters: Record<string, boolean>) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters, directoryItems);
  };
  
  const applyFilters = (term: string, filters: Record<string, boolean>, items: DirectoryItem[]) => {
    const filterKeys = Object.keys(filters).filter(key => filters[key]);
    
    let result = [...items];
    
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
    setFilteredData(directoryItems);
  };

  return {
    searchTerm,
    activeFilters,
    filteredData,
    handleSearch,
    handleFilter,
    clearFilters
  };
};
