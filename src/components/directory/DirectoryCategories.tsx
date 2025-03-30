
import React, { useState } from 'react';
import { DirectoryItem } from '@/types/directory';
import CategoryCard from './CategoryCard';
import DirectoryResults from './DirectoryResults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface DirectoryCategoriesProps {
  items: DirectoryItem[];
  filteredItems: DirectoryItem[];
  isSearchMode: boolean;
  isLoading: boolean;
  error: Error | null;
  onClearFilters: () => void;
}

const DirectoryCategories: React.FC<DirectoryCategoriesProps> = ({
  items,
  filteredItems,
  isSearchMode,
  isLoading,
  error,
  onClearFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DirectoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-64 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Error Loading Directory</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Show search results if we're searching, otherwise continue with normal flow
  if (isSearching) {
    return (
      <>
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directory by title or description..."
              className="pl-9 pr-16"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <DirectoryResults 
          items={searchResults} 
          onClearFilters={clearSearch} 
        />
      </>
    );
  }

  if (isSearchMode) {
    return (
      <>
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directory by title or description..."
              className="pl-9 pr-16"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <DirectoryResults items={filteredItems} onClearFilters={onClearFilters} />
      </>
    );
  }

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category]++;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array for rendering
  const categoryList = Object.entries(categories).map(([category, count]) => ({
    category,
    count
  }));

  // Sort alphabetically
  categoryList.sort((a, b) => a.category.localeCompare(b.category));

  return (
    <>
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory by title or description..."
            className="pl-9 pr-16"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map(({ category, count }) => (
          <CategoryCard
            key={category}
            category={category}
            count={count}
          />
        ))}
      </div>
    </>
  );
};

export default DirectoryCategories;
