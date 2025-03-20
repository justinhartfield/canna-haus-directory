
import React from 'react';

interface NoResultsViewProps {
  onClearFilters: () => void;
}

const NoResultsView: React.FC<NoResultsViewProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-muted-foreground">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mx-auto mb-4"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p>
          Try adjusting your search or filter criteria
        </p>
      </div>
      <button 
        onClick={onClearFilters}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
        border border-input bg-background hover:bg-accent hover:text-accent-foreground 
        h-9 px-4 py-2"
      >
        Clear filters
      </button>
    </div>
  );
};

export default NoResultsView;
