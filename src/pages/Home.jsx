import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/woocommerce';
import { useTheme } from '../context/ThemeContext';
import ImageWithFallback from '../components/ImageWithFallback';
import ProductCategoryPreview from '../components/ProductCategoryPreview';
import ProductCarousel from '../components/ProductCarousel';
import StayUpdated from '../components/StayUpdated';
import FloatingChat from '../components/FloatingChat';
import HomeSkeleton from '../components/HomeSkeleton';
import Error from '../components/Error';

const Home = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products from different categories for variety (v1.0.1)
        const [fetchedProducts] = await Promise.all([
          getProducts({ 
            per_page: 20, // Fetch more for better variety
            orderby: 'popularity', 
            status: 'publish' 
          }),
          new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1 second loading
        ]);
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        // Fallback to empty array if API fails
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <Helmet>
        <title>ZANOBIA - Premium Natural Coconut Charcoal & Hookahs</title>
        <meta 
          name="description" 
          content="Discover ZANOBIA's premium natural coconut charcoal and hookah collection. The best quality products for the longest, most satisfying smoking experience." 
        />
        <meta name="keywords" content="coconut charcoal, hookah, natural charcoal, premium smoking, ZANOBIA" />
      </Helmet>

      <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <main>
          {/* Hero Section with Parallax */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
            >
              <ImageWithFallback
                src="/images/banners/banner.png"
                alt="ZANOBIA Hero Background"
                className="w-full h-full object-cover"
                placeholder="banner"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  The Best Natural
                  <span className="block text-green-400">Coconut Charcoal</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                  Premium quality hookah charcoal for the longest, most satisfying smoking experience
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                  <Link
                    to="/products"
                    className="group relative inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span>Shop Now</span>
                    <svg 
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link
                    to="/about"
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </section>

          {/* Product Category Preview */}
          <ProductCategoryPreview />

          {/* Featured Products Carousel */}
          <ProductCarousel products={products} />

          {/* Stay Updated Section */}
          <StayUpdated />
        </main>

        <FloatingChat />
      </div>
    </>
  );
};

export default Home;