/**
 * FilterSidebar Component
 * 
 * Sidebar filter panel for product listing page.
 * Always uses light theme design (white background).
 * 
 * Features:
 * - Category filtering with radio buttons
 * - Price range slider (min: $0, max: $500)
 * - Sort options (newest, popularity, name, price)
 * - Collapsible sections
 * - "Clear All" button to reset filters
 * - Sticky positioning on desktop
 * - Green accent for selected items
 * - Responsive: full-width on mobile, sidebar on desktop
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.categories - Array of WooCommerce categories
 * @param {string} props.selectedCategory - Currently selected category ID
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @param {string} props.sortBy - Current sort option
 * @param {Function} props.onSortChange - Callback when sort changes
 * @param {Object} props.priceRange - Object with min and max price
 * @param {Function} props.onPriceRangeChange - Callback when price range changes
 * @param {Function} props.onClearFilters - Callback to clear all filters
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const FilterSidebar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters 
}) => {
  // Theme context (not actively used as sidebar is always light, kept for consistency)
  const { isDark } = useTheme();
  
  // State to track which filter sections are expanded/collapsed
  const [isExpanded, setIsExpanded] = useState({
    categories: true,
    price: true,
    sort: true
  });

  /**
   * Toggle expand/collapse state of a filter section
   * @param {string} section - Section name ('categories', 'price', or 'sort')
   */
  const toggleSection = (section) => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-full lg:w-80 lg:max-w-sm">
      <div className={`rounded-xl p-6 sticky top-8 h-fit min-h-[800px] ${
        isDark
          ? 'bg-gray-800 border border-gray-700 shadow-lg'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h2>
          <button
            onClick={onClearFilters}
            className={`text-sm px-3 py-1 rounded-lg transition-all duration-300 border ${
              isDark
                ? 'text-green-400 hover:text-green-300 border-green-500 hover:border-green-400 hover:bg-green-500/10'
                : 'text-green-600 hover:text-green-700 border-green-500 hover:border-green-600 hover:bg-green-50'
            }`}
          >
            Clear All
          </button>
        </div>

        {/* Categories Filter */}
        <div className="mb-6 relative z-10">
          <button
            onClick={() => toggleSection('categories')}
            className={`flex items-center justify-between w-full font-medium mb-3 transition-all duration-300 p-2 rounded-lg ${
              isDark
                ? 'text-white hover:text-green-400 hover:bg-gray-700'
                : 'text-gray-900 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <span>Categories</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded.categories ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded.categories && (
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer hover-glow p-2 rounded-lg transition-all duration-300">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategory === ''}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className={`w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2 transition-all duration-300 ${
                    selectedCategory === '' ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/50' : ''
                  }`}
                />
                <span className={`text-sm transition-all duration-300 ${
                  selectedCategory === '' 
                    ? 'text-green-600 font-semibold'
                    : isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>All Products</span>
              </label>
              
              {categories.map((category) => (
                <label key={category.id} className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-all duration-300 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id.toString()}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={`w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2 transition-all duration-300 ${
                      selectedCategory === category.id.toString() ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/50' : ''
                    }`}
                  />
                  <span className={`text-sm transition-all duration-300 ${
                    selectedCategory === category.id.toString() 
                      ? 'text-green-600 font-semibold'
                      : isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6 relative z-10">
          <button
            onClick={() => toggleSection('price')}
            className={`flex items-center justify-between w-full font-medium mb-3 transition-all duration-300 p-2 rounded-lg ${
              isDark
                ? 'text-white hover:text-green-400 hover:bg-gray-700'
                : 'text-gray-900 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <span>Price Range</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded.price ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded.price && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-green-400 text-sm font-medium min-w-[60px]">
                  ${priceRange.max}
                </span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="mb-6 relative z-10">
          <button
            onClick={() => toggleSection('sort')}
            className={`flex items-center justify-between w-full font-medium mb-3 transition-all duration-300 p-2 rounded-lg ${
              isDark
                ? 'text-white hover:text-green-400 hover:bg-gray-700'
                : 'text-gray-900 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <span>Sort By</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded.sort ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded.sort && (
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700 border border-gray-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
            >
              <option value="date">Newest First</option>
              <option value="popularity">Most Popular</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          )}
        </div>

        {/* Results Summary */}
        <div className="pt-4 border-t border-gray-600/30 relative z-10">
          <p className="text-gray-400 text-sm">
            Showing filtered results
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
