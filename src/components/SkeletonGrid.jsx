import React from 'react';
import ProductSkeleton from './ProductSkeleton';

const SkeletonGrid = ({ count = 12 }) => {
  // Create skeleton variants to match the masonry layout
  const getSkeletonVariant = (index) => {
    const variants = ['tall', 'wide', 'default', 'default', 'default'];
    return variants[index % variants.length];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <ProductSkeleton 
          key={index} 
          variant="default"
        />
      ))}
    </div>
  );
};

export default SkeletonGrid;
