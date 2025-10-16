import React from 'react';

const SearchSkeleton = () => {
  return (
    <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Search bar skeleton */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center">
              <div className="w-6 h-6 bg-white/20 rounded animate-skeleton-pulse"></div>
            </div>
            
            <div className="w-full pl-16 pr-16 py-4">
              <div className="h-6 bg-white/20 rounded animate-skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
