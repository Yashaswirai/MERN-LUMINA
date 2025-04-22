import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Color classes
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };
  
  const spinnerClasses = `
    ${sizeClasses[size] || sizeClasses.medium}
    ${colorClasses[color] || colorClasses.blue}
    animate-spin rounded-full border-t-transparent
  `;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg flex flex-col items-center">
          <div className={spinnerClasses}></div>
          <p className="mt-3 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;
