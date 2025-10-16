/**
 * Cart Component
 * 
 * Displays shopping cart items with the ability to update quantities and remove items.
 * Shows color information in a separate line below product name.
 * Shows suggested products before displaying the cart.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/woocommerce';
import { ShoppingBag, ArrowRight, Plus, X } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import SimilarProducts from '../components/SimilarProducts';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Stage management: 'suggestions' or 'cart'
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasShownSuggestions, setHasShownSuggestions] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);
  
  // Show suggestions on first visit or when just added an item
  useEffect(() => {
    // Show suggestions if:
    // 1. User just added an item (from location state), OR
    // 2. Cart has items and we haven't shown suggestions yet
    if (items.length > 0 && !hasShownSuggestions) {
      setShowSuggestions(true);
      setHasShownSuggestions(true);
      fetchSuggestedProducts();
    }
  }, [items.length, hasShownSuggestions]);
  
  // Reset hasShownSuggestions when cart becomes empty
  useEffect(() => {
    if (items.length === 0) {
      setHasShownSuggestions(false);
      setShowSuggestions(false);
    }
  }, [items.length]);
  
  /**
   * Fetch suggested products
   */
  const fetchSuggestedProducts = async () => {
    setLoadingSuggestions(true);
    try {
      // Fetch popular products (removed featured filter to avoid timeout)
      const products = await getProducts({
        per_page: 8,
        orderby: 'popularity',
        status: 'publish'
      });
      
      console.log('✅ Fetched suggested products:', products.length);
      setSuggestedProducts(products || []);
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
      
      // Try a simpler query as fallback
      try {
        console.log('🔄 Trying fallback query...');
        const fallbackProducts = await getProducts({
          per_page: 8,
          status: 'publish'
        });
        setSuggestedProducts(fallbackProducts || []);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        setSuggestedProducts([]);
      }
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  /**
   * Add suggested product to cart
   */
  const handleAddSuggestion = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.src || '/placeholder-image.jpg',
      slug: product.slug,
      quantity: 1
    });
    
    // Show added feedback
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };
  
  /**
   * Skip suggestions and go to cart
   */
  const handleSkipToCart = () => {
    setShowSuggestions(false);
  };

  /**
   * Format price to currency
   * @param {number} price - Price value
   * @returns {string} - Formatted price
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  /**
   * Extract color from product name
   * Looks for color after separators like -, /, |, ()
   * @param {string} name - Product name
   * @returns {string|null} - Extracted color or null
   */
  const extractColor = (name) => {
    if (!name) return null;

    // Common separators used in product names
    const separators = [' - ', ' / ', ' | ', ' (', ')'];
    
    for (const separator of separators) {
      if (name.includes(separator)) {
        const parts = name.split(separator);
        // The color is usually the last part
        const lastPart = parts[parts.length - 1].trim();
        // Check if it looks like a color (not too long)
        if (lastPart.length < 20) {
          return lastPart;
        }
      }
    }

    return null;
  };

  /**
   * Get base product name without color
   * @param {string} name - Full product name
   * @param {string} color - Color to remove
   * @returns {string} - Base product name
   */
  const getBaseName = (name, color) => {
    if (!color) return name;

    const patterns = [
      ` - ${color}`,
      ` / ${color}`,
      ` | ${color}`,
      ` (${color})`,
      ` ${color}`
    ];

    let baseName = name;
    for (const pattern of patterns) {
      const regex = new RegExp(pattern + '$', 'i');
      baseName = baseName.replace(regex, '');
    }

    return baseName.trim();
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className={`w-24 h-24 mx-auto mb-6 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your cart is empty
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Shopping
            </Link>
          </div>

          {/* Similar Products Carousel - Only shown when cart is empty */}
          <div className="mt-16">
            <SimilarProducts 
              showPopular={true}
              limit={12}
              title="You May Also Like"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== SUGGESTIONS STAGE (Shows first when justAdded) ===== */}
        <AnimatePresence mode="wait">
          {showSuggestions ? (
            <motion.div
              key="suggestions"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-12"
            >
              {/* Skip to Cart Button - Fixed at top */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end mb-6"
              >
                <button
                  onClick={handleSkipToCart}
                  className={`group px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${
                    isDark
                      ? 'bg-gray-800 text-white border-2 border-gray-600 hover:border-green-500'
                      : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-green-600'
                  }`}
                >
                  Skip to Cart
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl mb-6`}
                >
                  <ShoppingBag className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  You Might Also Love
                </h2>
                
                <div className={`w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6`} />
                
                <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Complete your collection with these handpicked items
                </p>
              </div>

              {/* Products Grid */}
              {loadingSuggestions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`rounded-2xl p-6 shadow-md animate-pulse ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className={`aspect-square rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <div className={`h-5 rounded w-3/4 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <div className={`h-6 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                  initial="hidden"
                  animate="visible"
                >
                  {suggestedProducts.slice(0, 8).map((product, index) => {
                    const isAdded = addedProductId === product.id;
                    
                    return (
                    <motion.div
                      key={product.id}
                      custom={index}
                      variants={cardVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative aspect-square overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <ImageWithFallback
                          src={product.images?.[0]?.src || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          placeholder="product"
                        />
                        
                        {/* Success Badge */}
                        {isAdded && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Added!
                          </motion.div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className={`font-semibold line-clamp-2 transition-colors flex-1 ${
                            isDark 
                              ? 'text-white group-hover:text-blue-400' 
                              : 'text-gray-900 group-hover:text-blue-600'
                          }`}>
                            {product.name}
                          </h3>
                          
                          {/* Prominent Add Button */}
                          <button
                            onClick={() => handleAddSuggestion(product)}
                            disabled={isAdded}
                            className={`flex-shrink-0 p-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 ${
                              isAdded
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110'
                            }`}
                            title={isAdded ? 'Added to cart' : 'Add to cart'}
                          >
                            {isAdded ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        
                        <p className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={handleSkipToCart}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  View Cart ({items.length})
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <Link
                  to="/products"
                  className={`px-8 py-4 border-2 rounded-xl font-bold hover:scale-105 transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 text-white border-gray-600 hover:border-blue-400'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ===== MAIN CART VIEW (Shows when not showing suggestions) ===== */}
        {!showSuggestions && (
          <>
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h1>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Guest Checkout Banner */}
            {!isAuthenticated && (
              <div className={`mb-6 p-6 rounded-2xl shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start">
                    <svg className={`w-6 h-6 mt-1 mr-3 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Guest Checkout Available
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        You can checkout as a guest, or login to save your order history and track shipments.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link
                      to="/login?redirect=/cart"
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-medium text-center transition-all ${
                        isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-medium text-center transition-all ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                      }`}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Logged In User Welcome */}
            {isAuthenticated && user && (
              <div className={`mb-6 p-4 rounded-xl ${
                isDark 
                  ? 'bg-green-900/20 border border-green-800' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                    Logged in as <strong>{user.firstName || user.username}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className={`${isDark ? 'divide-y divide-gray-600' : 'divide-y divide-gray-200'}`}>
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image - Clickable */}
                      <Link 
                        to={`/product/${item.id}`} 
                        className="flex-shrink-0 group"
                        title="View product details"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {(() => {
                          const color = extractColor(item.name);
                          const baseName = color ? getBaseName(item.name, color) : item.name;
                          
                          return (
                            <>
                              <Link 
                                to={`/product/${item.id}`}
                                className="block group"
                                title="View product details"
                              >
                                <h3 className={`text-lg font-semibold truncate transition-colors duration-200 ${
                                  isDark 
                                    ? 'text-white group-hover:text-green-400' 
                                    : 'text-gray-900 group-hover:text-green-600'
                                }`}>
                                  {baseName}
                                </h3>
                              </Link>
                              {color && (
                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Color: <span className="font-medium">{color}</span>
                                </p>
                              )}
                            </>
                          );
                        })()}
                        <p className="text-green-600 font-semibold mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 p-2 transition-colors duration-200"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className={`p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <button
                  onClick={clearCart}
                  className={`font-medium transition-colors duration-200 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-md p-6 sticky top-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Tax</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Calculated at checkout</span>
                </div>
                <div className={`pt-3 ${isDark ? 'border-t border-gray-600' : 'border-t border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link 
                to="/checkout"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3 rounded-lg transition-all duration-200 mb-4 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-center"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Continue as Guest'}
              </Link>

              {/* Guest Checkout Note */}
              {!isAuthenticated && (
                <p className={`text-xs text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Or{' '}
                  <Link to="/login?redirect=/cart" className="text-blue-600 hover:underline dark:text-blue-400">
                    login
                  </Link>
                  {' '}to save your order history
                </p>
              )}
              
              <Link 
                to="/products" 
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
