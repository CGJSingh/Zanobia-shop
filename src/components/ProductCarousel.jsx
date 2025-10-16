import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../api/woocommerce';
import ImageWithFallback from './ImageWithFallback';

const ProductCarousel = ({ products = [] }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured products...');
        const fetchedProducts = await getProducts({ per_page: 8, featured: true });
        console.log('Fetched products:', fetchedProducts);
        // Only use real products from API
        setApiProducts(fetchedProducts || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Try fetching regular products if featured fails
        try {
          console.log('Trying to fetch regular products...');
          const regularProducts = await getProducts({ per_page: 8 });
          console.log('Regular products:', regularProducts);
          setApiProducts(regularProducts || []);
        } catch (regularError) {
          console.error('Error fetching regular products:', regularError);
          setApiProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (products.length === 0) {
      loadProducts();
    } else {
      setApiProducts(products);
      setLoading(false);
    }
  }, [products]);

  const displayProducts = products.length > 0 ? products : apiProducts;
  
  // Duplicate products for infinite loop effect (show 3x for seamless scrolling)
  const infiniteProducts = displayProducts.length > 0 
    ? [...displayProducts, ...displayProducts, ...displayProducts] 
    : [];

  // Auto-scroll effect for infinite loop
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayProducts.length === 0 || !isAutoScrolling) return;

    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        if (!container) return;
        
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        // Smooth scroll to right
        container.scrollLeft += 1;
        
        // Reset to beginning when reaching middle section (seamless loop)
        if (currentScroll >= (container.scrollWidth / 3) * 2) {
          container.scrollLeft = container.scrollWidth / 3;
        }
      }, 30); // Scroll every 30ms for smooth animation
    };

    startAutoScroll();

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [displayProducts, isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    
    // Pause auto-scroll when user manually scrolls
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 3000); // Resume after 3 seconds
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-white mt-4">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no products available, show a message instead of hiding
  if (displayProducts.length === 0) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-xl text-gray-300 mb-8">No featured products available at the moment.</p>
            <p className="text-gray-400">Check back soon for our latest products!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-300">
            Discover our premium collection
          </p>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Product Cards Container - Infinite Loop */}
          <div 
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {infiniteProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex-shrink-0 w-80">
                <div className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <Link to={`/product/${product.slug}`}>
                    <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
                      <ImageWithFallback
                        src={product.images?.[0]?.src || product.localImage || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        placeholder="product"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlistToggle(product);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className={`w-5 h-5 transition-colors ${
                            isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                          }`}
                          fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        {formatPrice(product.price)}
                      </span>
                      
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:scale-105">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-Scroll Indicator */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-all duration-200 text-sm"
              title={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
            >
              {isAutoScrolling ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  <span>Pause Auto-Scroll</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Resume Auto-Scroll</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isAutoScrolling ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
                  }`}
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
