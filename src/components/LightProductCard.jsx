import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';

const LightProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.images?.[0]?.src || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="product"
          />

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                isInWishlist(product.id)
                  ? 'text-red-500 fill-current'
                  : 'text-gray-400 hover:text-red-500'
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
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.featured && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                Featured
              </span>
            )}
            {product.on_sale && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Product Category */}
          {product.categories && product.categories.length > 0 && (
            <p className="text-xs text-gray-500 mb-2">
              {product.categories[0].name}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.sale_price && product.regular_price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_status === 'outofstock'}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
          >
            {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default LightProductCard;

