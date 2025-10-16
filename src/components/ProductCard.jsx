/**
 * ProductCard Component
 * 
 * Displays a single product in a card layout with modern light theme design.
 * Used in product listing pages and carousels.
 * 
 * Features:
 * - White card background with subtle shadow
 * - Product image with fallback handling
 * - Hover effects (slight scale up)
 * - Wishlist heart icon (top right corner)
 * - Product name, category, and price display
 * - Green "Add to Cart" button
 * - Responsive height using relative units
 * - Stock status handling (disables button if out of stock)
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.product - Product object from WooCommerce API
 * @param {number} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.price - Product price
 * @param {Array} props.product.images - Array of product images
 * @param {string} props.product.stock_status - Stock status (instock/outofstock)
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ImageWithFallback from './ImageWithFallback';

const ProductCard = ({ product }) => {
  // Track hover state for animations
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Wishlist functionality
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Cart functionality
  const { addToCart } = useCart();
  
  // Theme context (not used here as card is always light, but kept for future flexibility)
  const { isDark } = useTheme();

  /**
   * Format price to USD currency
   * @param {string|number} price - Price value
   * @returns {string} Formatted price string (e.g., "$29.99")
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  /**
   * Toggle product in wishlist
   * Prevents event propagation to avoid triggering card click navigation
   * @param {Event} e - Click event
   */
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0]?.src || '/placeholder-image.jpg',
        slug: product.slug
      });
    }
  };

  /**
   * Add product to shopping cart and navigate to cart with suggestions
   * Prevents event propagation to avoid triggering card click navigation
   * @param {Event} e - Click event
   */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.src || '/placeholder-image.jpg',
      slug: product.slug,
      quantity: 1
    });
    
    // Navigate to cart with state to trigger suggestions
    navigate('/cart', { state: { justAdded: true } });
  };

  /**
   * Get product USP/tagline from meta or description
   * Falls back to first category name or "Premium Quality"
   * @returns {string} Product unique selling point
   */
  const getProductUSP = () => {
    if (product.meta_data) {
      const uspMeta = product.meta_data.find(meta => meta.key === 'usp' || meta.key === 'tagline');
      if (uspMeta) return uspMeta.value;
    }
    return product.categories?.[0]?.name || 'Premium Quality';
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div 
        className={`rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg ${
          isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desktop Layout - Vertical (unchanged) */}
        <div className="hidden sm:block">
          {/* Product Image - 60-70% of card height */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <ImageWithFallback
              src={product.images?.[0]?.src || '/placeholder-image.jpg'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHovered ? 'ring-1 ring-green-500/10' : ''
              }`}
              placeholder="product"
            />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-white hover:text-red-500'
                }`}
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Product Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.featured && (
                <div className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Featured
                </div>
              )}
              {product.on_sale && (
                <div className="bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Product Content - 30-40% of card height */}
          <div className="p-4 flex flex-col justify-between h-[40%]">
            <div className="space-y-2">
              {/* Product Title */}
              <h3 className={`font-medium text-sm sm:text-base line-clamp-2 group-hover:text-green-600 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h3>

              {/* Product USP/Tagline */}
              <p className={`text-xs line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {getProductUSP()}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-bold text-sm">
                  {formatPrice(product.price)}
                </span>
                {product.sale_price && product.regular_price && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status === 'outofstock'}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-sm"
            >
              {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Mobile Layout - Horizontal (Image Left, Details Right) */}
        <div className="flex sm:hidden">
          {/* Product Image - 35% width on mobile */}
          <div className="relative w-[35%] flex-shrink-0">
            <ImageWithFallback
              src={product.images?.[0]?.src || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              placeholder="product"
            />

            {/* Product Badges - Mobile */}
            <div className="absolute top-1 left-1 flex flex-col space-y-1">
              {product.featured && (
                <div className="bg-green-500/90 text-white px-1.5 py-0.5 rounded-full text-[9px] font-semibold backdrop-blur-sm">
                  Featured
                </div>
              )}
              {product.on_sale && (
                <div className="bg-red-500/90 text-white px-1.5 py-0.5 rounded-full text-[9px] font-semibold backdrop-blur-sm">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Product Details - 65% width on mobile */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            {/* Top Section */}
            <div className="space-y-1">
              {/* Product Title */}
              <h3 className={`font-medium text-xs line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h3>

              {/* Product USP/Tagline */}
              <p className={`text-[10px] line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {getProductUSP()}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-1.5">
                <span className="text-green-600 font-bold text-xs">
                  {formatPrice(product.price)}
                </span>
                {product.sale_price && product.regular_price && (
                  <span className="text-[10px] text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Section - Buttons */}
            <div className="flex items-center space-x-2 mt-2">
              {/* Add to Cart Button - Compact */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === 'outofstock'}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-[10px] font-medium py-1.5 px-2 rounded transition-all duration-300"
              >
                {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Wishlist Button - Compact */}
              <button
                onClick={handleWishlistToggle}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <svg
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`}
                  fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;