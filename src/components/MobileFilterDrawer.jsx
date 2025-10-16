import React from 'react';
import FilterSidebar from './FilterSidebar';

const MobileFilterDrawer = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] glass-sidebar border-r border-gray-600/30 z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800/95 backdrop-blur-sm border-t border-gray-600/30">
          <div className="flex space-x-3">
            <button
              onClick={onClearFilters}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;
