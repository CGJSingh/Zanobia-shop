import { motion } from 'framer-motion';
import { Lock, Package, Store, Truck, Percent, ChevronRight, CheckCircle, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

/**
 * Wholesale Page Component
 * 
 * Premium wholesale section with dynamic access control
 * Shows products only to verified business users
 * Includes animated hero, product carousel, benefits, and CTA sections
 * 
 * @page
 */
export default function WholesalePage() {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user has wholesale access
  const isVerifiedBusiness = isAuthenticated && user?.role === 'business' && user?.verified === true;
  const isBusinessPending = isAuthenticated && user?.role === 'business' && user?.verified === false;

  // Mock wholesale products (will be replaced with WooCommerce API)
  const products = [
    { 
      id: 1, 
      name: "Zanobia Premium Clay Bowl", 
      img: "/images/products/placeholder.png", 
      price: "$7.99", 
      unit: "per unit",
      minQty: 10,
      description: "Premium ceramic bowl"
    },
    { 
      id: 2, 
      name: "Zanobia Charcoal Pack", 
      img: "/images/products/placeholder.png", 
      price: "$11.50", 
      unit: "per unit",
      minQty: 5,
      description: "Natural coconut charcoal"
    },
    { 
      id: 3, 
      name: "Zanobia Deluxe Hose", 
      img: "/images/products/placeholder.png", 
      price: "$8.75", 
      unit: "per unit",
      minQty: 6,
      description: "Premium silicone hose"
    },
    { 
      id: 4, 
      name: "Zanobia Flavor Mix Pack", 
      img: "/images/products/placeholder.png", 
      price: "$15.99", 
      unit: "per pack",
      minQty: 4,
      description: "Assorted premium flavors"
    },
    { 
      id: 5, 
      name: "Zanobia Heat Management", 
      img: "/images/products/placeholder.png", 
      price: "$12.25", 
      unit: "per unit",
      minQty: 8,
      description: "Advanced heat control"
    },
  ];

  // Wholesale benefits
  const benefits = [
    {
      icon: Package,
      title: "Bulk Order Discounts",
      description: "Save up to 40% on large quantity orders. Volume-based pricing tiers available.",
      color: "amber"
    },
    {
      icon: Truck,
      title: "Priority Shipping",
      description: "Fast-tracked delivery with dedicated logistics. Free shipping on orders over $500.",
      color: "gray"
    },
    {
      icon: Users,
      title: "Dedicated Account Manager",
      description: "Personal support from our B2B team. Direct line for orders and queries.",
      color: "amber"
    },
    {
      icon: Percent,
      title: "Exclusive Early Access",
      description: "Be first to access new products and seasonal releases before retail launch.",
      color: "gray"
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scrollToProducts = () => {
    document.getElementById('wholesale-products')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <SEO 
        title="Wholesale & Business Orders - Zanobia"
        description="Exclusive wholesale access for verified business partners. Bulk order discounts, priority shipping, and dedicated support."
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        
        {/* ===== 1. HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 z-0">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: "url('/images/banners/wholesale-banner.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Enhanced overlay with better contrast for light mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-amber-900/60 via-gray-800/65 to-black/75 dark:from-gray-900/80 dark:via-amber-900/40 dark:via-gray-800/70 dark:to-black/75 z-10" />
            
            {/* Animated gradient orbs - Subtle golden glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-400 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.15, 1, 1.15],
                opacity: [0.06, 0.1, 0.06],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeInScale} className="inline-block">
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-100/95 dark:bg-amber-900/90 backdrop-blur-md border-2 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-100 text-sm font-semibold shadow-xl">
                  <Store className="w-4 h-4" />
                  Business Partner Program
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 
                variants={fadeInScale}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
              >
                Wholesale & Business Orders
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                variants={fadeInUp}
                className="text-xl sm:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-xl"
                style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)' }}
              >
                Exclusive access for verified business partners. Unlock premium pricing, 
                priority support, and bulk order benefits.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                {isVerifiedBusiness ? (
                  <button
                    onClick={scrollToProducts}
                    className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    Explore Products
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      Register as Business
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/products"
                      className="px-8 py-4 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold hover:bg-gray-800 hover:border-gray-800 hover:scale-105 transition-all duration-300"
                    >
                      Explore Retail Products
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow-2xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)' }}>500+</div>
                  <div className="text-sm text-white mt-1 font-bold drop-shadow-xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)' }}>Business Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-400 drop-shadow-2xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)' }}>40%</div>
                  <div className="text-sm text-white mt-1 font-bold drop-shadow-xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)' }}>Bulk Discounts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow-2xl" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)' }}>24/7</div>
                  <div className="text-sm text-white mt-1 font-bold drop-shadow-xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)' }}>Priority Support</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 dark:text-gray-400"
          >
            <ChevronRight className="w-8 h-8 rotate-90" />
          </motion.div>
        </section>

        {/* ===== 2. ACCESS LOGIC SECTION ===== */}
        <section id="wholesale-products" className="py-20 px-6 sm:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            
            {isVerifiedBusiness ? (
              /* ===== 3. PRODUCT CAROUSEL (Verified Business Only) ===== */
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                {/* Section Header */}
                <div className="text-center mb-12">
                  <motion.div variants={fadeInUp} className="inline-block mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified Access
                    </span>
                  </motion.div>
                  <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Exclusive Wholesale Products
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Premium products at wholesale pricing. Minimum order quantities apply.
                  </motion.p>
                </div>

                {/* Product Carousel */}
                <motion.div 
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="flex-none w-80 snap-center"
                      >
                        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                          {/* Product Image */}
                          <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                            <img 
                              src={product.img} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EZanobia Product%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            {/* Wholesale Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
                                WHOLESALE
                              </span>
                            </div>
                            {/* Min Qty Badge */}
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                Min: {product.minQty} units
                              </span>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {product.description}
                            </p>
                            
                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {product.price}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {product.unit}
                              </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                              <Package className="w-5 h-5" />
                              Add to Cart
                            </button>
                          </div>

                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* View All Products Link */}
                <motion.div variants={fadeInUp} className="text-center mt-8">
                  <Link
                    to="/products?category=wholesale"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                  >
                    View All Wholesale Products
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>

            ) : (
              /* ===== LOCKED ACCESS MESSAGE ===== */
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInScale}
                className="max-w-3xl mx-auto"
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-amber-300/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-500/10 to-gray-700/10 rounded-full blur-3xl" />
                  
                  <div className="relative text-center space-y-6">
                    {/* Lock Icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, -5, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl"
                    >
                      <Lock className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                      Wholesale Access Restricted
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                      {isBusinessPending ? (
                        <>
                          Your business account is <span className="font-semibold text-amber-600 dark:text-amber-400">pending verification</span>. 
                          Our team will review your application within 24-48 hours.
                        </>
                      ) : !isAuthenticated ? (
                        <>
                          Welcome to our <span className="font-semibold text-amber-600 dark:text-amber-400">Business Partner Program</span>! 
                          Register as a business to unlock exclusive wholesale pricing, bulk discounts, and priority support.
                        </>
                      ) : (
                        <>
                          This section is reserved for <span className="font-semibold text-amber-600 dark:text-amber-400">verified business partners</span>. 
                          Upgrade to a business account to access exclusive wholesale pricing and benefits.
                        </>
                      )}
                    </p>

                    {/* Status Badge */}
                    {isBusinessPending ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                        <Clock className="w-4 h-4 animate-pulse" />
                        Verification Pending
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                      {!isBusinessPending && (
                        <Link
                          to="/signup"
                          className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Register as Business
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                      <Link
                        to="/products"
                        className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white border-2 border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white rounded-xl font-bold hover:bg-gray-800 hover:border-gray-800 dark:hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                      >
                        Explore Retail Products
                      </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
                      Need help? <a href="https://wa.me/6479390809?text=Hello!%20I%20have%20a%20question%20about%20wholesale" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-medium inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        Contact our B2B team
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ===== 4. WHOLESALE BENEFITS SECTION ===== */}
        <section className="py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {/* Section Header */}
              <div className="text-center mb-16">
                <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Wholesale Benefits
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join hundreds of businesses that trust Zanobia for their wholesale needs
                </motion.p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  const colorClasses = {
                    gray: 'from-gray-700 to-gray-800',
                    amber: 'from-amber-500 to-amber-600',
                  };

                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Background glow */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[benefit.color]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                      
                      <div className="relative">
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[benefit.color]} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== 5. CTA SECTION ===== */}
        <section className="relative py-24 px-6 sm:px-12 lg:px-24 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(245,158,11,0.3) 0%, transparent 50%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Store className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join Our Business Network
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Partner with Zanobia and unlock exclusive wholesale benefits. 
              Start saving on bulk orders today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Request Verification
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/6479390809?text=Hello!%20I%20want%20to%20learn%20more%20about%20wholesale%20opportunities"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contact B2B Team
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold text-white mb-2">24h</div>
                <div className="text-sm text-white/70">Verification Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">$500+</div>
                <div className="text-sm text-white/70">Free Shipping</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-white/70">Secure Orders</div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}

