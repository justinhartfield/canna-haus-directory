
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
}

export const DataFilters: React.FC<DataFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-full"
        />
      </div>
      
      <Select 
        value={selectedCategory || ''} 
        onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-full md:w-60">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
};
