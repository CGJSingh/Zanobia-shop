/**
 * ProductGrid Component
 * 
 * Displays a grid of product cards with load more functionality.
 * Shows theme-aware skeleton loaders during data fetching.
 * 
 * Features:
 * - Responsive grid layout (1-3 columns)
 * - Load more pagination (6 products per batch)
 * - Theme-aware skeleton loading states
 * - Empty state with helpful message
 * - Results count display
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {boolean} props.loading - Loading state
 */

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useTheme } from '../context/ThemeContext';

const ProductGrid = ({ products, loading }) => {
  const { isDark } = useTheme();
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Initialize visible products when products array changes
   * Shows first 6 products (2 rows of 3 columns on desktop)
   */
  useEffect(() => {
    if (products.length > 0) {
      setVisibleProducts(products.slice(0, 6)); // Show first 6 products (2 rows)
      setHasMore(products.length > 6);
    } else {
      setVisibleProducts([]);
      setHasMore(false);
    }
  }, [products]);

  /**
   * Load more products (next 6)
   * Simulates loading delay for better UX
   */
  const loadMoreProducts = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentCount = visibleProducts.length;
      const nextBatch = products.slice(currentCount, currentCount + 6);
      setVisibleProducts(prev => [...prev, ...nextBatch]);
      setHasMore(currentCount + 6 < products.length);
      setIsLoadingMore(false);
    }, 500);
  };

  /**
   * Loading State - Show theme-aware skeleton loaders
   * Display 6 skeleton cards (2 rows) to match initial load
   */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton 
            key={index} 
            variant="default"
          />
        ))}
      </div>
    );
  }

  /**
   * Empty State - No products found
   * Theme-aware styling for empty state message
   */
  if (visibleProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 mx-auto mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No products found
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMoreProducts}
            disabled={isLoadingMore}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {isLoadingMore ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                <span>Loading more...</span>
              </div>
            ) : (
              'Load More Products'
            )}
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing {visibleProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductGrid;