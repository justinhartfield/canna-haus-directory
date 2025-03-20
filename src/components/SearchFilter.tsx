
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: Record<string, boolean>) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    medical: false,
    genetics: false,
    labData: false,
    cultivation: false,
    compliance: false,
    consumer: false,
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleFilterChange = (filter: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [filter]: !filters[filter],
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="search"
          className="block w-full pl-10 pr-4 py-2.5 text-sm text-foreground rounded-lg 
          border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cannabis-500"
          placeholder="Search strains, products, or categories..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <FilterButton 
          active={filters.medical} 
          onClick={() => handleFilterChange('medical')}
        >
          Medical
        </FilterButton>
        <FilterButton 
          active={filters.genetics} 
          onClick={() => handleFilterChange('genetics')}
        >
          Genetics
        </FilterButton>
        <FilterButton 
          active={filters.labData} 
          onClick={() => handleFilterChange('labData')}
        >
          Lab Data
        </FilterButton>
        <FilterButton 
          active={filters.cultivation} 
          onClick={() => handleFilterChange('cultivation')}
        >
          Cultivation
        </FilterButton>
        <FilterButton 
          active={filters.compliance} 
          onClick={() => handleFilterChange('compliance')}
        >
          Compliance
        </FilterButton>
        <FilterButton 
          active={filters.consumer} 
          onClick={() => handleFilterChange('consumer')}
        >
          Consumer
        </FilterButton>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full transition-colors",
        active 
          ? "bg-cannabis-500 text-white" 
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      )}
    >
      {children}
    </button>
  );
};

export default SearchFilter;
