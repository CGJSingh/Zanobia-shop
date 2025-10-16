/**
 * ProductListingSkeleton Component
 * 
 * Complete skeleton loader for the Product Listing page.
 * Includes header, sidebar, and product grid skeletons.
 * Theme-aware styling that adapts to light/dark mode.
 * 
 * Features:
 * - Theme-aware backgrounds and borders
 * - Shimmer animation effects
 * - Matches actual layout structure
 * - Responsive grid (1-3 columns)
 * - Filter sidebar skeleton
 * - Search bar skeleton
 * 
 * @component
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ProductSkeleton from './ProductSkeleton';

const ProductListingSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col space-y-6">
            {/* Title and Mobile Filter Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="space-y-3">
                {/* Title Skeleton */}
                <div className={`h-10 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} style={{ width: '250px' }}></div>
                {/* Product Count Skeleton */}
                <div className={`h-6 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} style={{ width: '150px' }}></div>
              </div>

              {/* Mobile Filter Button Skeleton */}
              <div className={`lg:hidden h-10 w-32 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="w-full max-w-md">
              <div className={`h-12 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-full lg:w-80 lg:max-w-sm">
            <div className={`rounded-xl p-6 sticky top-8 h-fit min-h-[800px] ${
              isDark
                ? 'bg-gray-800 border border-gray-700 shadow-lg'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`h-6 w-16 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-8 w-24 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>

              {/* Categories Section */}
              <div className="space-y-4 mb-6">
                <div className={`h-6 w-24 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                      <div className={`h-4 flex-1 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Section */}
              <div className="space-y-4 mb-6">
                <div className={`h-6 w-32 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-full rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="flex justify-between">
                  <div className={`h-4 w-16 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 w-16 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              </div>

              {/* Sort Section */}
              <div className="space-y-4">
                <div className={`h-6 w-20 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-10 w-full rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} variant="default" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Overlay Effect */}
      <div className={`fixed inset-0 pointer-events-none ${isDark ? 'opacity-5' : 'opacity-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};

export default ProductListingSkeleton;

