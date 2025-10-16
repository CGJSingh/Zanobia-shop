import React from 'react';
import HeroSkeleton from './HeroSkeleton';
import ProductCategoryPreviewSkeleton from './ProductCategoryPreviewSkeleton';
import ProductCarouselSkeleton from './ProductCarouselSkeleton';
import StayUpdatedSkeleton from './StayUpdatedSkeleton';

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSkeleton />
      <ProductCategoryPreviewSkeleton />
      <ProductCarouselSkeleton />
      <StayUpdatedSkeleton />
    </div>
  );
};

export default HomeSkeleton;
