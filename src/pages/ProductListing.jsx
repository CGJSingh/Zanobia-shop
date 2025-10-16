/**
 * ProductListing Page
 * 
 * Main product catalog page with filtering, sorting, and search functionality.
 * Always uses light theme design (bg-gray-50).
 * 
 * Features:
 * - Fetches all products from WooCommerce API on mount
 * - Client-side filtering by category, price range, and search term
 * - Real-time search with debouncing
 * - Multiple sort options (newest, price, name, popularity)
 * - Responsive filter sidebar (desktop) / drawer (mobile)
 * - URL parameter support for deep linking
 * - Load more pagination
 * - Skeleton loading states
 * - Error handling with retry
 * - Back to top button
 * 
 * @component
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/woocommerce';
import { useTheme } from '../context/ThemeContext';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import MobileFilterDrawer from '../components/MobileFilterDrawer';
import BackToTop from '../components/BackToTop';
import Error from '../components/Error';

const ProductListing = () => {
  // Theme context (page is always light, but kept for consistency)
  const { isDark } = useTheme();
  
  // Product and category data
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL search parameters for deep linking
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('date');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'date') params.set('sort', sortBy);
    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, setSearchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a minimum loading time to see skeleton loading
      const [data] = await Promise.all([
        fetchProducts({ per_page: 100 }), // Load more products for better filtering
        new Promise(resolve => setTimeout(resolve, 500)) // Minimum 500ms loading
      ]);
      
      setAllProducts(data || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.short_description && product.short_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.categories && product.categories.some(cat => cat.id === parseInt(selectedCategory))
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort products
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        // Sort by featured first, then by date
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date_created) - new Date(a.date_created);
        });
        break;
      default: // 'date'
        filtered.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  const handlePriceRangeChange = useCallback((newRange) => {
    setPriceRange(newRange);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('date');
    setPriceRange({ min: 0, max: 1000 });
  }, []);

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }


  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 relative">
        {/* Products Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-6">
            {/* Title and Mobile Filter Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Our Products
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 transition-colors duration-300 ${isDark ? 'text-gray-400 group-focus-within:text-green-400' : 'text-gray-500 group-focus-within:text-green-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-sm ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-400 hover:border-gray-600'
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                  }`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 hover:scale-110 ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 lg:ml-0">
            <ProductGrid products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        onClearFilters={clearFilters}
      />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default ProductListing;