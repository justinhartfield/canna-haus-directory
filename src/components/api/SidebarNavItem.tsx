
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
        active 
          ? "bg-cannabis-100 dark:bg-cannabis-900/40 text-cannabis-800 dark:text-cannabis-200 font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
};

export default SidebarNavItem;
