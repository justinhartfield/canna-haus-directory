
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-muted rounded w-full max-w-md"></div>
      <div className="h-64 bg-muted rounded"></div>
    </div>
  );
};

export default LoadingState;
