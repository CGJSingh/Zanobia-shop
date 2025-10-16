import React from 'react';

const StayUpdatedShimmer = () => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern Shimmer */}
      <div className="absolute inset-0 bg-gray-800/50 animate-skeleton-pulse"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title Shimmer */}
        <div className="mb-8">
          <div className="h-10 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-80 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-96"></div>
        </div>

        {/* Newsletter Form Shimmer */}
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Email Input Shimmer */}
            <div className="flex-1 h-12 bg-gray-700 rounded-lg animate-skeleton-pulse"></div>
            {/* Subscribe Button Shimmer */}
            <div className="h-12 bg-gray-700 rounded-lg animate-skeleton-pulse w-32"></div>
          </div>
        </div>

        {/* Social Links Shimmer */}
        <div className="flex justify-center space-x-6 mt-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-10 h-10 bg-gray-700 rounded-full animate-skeleton-pulse"></div>
          ))}
        </div>

        {/* Contact Info Shimmer */}
        <div className="mt-8 space-y-2">
          <div className="h-4 bg-gray-700 rounded animate-skeleton-pulse mx-auto w-64"></div>
          <div className="h-4 bg-gray-700 rounded animate-skeleton-pulse mx-auto w-48"></div>
        </div>
      </div>
    </section>
  );
};

export default StayUpdatedShimmer;
