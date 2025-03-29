
import React from 'react';
import DirectoryCard from '@/components/DirectoryCard';
import NoResultsView from './NoResultsView';
import { DirectoryItem } from '@/types/directory';

interface DirectoryResultsProps {
  items: DirectoryItem[];
  onClearFilters: () => void;
}

const DirectoryResults: React.FC<DirectoryResultsProps> = ({ items, onClearFilters }) => {
  if (items.length === 0) {
    return <NoResultsView onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DirectoryCard
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          category={item.category}
          jsonLd={item.jsonLd}
          hasExamples={!!item.additionalFields && Object.keys(item.additionalFields).length > 0}
        />
      ))}
    </div>
  );
};

export default DirectoryResults;
