
import React from 'react';
import { DirectoryItem } from '@/types/directory';
import CategoryCard from './CategoryCard';
import DirectoryResults from './DirectoryResults';
import { Button } from '@/components/ui/button';

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

  if (isSearchMode) {
    return <DirectoryResults items={filteredItems} onClearFilters={onClearFilters} />;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryList.map(({ category, count }) => (
        <CategoryCard
          key={category}
          category={category}
          count={count}
        />
      ))}
    </div>
  );
};

export default DirectoryCategories;
