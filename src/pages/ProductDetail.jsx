/**
 * ProductDetail Page
 * 
 * Detailed product view page with image gallery, variations, and add to cart.
 * Always uses light theme design (bg-gray-50).
 * 
 * Features:
 * - Fetches product data and variations from WooCommerce API
 * - Image gallery with thumbnail selection
 * - Amazon-style zoom on hover (desktop only)
 * - Product variation support (colors with visual swatches)
 * - Dynamic image switching based on selected variation
 * - Quantity selector
 * - Add to cart with variation support
 * - Stock status handling
 * - Product description and categories display
 * - Skeleton loading state
 * - Error handling with navigation back
 * - SEO-friendly with product metadata
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/Loader';
import Error from '../components/Error';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ImageWithFallback from '../components/ImageWithFallback';
import SimilarProducts from '../components/SimilarProducts';
import { getProductById, getProductVariations } from '../api/woocommerce';

const ProductDetail = () => {
  // Get product ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Cart context
  const { addToCart } = useCart();
  
  // Theme context (page is always light, but kept for consistency)
  const { isDark } = useTheme();
  
  // Product data state
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Image zoom states (Amazon-style hover zoom)
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageRef, setImageRef] = useState(null);
  
  // Product variation states
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch product by ID
      const productResponse = await getProductById(id);
      
      setProduct(productResponse);
      
      // Now fetch variations using the actual product ID
      if (productResponse?.id) {
        try {
          const variationsResponse = await getProductVariations(productResponse.id);
          setVariations(variationsResponse);
          
          // Extract color options from variations
          if (variationsResponse && variationsResponse.length > 0) {
            const colors = extractColorOptions(variationsResponse);
            setColorOptions(colors);
          }
        } catch (varErr) {
          // Variations are optional - don't fail the whole page
          console.log('No variations found for product:', productResponse.name);
          setVariations([]);
        }
      }
    } catch (err) {
      setError('Failed to load product. Please try again.');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract color options from variations
  const extractColorOptions = (variations) => {
    const colorMap = new Map();
    
    variations.forEach(variation => {
      if (variation.attributes && variation.attributes.length > 0) {
        const colorAttr = variation.attributes.find(attr => 
          attr.name.toLowerCase().includes('color') || 
          attr.name.toLowerCase().includes('colour')
        );
        
        if (colorAttr && colorAttr.option) {
          const colorName = colorAttr.option;
          if (!colorMap.has(colorName)) {
            colorMap.set(colorName, {
              name: colorName,
              variationId: variation.id,
              image: variation.image?.src || variation.images?.[0]?.src,
              price: variation.price,
              stockStatus: variation.stock_status,
              attributes: variation.attributes
            });
          }
        }
      }
    });
    
    return Array.from(colorMap.values());
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // For variable products, require color selection
    if (colorOptions.length > 0 && !selectedColor) {
      setError('Please select a color option before adding to cart.');
      return;
    }

    setIsAddingToCart(true);
    setError(null);
    
    if (selectedColor) {
      // Add variation to local cart
      addToCart({
        id: selectedColor.variationId,
        name: `${product.name} - ${selectedColor.name}`,
        price: parseFloat(selectedColor.price || product.price),
        image: selectedColor.image || product.images?.[0]?.src || '/placeholder-image.jpg',
        slug: product.slug,
        quantity: quantity
      });
    } else {
      // Simple product - add to local cart
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0]?.src || '/placeholder-image.jpg',
        slug: product.slug,
        quantity: quantity
      });
    }
    
    setCartSuccess(true);
    setTimeout(() => {
      setCartSuccess(false);
      navigate('/cart');
    }, 1500);
    
    setIsAddingToCart(false);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedVariation(color);
    
    // Update main image to show selected color variation
    if (color.image) {
      // Find the image index or add it to the images array
      const existingImageIndex = product.images?.findIndex(img => img.src === color.image);
      if (existingImageIndex !== -1 && existingImageIndex !== undefined) {
        setSelectedImage(existingImageIndex);
      } else {
        // Add variation image to the beginning of images array temporarily
        const updatedImages = [color, ...(product.images || [])];
        setProduct(prev => ({ ...prev, images: updatedImages }));
        setSelectedImage(0);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Helper function to get color value from color name
  const getColorValue = (colorName) => {
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
      'maroon': '#991b1b',
      'teal': '#14b8a6',
      'cyan': '#06b6d4',
      'lime': '#84cc16',
      'indigo': '#6366f1',
      'violet': '#8b5cf6',
      'rose': '#f43f5e',
      'amber': '#f59e0b',
      'emerald': '#10b981',
      'sky': '#0ea5e9',
      'fuchsia': '#d946ef',
      'slate': '#64748b'
    };
    
    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || '#6b7280'; // Default gray
  };

  // Helper function to get pattern for special colors
  const getColorPattern = (colorName) => {
    const normalizedName = colorName.toLowerCase().trim();
    
    if (normalizedName.includes('metallic') || normalizedName.includes('chrome')) {
      return 'linear-gradient(45deg, #c0c0c0 25%, transparent 25%), linear-gradient(-45deg, #c0c0c0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #c0c0c0 75%), linear-gradient(-45deg, transparent 75%, #c0c0c0 75%)';
    }
    
    if (normalizedName.includes('wood') || normalizedName.includes('wooden')) {
      return 'linear-gradient(90deg, #8b4513 0%, #d2691e 50%, #8b4513 100%)';
    }
    
    if (normalizedName.includes('marble') || normalizedName.includes('stone')) {
      return 'radial-gradient(circle at 20% 50%, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)';
    }
    
    return 'none';
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef) return;
    
    const rect = imageRef.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative group">
                {/* Main Image Container */}
                <div 
                  className="aspect-w-1 aspect-h-1 overflow-hidden rounded-xl relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <ImageWithFallback
                    ref={setImageRef}
                    src={product.images?.[selectedImage]?.src || product.localImage}
                    alt={product.name}
                    className="w-full h-96 object-contain transition-transform duration-300 ease-in-out"
                    placeholder="product"
                  />
                  
                  {/* Zoom Overlay - Desktop Only */}
                  <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 md:block hidden ${isZooming ? 'opacity-100' : 'opacity-0'}`}>
                    <div 
                      className="absolute w-24 h-24 bg-white/40 border-2 border-green-400 rounded-full pointer-events-none shadow-lg"
                      style={{
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                </div>

                {/* Zoomed Image - Desktop Only */}
                <div className={`absolute top-0 left-full w-80 h-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 transition-all duration-300 md:block hidden ml-4 ${isZooming ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <ImageWithFallback
                    src={product.images?.[selectedImage]?.src || product.localImage}
                    alt={`${product.name} - Zoomed`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(2.5) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
                      transformOrigin: 'top left',
                    }}
                    placeholder="product"
                  />
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-600'
                      }`}
                    >
                      <ImageWithFallback
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                        placeholder="product"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(selectedColor?.price || product.price)}
                  </span>
                  {product.sale_price && (
                    <span className={`text-xl line-through ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {colorOptions.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Color: {selectedColor ? selectedColor.name : 'Select a color'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorSelect(color)}
                          disabled={color.stockStatus === 'outofstock'}
                          className={`relative group flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                            selectedColor?.name === color.name
                              ? 'border-green-500 bg-green-500/10 text-green-600'
                              : isDark
                                ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-green-400 hover:bg-green-500/5'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
                          } ${color.stockStatus === 'outofstock' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {/* Color Swatch */}
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-400"
                            style={{ 
                              backgroundColor: getColorValue(color.name),
                              backgroundImage: getColorPattern(color.name)
                            }}
                          />
                          <span className="font-medium">{color.name}</span>
                          {color.stockStatus === 'outofstock' && (
                            <span className="text-xs text-red-400">(Out of Stock)</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {!selectedColor && (
                      <p className="text-green-400 text-sm mt-2">
                        Please select a color to continue
                      </p>
                    )}
                  </div>
                )}

                {product.short_description && (
                  <div 
                    className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quantity:
                  </label>
                  <div className={`flex items-center rounded-lg ${isDark ? 'border border-gray-600 bg-gray-700' : 'border border-gray-300 bg-white'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`px-3 py-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                      -
                    </button>
                    <span className={`px-4 py-2 border-x font-medium ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className={`px-3 py-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (colorOptions.length > 0 && !selectedColor)}
                  className={`w-full font-semibold text-lg py-3 rounded-lg transition-all duration-200 shadow-md ${
                    isAddingToCart
                      ? 'bg-green-500 cursor-not-allowed'
                      : colorOptions.length > 0 && !selectedColor
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </div>
                  ) : cartSuccess ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Added to Cart!</span>
                    </div>
                  ) : colorOptions.length > 0 && !selectedColor ? (
                    'Select a Color First'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>

              {/* Product Details */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category.id}
                        className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Description */}
              {product.description && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </h3>
                  <div 
                    className={`prose max-w-none ${isDark ? 'text-gray-300 prose-invert' : 'text-gray-700 prose-gray'}`}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProducts currentProduct={product} limit={8} />
    </div>
  );
};

export default ProductDetail;
