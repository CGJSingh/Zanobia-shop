import React from 'react';

const CategorySkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full animate-skeleton-pulse"
        >
          <div className="h-4 w-16 bg-white/20 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
