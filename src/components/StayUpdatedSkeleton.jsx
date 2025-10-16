import React from 'react';

const StayUpdatedSkeleton = () => {
  return (
    <section className="relative py-20 bg-gray-900 overflow-hidden">
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-gray-800/80 animate-skeleton-pulse"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-700/30 to-gray-800/50"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-12 bg-gray-700/80 rounded-lg animate-skeleton-pulse mx-auto w-96"></div>
          <div className="h-8 bg-gray-700/60 rounded-lg animate-skeleton-pulse mx-auto w-80"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-3 mb-12">
          <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-full max-w-2xl"></div>
          <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-4/5 max-w-xl"></div>
        </div>

        {/* Newsletter Form Skeleton */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="flex gap-4">
            <div className="flex-1 h-14 bg-gray-700/60 rounded-lg animate-skeleton-pulse"></div>
            <div className="h-14 bg-amber-500/40 rounded-lg animate-skeleton-pulse w-36"></div>
          </div>
        </div>

        {/* Social Links Skeleton */}
        <div className="flex justify-center space-x-8 mb-12">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-12 h-12 bg-gray-700/60 rounded-full animate-skeleton-pulse flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-600/60 rounded animate-skeleton-pulse"></div>
            </div>
          ))}
        </div>

        {/* Contact Info Skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-80"></div>
          <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-64"></div>
          <div className="h-5 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-48"></div>
        </div>
      </div>
    </section>
  );
};

export default StayUpdatedSkeleton;
