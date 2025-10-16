import React from 'react';

const ProductCarouselSkeleton = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-700/80 rounded-lg animate-skeleton-pulse mx-auto w-96 mb-4"></div>
          <div className="h-6 bg-gray-700/60 rounded-lg animate-skeleton-pulse mx-auto w-80"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="group bg-gray-800/95 backdrop-blur-sm border border-gray-600/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Product Image Skeleton */}
              <div className="aspect-[4/5] bg-gray-700/80 animate-skeleton-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/40 to-gray-800/40"></div>
                {/* Wishlist Icon Skeleton */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-600/60 rounded-full animate-skeleton-pulse"></div>
              </div>
              
              {/* Product Info Skeleton */}
              <div className="p-6 space-y-4">
                {/* Title Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 bg-gray-700/80 rounded animate-skeleton-pulse"></div>
                  <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse w-4/5"></div>
                </div>
                
                {/* Category Skeleton */}
                <div className="h-4 bg-gray-700/60 rounded-full animate-skeleton-pulse w-24"></div>
                
                {/* Price and Button Skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 bg-gray-700/80 rounded animate-skeleton-pulse w-20"></div>
                  <div className="h-10 bg-gray-700/60 rounded-lg animate-skeleton-pulse w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows Skeleton */}
        <div className="flex justify-center mt-12 space-x-4">
          <div className="w-12 h-12 bg-gray-700/60 rounded-full animate-skeleton-pulse flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600/60 rounded animate-skeleton-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-700/60 rounded-full animate-skeleton-pulse flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600/60 rounded animate-skeleton-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSkeleton;
