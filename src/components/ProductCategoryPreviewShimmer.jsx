import React from 'react';

const ProductCategoryPreviewShimmer = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Shimmer */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-64 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-96"></div>
        </div>

        {/* Categories Grid Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hookahs Category Shimmer */}
          <div className="group relative overflow-hidden rounded-2xl bg-gray-800/95 backdrop-blur-sm border border-gray-600/30">
            <div className="aspect-[4/3] bg-gray-700 animate-skeleton-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="h-8 bg-gray-600 rounded-lg animate-skeleton-pulse w-32 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded-lg animate-skeleton-pulse w-48"></div>
            </div>
          </div>

          {/* Accessories Category Shimmer */}
          <div className="group relative overflow-hidden rounded-2xl bg-gray-800/95 backdrop-blur-sm border border-gray-600/30">
            <div className="aspect-[4/3] bg-gray-700 animate-skeleton-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="h-8 bg-gray-600 rounded-lg animate-skeleton-pulse w-40 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded-lg animate-skeleton-pulse w-56"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryPreviewShimmer;
