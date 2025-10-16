import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api/woocommerce';

const FiltersSidebar = ({
  products,
  selectedCategories,
  selectedColors,
  priceRange,
  sortBy,
  onCategoryChange,
  onColorChange,
  onPriceChange,
  onSortChange,
  onClearFilters
}) => {
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [isExpanded, setIsExpanded] = useState({
    categories: true,
    price: true,
    colors: true,
    sort: true
  });

  useEffect(() => {
    loadCategories();
    extractColors();
  }, [products]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const extractColors = () => {
    const colorsSet = new Set();
    
    products.forEach(product => {
      if (product.attributes && product.attributes.length > 0) {
        const colorAttr = product.attributes.find(attr =>
          attr.name.toLowerCase().includes('color') ||
          attr.name.toLowerCase().includes('colour')
        );
        
        if (colorAttr && colorAttr.options) {
          colorAttr.options.forEach(option => {
            colorsSet.add(option.toLowerCase());
          });
        }
      }
    });
    
    setAvailableColors(Array.from(colorsSet));
  };

  const toggleSection = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getColorHex = (colorName) => {
    const colorMap = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'orange': '#f97316',
      'black': '#1f2937',
      'white': '#ffffff',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'brown': '#92400e',
      'gold': '#f59e0b',
      'silver': '#9ca3af',
      'navy': '#1e3a8a',
      'teal': '#14b8a6',
      'cyan': '#06b6d4'
    };
    
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Categories Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
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
            {categories.map(category => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id.toString())}
                  onChange={() => onCategoryChange(category.id.toString())}
                  className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
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
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <span className="text-sm font-medium text-gray-900 min-w-[60px]">
                ${priceRange.max}
              </span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors Filter */}
      {availableColors.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="font-semibold text-gray-900">Colors</h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isExpanded.colors ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded.colors && (
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`group relative w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(color)
                      ? 'border-green-600 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                  title={color}
                >
                  {selectedColors.includes(color) && (
                    <svg
                      className="absolute inset-0 w-full h-full text-white p-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort By */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold text-gray-900">Sort By</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
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
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="date">Newest First</option>
            <option value="popularity">Most Popular</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;

