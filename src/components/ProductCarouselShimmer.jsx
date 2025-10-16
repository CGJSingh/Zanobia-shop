import React from 'react';

const ProductCarouselShimmer = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Shimmer */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-80 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-64"></div>
        </div>

        {/* Products Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/30 rounded-xl overflow-hidden shadow-lg">
              {/* Product Image Shimmer */}
              <div className="aspect-[4/5] bg-gray-700 animate-skeleton-pulse"></div>
              
              {/* Product Info Shimmer */}
              <div className="p-4 space-y-3">
                {/* Title Shimmer */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-skeleton-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-skeleton-pulse w-3/4"></div>
                </div>
                
                {/* Category Shimmer */}
                <div className="h-3 bg-gray-700 rounded-full animate-skeleton-pulse w-20"></div>
                
                {/* Price and Button Shimmer */}
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-700 rounded animate-skeleton-pulse w-16"></div>
                  <div className="h-8 bg-gray-700 rounded animate-skeleton-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows Shimmer */}
        <div className="flex justify-center mt-8 space-x-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-skeleton-pulse"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-skeleton-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselShimmer;
