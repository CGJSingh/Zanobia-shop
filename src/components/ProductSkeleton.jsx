/**
 * ProductSkeleton Component
 * 
 * Skeleton loader placeholder for product cards.
 * Uses light theme design to match ProductCard component.
 * 
 * Features:
 * - Animated pulse effect on skeleton elements
 * - Shimmer overlay animation
 * - Variant support for different heights (default, tall, wide)
 * - Matches ProductCard layout structure
 * - Light gray skeleton bars (bg-gray-100, bg-gray-200)
 * 
 * @component
 * @param {Object} props
 * @param {string} props.variant - Skeleton variant ('default', 'tall', 'wide')
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ProductSkeleton = ({ variant = 'default' }) => {
  const { isDark } = useTheme();
  /**
   * Get responsive height classes based on variant
   * @returns {string} Tailwind height classes
   */
  const getSkeletonHeight = () => {
    switch (variant) {
      case 'tall':
        return 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[520px]';
      case 'wide':
        return 'h-[350px] sm:h-[380px] md:h-[420px] lg:h-[450px]';
      default:
        return 'h-[380px] sm:h-[420px] md:h-[460px] lg:h-[480px]';
    }
  };

  return (
    <div className={`group relative rounded-xl overflow-hidden shadow-md ${getSkeletonHeight()} ${
      variant === 'wide' ? 'col-span-2' : ''
    } ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      {/* Image skeleton */}
      <div className="relative h-[55%] overflow-hidden">
        <div className={`w-full h-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
        
        {/* Wishlist button skeleton */}
        <div className={`absolute top-3 right-3 p-2 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
          <div className={`w-5 h-5 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
        </div>
        
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className={`px-2 py-1 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div className={`h-3 w-12 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 h-[45%] flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className={`h-5 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-5 rounded w-3/4 animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          
          {/* Category skeleton */}
          <div className={`h-6 w-20 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className={`h-3 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded w-2/3 animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {/* Bottom section skeleton */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {/* Price skeleton */}
            <div className={`h-6 w-16 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Stock status skeleton */}
            <div className={`h-6 w-16 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            
            {/* Add to cart button skeleton */}
            <div className={`p-2 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect overlay */}
      <div className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-white/10' : 'via-white/40'}`}></div>
    </div>
  );
};

export default ProductSkeleton;
