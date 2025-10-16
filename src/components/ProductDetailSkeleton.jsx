/**
 * ProductDetailSkeleton Component
 * 
 * Skeleton loader placeholder for product detail page.
 * Uses light theme design to match ProductDetail component.
 * 
 * Features:
 * - Complete product detail layout skeleton
 * - Image gallery with main image and thumbnails
 * - Product info section (title, price, description)
 * - Quantity controls and add to cart button
 * - Categories and description skeletons
 * - Animated pulse effect
 * - Light gray skeleton bars (bg-gray-100, bg-gray-200)
 * 
 * @component
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ProductDetailSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images Skeleton */}
            <div className="space-y-4">
              {/* Main Image Skeleton */}
              <div className="relative group">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-xl">
                  <div className={`w-full h-96 animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                </div>
              </div>
              
              {/* Thumbnail Images Skeleton */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className={`w-full h-20 animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              {/* Title Skeleton */}
              <div>
                <div className={`h-8 rounded-lg animate-skeleton-pulse mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-6 rounded-lg animate-skeleton-pulse w-3/4 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Price Skeleton */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`h-8 rounded-lg animate-skeleton-pulse w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-6 rounded-lg animate-skeleton-pulse w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                  <div className={`h-4 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-5/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-4/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              </div>

              {/* Quantity and Add to Cart Skeleton */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`h-4 rounded animate-skeleton-pulse w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center rounded-lg ${isDark ? 'border border-gray-600 bg-gray-700' : 'border border-gray-300 bg-white'}`}>
                    <div className={`w-8 h-8 animate-skeleton-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-12 h-8 animate-skeleton-pulse border-x ${isDark ? 'bg-gray-600 border-gray-600' : 'bg-gray-200 border-gray-300'}`}></div>
                    <div className={`w-8 h-8 animate-skeleton-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  </div>
                </div>

                <div className={`w-full h-12 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>

              {/* Categories Skeleton */}
              <div>
                <div className={`h-4 rounded animate-skeleton-pulse w-20 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-6 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                      style={{ width: `${60 + index * 20}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Description Section Skeleton */}
              <div>
                <div className={`h-6 rounded animate-skeleton-pulse w-24 mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className="space-y-2">
                  <div className={`h-4 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-11/12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-10/12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-9/12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 rounded animate-skeleton-pulse w-8/12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Skeleton Section */}
      <div className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className={`h-8 w-48 rounded-lg animate-skeleton-pulse mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-64 rounded-lg animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            {/* Scroll buttons skeleton */}
            <div className="hidden md:flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {/* Product Cards Skeleton */}
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-64 rounded-xl overflow-hidden ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Image skeleton */}
                <div className={`aspect-square animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                
                {/* Info skeleton */}
                <div className="p-4 space-y-3">
                  <div className={`h-5 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-5 rounded w-3/4 animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-6 w-24 rounded animate-skeleton-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
