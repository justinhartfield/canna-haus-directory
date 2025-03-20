
import React from 'react';
import { cn } from '@/lib/utils';

interface DirectoryCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  jsonLd: Record<string, any>;
  className?: string;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
  title,
  description,
  category,
  imageUrl,
  jsonLd,
  className,
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden hover-card-animation", 
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-2.5 py-0.5 rounded">
            {category}
          </span>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View details"
          >
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
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <button 
            className="text-xs inline-flex items-center gap-1 text-cannabis-700 dark:text-cannabis-300 hover:text-cannabis-800 dark:hover:text-cannabis-200 font-medium"
            onClick={() => console.log(jsonLd)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v6H8.5A3.5 3.5 0 0 1 5 5.5z" />
              <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
              <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
              <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
              <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
            </svg>
            View JSON-LD
          </button>
          
          <div className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              120+ Reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;
