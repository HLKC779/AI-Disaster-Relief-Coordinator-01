
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full my-auto">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400"></div>
  </div>
);
