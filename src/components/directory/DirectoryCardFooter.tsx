
import React from 'react';
import { Link } from 'react-router-dom';
import ActionButton from './ActionButton';

interface DirectoryCardFooterProps {
  id: string;
}

const DirectoryCardFooter: React.FC<DirectoryCardFooterProps> = ({ id }) => {
  return (
    <div className="flex items-center justify-between">
      <Link 
        to={`/directory/detail/${id}`} 
        className="text-xs inline-flex items-center gap-1 text-cannabis-700 dark:text-cannabis-300 hover:text-cannabis-800 dark:hover:text-cannabis-200 font-medium"
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
      </Link>
      
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
  );
};

export default DirectoryCardFooter;
