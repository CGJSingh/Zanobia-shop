import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag, Sparkles, ArrowRight, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/woocommerce';
import SEO from '../components/SEO';
import ImageWithFallback from '../components/ImageWithFallback';

/**
 * OrdersWithSuggestions - Premium Post-Order Experience
 * 
 * A luxury, single-page post-order flow with:
 * 1. Order confirmation with celebration
 * 2. Suggested products carousel
 * 3. Embedded cart for easy checkout continuation
 * 
 * All transitions happen on the same page with smooth animations
 * 
 * @page
 */
export default function OrdersWithSuggestions() {
  const navigate = useNavigate();
  const { items, addToCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  
  // Page flow stages
  const [stage, setStage] = useState('order'); // 'order' | 'suggestions' | 'cart'
  
  // Suggested products
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // Confetti/sparkle animation state
  const [showSparkles, setShowSparkles] = useState(true);

  // Fetch suggested products when moving to suggestions stage
  useEffect(() => {
    if (stage === 'suggestions' && suggestedProducts.length === 0) {
      fetchSuggestedProducts();
    }
  }, [stage]);

  // Auto-hide sparkles after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSparkles(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Fetch suggested products (popular/featured items)
   */
  const fetchSuggestedProducts = async () => {
    setLoadingSuggestions(true);
    try {
      const products = await getProducts({
        per_page: 8,
        orderby: 'popularity',
        featured: true
      });
      setSuggestedProducts(products);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Use fallback products or show error
      setSuggestedProducts([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /**
   * Stage transition handlers
   */
  const handleContinueShopping = () => {
    setStage('suggestions');
  };

  const handleSkipToCart = () => {
    setStage('cart');
  };

  const handleGoToCart = () => {
    setStage('cart');
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
  };

  /**
   * Format price
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    animate: (i) => ({
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        delay: i * 0.1,
        repeat: 2,
        ease: "easeInOut"
      }
    })
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

  return (
    <>
      <SEO 
        title="Order Confirmation - Zanobia"
        description="Thank you for your order! Continue shopping or view your cart."
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* ===== STAGE 1: ORDER CONFIRMATION ===== */}
          <AnimatePresence mode="wait">
            {stage === 'order' && (
              <motion.div
                key="order-stage"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                {/* Sparkle/Confetti Animation */}
                {showSparkles && (
                  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={sparkleVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      >
                        <Sparkles className="w-6 h-6 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2 
                  }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl shadow-green-500/30 mb-8"
                >
                  <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Thank You!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-2"
                >
                  Your order has been placed successfully
                </motion.p>

                {/* Order Number */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-lg text-gray-500 dark:text-gray-400 mb-12"
                >
                  Order #{Math.floor(Math.random() * 90000) + 10000}
                </motion.p>

                {/* Golden Divider */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '120px' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-12"
                />

                {/* Continue Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueShopping}
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300"
                >
                  Continue Shopping
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.button>

                {/* Secondary Action */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="mt-6"
                >
                  <Link
                    to="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium underline-offset-4 hover:underline transition-colors"
                  >
                    Return to Home
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* ===== STAGE 2: SUGGESTED PRODUCTS ===== */}
            {stage === 'suggestions' && (
              <motion.div
                key="suggestions-stage"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl mb-6"
                  >
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </motion.div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    You Might Also Love
                  </h2>
                  
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Complete your collection with these handpicked items
                  </p>
                </div>

                {/* Products Grid */}
                {loadingSuggestions ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md animate-pulse">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    initial="hidden"
                    animate="visible"
                  >
                    {suggestedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        custom={index}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <ImageWithFallback
                            src={product.images?.[0]?.src || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            placeholder="product"
                          />
                          
                          {/* Quick Add Button */}
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            onClick={() => handleAddSuggestion(product)}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </motion.button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
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
                    onClick={handleGoToCart}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Go to Cart ({items.length})
                  </button>
                  
                  <button
                    onClick={handleSkipToCart}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-bold hover:border-amber-500 dark:hover:border-amber-400 hover:scale-105 transition-all duration-300"
                  >
                    Skip
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ===== STAGE 3: EMBEDDED CART ===== */}
            {stage === 'cart' && (
              <motion.div
                key="cart-stage"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Cart
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
                </div>

                {items.length === 0 ? (
                  /* Empty Cart State */
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Add some items to get started</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  /* Cart Items */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
                        >
                          {/* Product Image */}
                          <Link to={`/product/${item.id}`} className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-xl hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProduct%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.id}`}
                              className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              {item.quantity > 1 ? (
                                <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </button>
                            
                            <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                          >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Shipping</span>
                            <span className="font-semibold">Calculated at checkout</span>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                            <span>Total</span>
                            <span className="text-amber-600 dark:text-amber-400">{formatPrice(totalPrice)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/checkout')}
                          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mb-3"
                        >
                          Proceed to Checkout
                        </button>

                        <Link
                          to="/products"
                          className="block text-center py-3 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                        >
                          Continue Shopping
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

