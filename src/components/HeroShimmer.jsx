import React from 'react';

const HeroShimmer = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Shimmer */}
      <div className="absolute inset-0 w-full h-full bg-gray-800 animate-skeleton-pulse"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>

      {/* Content Shimmer */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Title Shimmer */}
          <div className="space-y-4">
            <div className="h-16 md:h-20 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-4/5"></div>
            <div className="h-16 md:h-20 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-3/5"></div>
          </div>
          
          {/* Subtitle Shimmer */}
          <div className="space-y-2">
            <div className="h-6 md:h-8 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-4/5"></div>
            <div className="h-6 md:h-8 bg-gray-700 rounded-lg animate-skeleton-pulse mx-auto w-3/5"></div>
          </div>

          {/* Buttons Shimmer */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <div className="h-12 bg-gray-700 rounded-lg animate-skeleton-pulse w-32"></div>
            <div className="h-12 bg-gray-700 rounded-lg animate-skeleton-pulse w-32"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator Shimmer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-gray-700 rounded-full animate-skeleton-pulse"></div>
      </div>
    </section>
  );
};

export default HeroShimmer;
