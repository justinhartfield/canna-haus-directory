
import React from 'react';

const ErrorState: React.FC = () => {
  return (
    <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
      <p>Error loading data. Please try again later.</p>
    </div>
  );
};

export default ErrorState;
