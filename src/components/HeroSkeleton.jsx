import React from 'react';

const HeroSkeleton = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Skeleton */}
      <div className="absolute inset-0 w-full h-full bg-gray-800 animate-skeleton-pulse"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>

      {/* Content Skeleton */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Title Skeleton - Better proportions */}
          <div className="space-y-4">
            <div className="h-12 md:h-16 bg-gray-700/80 rounded-lg animate-skeleton-pulse mx-auto w-5/6 max-w-2xl"></div>
            <div className="h-12 md:h-16 bg-amber-500/30 rounded-lg animate-skeleton-pulse mx-auto w-4/6 max-w-xl"></div>
          </div>
          
          {/* Subtitle Skeleton */}
          <div className="space-y-2">
            <div className="h-5 md:h-6 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-4/5 max-w-xl"></div>
            <div className="h-5 md:h-6 bg-gray-700/60 rounded animate-skeleton-pulse mx-auto w-3/5 max-w-lg"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <div className="h-12 bg-amber-500/40 rounded-lg animate-skeleton-pulse w-32"></div>
            <div className="h-12 bg-gray-700/60 rounded-lg animate-skeleton-pulse w-32"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator Skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-gray-700/60 rounded-full animate-skeleton-pulse"></div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
