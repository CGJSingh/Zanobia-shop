import React from 'react';

const ProductCategoryPreviewSkeleton = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Skeleton */}
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-700/80 rounded-lg animate-skeleton-pulse mx-auto w-80 mb-4"></div>
          <div className="h-6 bg-gray-700/60 rounded-lg animate-skeleton-pulse mx-auto w-64"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hookahs Category Skeleton */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Glassy Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 w-24 h-24 bg-green-400/30 rounded-full blur-xl animate-skeleton-pulse"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 bg-blue-400/30 rounded-full blur-xl animate-skeleton-pulse"></div>
            </div>
            
            <div className="aspect-[4/3] relative p-8">
              {/* Category Cards Grid */}
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-400/40 rounded-full animate-skeleton-pulse"></div>
                </div>
                <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-400/40 rounded-full animate-skeleton-pulse"></div>
                </div>
                <div className="bg-purple-500/20 backdrop-blur-md border border-purple-400/30 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 bg-purple-400/40 rounded-full animate-skeleton-pulse"></div>
                </div>
                <div className="bg-orange-500/20 backdrop-blur-md border border-orange-400/30 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-400/40 rounded-full animate-skeleton-pulse"></div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="h-8 bg-gray-600/80 rounded-lg animate-skeleton-pulse w-32 mb-2"></div>
                <div className="h-4 bg-gray-600/60 rounded animate-skeleton-pulse w-48"></div>
              </div>
            </div>
          </div>

          {/* Accessories Category Skeleton */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Glassy Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            
            <div className="aspect-[4/3] relative p-8">
              {/* Product Images Collage */}
              <div className="grid grid-cols-3 gap-2 h-full">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-700/60 rounded-lg animate-skeleton-pulse"></div>
                ))}
              </div>
              
              {/* Text Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="h-8 bg-gray-600/80 rounded-lg animate-skeleton-pulse w-40 mb-2"></div>
                <div className="h-4 bg-gray-600/60 rounded animate-skeleton-pulse w-56"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryPreviewSkeleton;
