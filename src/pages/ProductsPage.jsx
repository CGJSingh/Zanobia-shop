import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/woocommerce';
import LightProductCard from '../components/LightProductCard';
import FiltersSidebar from '../components/FiltersSidebar';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch all products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [products, selectedCategories, priceRange, selectedColors, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products with pagination
      const response = await fetchProducts({
        per_page: 100, // Fetch more products for client-side filtering
        orderby: sortBy,
        order: sortBy === 'price' ? 'asc' : 'desc'
      });
      
      setProducts(response);
      setTotalProducts(response.length);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        product.categories.some(cat =>
          selectedCategories.includes(cat.id.toString())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.attributes || product.attributes.length === 0) return false;
        
        const colorAttr = product.attributes.find(attr =>
          attr.name.toLowerCase().includes('color') ||
          attr.name.toLowerCase().includes('colour')
        );
        
        if (!colorAttr) return false;
        
        return colorAttr.options.some(option =>
          selectedColors.includes(option.toLowerCase())
        );
      });
    }

    // Sort products
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const sortProducts = (productList, sortOption) => {
    const sorted = [...productList];
    
    switch (sortOption) {
      case 'price':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'popularity':
        return sorted.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
      case 'date':
      default:
        return sorted.sort((a, b) =>
          new Date(b.date_created) - new Date(a.date_created)
        );
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('date');
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
          <p className="text-gray-600 mt-2">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FiltersSidebar
              products={products}
              selectedCategories={selectedCategories}
              selectedColors={selectedColors}
              priceRange={priceRange}
              sortBy={sortBy}
              onCategoryChange={handleCategoryChange}
              onColorChange={handleColorChange}
              onPriceChange={handlePriceChange}
              onSortChange={handleSortChange}
              onClearFilters={clearAllFilters}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <LightProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    {currentPage < totalPages ? (
                      // Load More Button
                      <div className="text-center">
                        <button
                          onClick={handleLoadMore}
                          className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg border border-gray-300 transition-colors shadow-sm"
                        >
                          Load More Products
                        </button>
                      </div>
                    ) : (
                      // Page Numbers
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        
                        {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-green-600 text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

