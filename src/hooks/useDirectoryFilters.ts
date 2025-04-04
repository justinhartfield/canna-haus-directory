
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_DIRECTORY_DATA } from '@/data/mockDirectoryData';
import { DirectoryItem } from '@/types/directory';

// Convert the mock data to match the DirectoryItem interface
const convertedMockData: DirectoryItem[] = MOCK_DIRECTORY_DATA.map(item => ({
  ...item,
  id: item.id.toString(), // Convert number id to string
  createdAt: new Date().toISOString(), // Add missing required field
  updatedAt: new Date().toISOString(), // Add missing required field
}));

export const useDirectoryFilters = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<DirectoryItem[]>(convertedMockData);
  
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
      if (category) {
        setActiveFilters({ [categoryParam.toLowerCase()]: true });
        setFilteredData(convertedMockData.filter(item => item.category === category));
      }
    }
  }, [location.search]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, activeFilters);
  };
  
  const handleFilter = (filters: Record<string, boolean>) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };
  
  const applyFilters = (term: string, filters: Record<string, boolean>) => {
    const filterKeys = Object.keys(filters).filter(key => filters[key]);
    
    let result = [...convertedMockData];
    
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
    setFilteredData(convertedMockData);
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
