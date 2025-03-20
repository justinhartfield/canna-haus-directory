
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  ariaLabel,
  className
}) => {
  return (
    <button
      className={cn(
        "text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
