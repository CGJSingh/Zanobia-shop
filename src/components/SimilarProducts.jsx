/**
 * SimilarProducts Component
 * 
 * Displays a horizontal scrolling carousel of similar/related products.
 * 
 * Features:
 * - Fetches products from WooCommerce REST API
 * - Two modes:
 *   1. Category Mode: Filters by same category as current product
 *   2. Popular Mode: Fetches popular products from all categories
 * - Horizontal infinite scroll with product cards
 * - Add to Cart functionality
 * - Responsive design with loading skeletons
 * - Hover effects and smooth animations
 * - Clickable cards that navigate to product detail page
 * - Graceful error handling
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.currentProduct - The current product being viewed (optional for popular mode)
 * @param {number} props.limit - Maximum number of similar products to show (default: 8)
 * @param {string} props.title - Custom title for the carousel (default: "Similar Products" or "You May Also Like")
 * @param {boolean} props.showPopular - If true, shows popular products instead of category-based (default: false)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../api/woocommerce";
import { motion, AnimatePresence } from "framer-motion";

export default function SimilarProducts({ currentProduct, limit = 8, title, showPopular = false }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);

        let params = {
          per_page: limit + 5, // Fetch extra to filter out current product
          orderby: 'popularity',
          status: 'publish',
        };

        // Mode 1: Show popular products (for empty cart)
        if (showPopular) {
          console.log('SimilarProducts: Fetching popular products');
          // Fetch most popular products from all categories
        } 
        // Mode 2: Show category-based similar products (for product detail)
        else if (currentProduct) {
          console.log('SimilarProducts: Fetching for product:', currentProduct.name);
          const categoryIds = currentProduct.categories?.map(cat => cat.id) || [];
          
          if (categoryIds.length > 0) {
            params.category = categoryIds[0];
            console.log('SimilarProducts: Filtering by category ID:', params.category);
          }
        } else {
          // No current product and not showing popular - return empty
          setLoading(false);
          return;
        }

        // Fetch products using WooCommerce API
        const products = await getProducts(params);

        // Filter out current product if in category mode
        let filtered = products;
        if (currentProduct) {
          filtered = products.filter(p => p.id !== currentProduct.id);
        }
        
        // Limit results
        filtered = filtered.slice(0, limit);
        
        console.log('SimilarProducts: Displaying', filtered.length, 'products');
        setSimilarProducts(filtered);
      } catch (err) {
        console.error("SimilarProducts: Error fetching:", err);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentProduct, limit, showPopular]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.src || '/placeholder.png',
      slug: product.slug,
      quantity: 1
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const displayTitle = title || (showPopular ? "You May Also Like" : "Similar Products");

  // Loading skeleton
  if (loading) {
    return (
      <section className={`mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {displayTitle}
        </h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`min-w-[200px] sm:min-w-[240px] flex-shrink-0 rounded-2xl shadow-lg overflow-hidden animate-pulse ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`w-full h-48 sm:h-56 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className="p-4 space-y-3">
                <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-6 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-10 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!similarProducts.length) return null;

  return (
    <section className={`mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {displayTitle}
        </h2>
        
        <div className="relative">
          {/* Horizontal Scrollable Container */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            <AnimatePresence>
              {similarProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="snap-start"
                >
                  <div
                    className={`min-w-[200px] sm:min-w-[240px] flex-shrink-0 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {/* Product Image - Clickable */}
                    <div
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="cursor-pointer group overflow-hidden"
                    >
                      <img
                        src={product.images?.[0]?.src || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      {/* Product Name - Clickable */}
                      <h3
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className={`text-sm sm:text-base font-semibold line-clamp-2 cursor-pointer transition-colors ${
                          isDark 
                            ? 'text-white hover:text-green-400' 
                            : 'text-gray-900 hover:text-green-600'
                        }`}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <p className="text-lg sm:text-xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Scroll Hint for Desktop - Purely decorative, no interaction */}
          {similarProducts.length > 4 && (
            <div 
              className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full shadow-lg ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              style={{ pointerEvents: 'none' }}
              aria-hidden="true"
            >
              <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

