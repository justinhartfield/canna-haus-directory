
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <span className={cn(
      "inline-block bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 text-xs font-medium px-2.5 py-0.5 rounded",
      className
    )}>
      {category}
    </span>
  );
};

export default CategoryBadge;
