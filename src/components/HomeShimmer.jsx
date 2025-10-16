import React from 'react';
import HeroShimmer from './HeroShimmer';
import ProductCategoryPreviewShimmer from './ProductCategoryPreviewShimmer';
import ProductCarouselShimmer from './ProductCarouselShimmer';
import StayUpdatedShimmer from './StayUpdatedShimmer';
import FloatingChat from './FloatingChat';

const HomeShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <main>
        {/* Hero Section Shimmer */}
        <HeroShimmer />

        {/* Product Category Preview Shimmer */}
        <ProductCategoryPreviewShimmer />

        {/* Featured Products Carousel Shimmer */}
        <ProductCarouselShimmer />

        {/* Stay Updated Section Shimmer */}
        <StayUpdatedShimmer />
      </main>

      <FloatingChat />
    </div>
  );
};

export default HomeShimmer;
