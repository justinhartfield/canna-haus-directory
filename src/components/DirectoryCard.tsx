
import React from 'react';
import { cn } from '@/lib/utils';
import CategoryBadge from './directory/CategoryBadge';
import ActionButton from './directory/ActionButton';
import DirectoryCardFooter from './directory/DirectoryCardFooter';
import { useNavigate } from 'react-router-dom';

interface DirectoryCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  jsonLd: Record<string, any>;
  className?: string;
  id: number;
  examples?: Array<{
    title: string;
    language: string;
    code: string;
    description?: string;
  }>;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
  title,
  description,
  category,
  imageUrl,
  jsonLd,
  className,
  id,
  examples,
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/directory/${id}`);
  };
  
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden hover-card-animation cursor-pointer", 
        className
      )}
      onClick={handleViewDetails}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <CategoryBadge category={category} />
          
          <ActionButton 
            icon={
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
            }
            ariaLabel="View details"
          />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        {examples && examples.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cannabis-600 dark:text-cannabis-400"
            >
              <path d="m16 18 6-6-6-6" />
              <path d="M8 6v12" />
              <path d="m2 12 6 6" />
              <path d="m2 12 6-6" />
            </svg>
            <span className="text-xs font-medium text-cannabis-600 dark:text-cannabis-400">
              {examples.length} Example{examples.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        <DirectoryCardFooter id={id} />
      </div>
    </div>
  );
};

export default DirectoryCard;
