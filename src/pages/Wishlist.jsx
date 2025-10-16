import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import ImageWithFallback from '../components/ImageWithFallback';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { isDark } = useTheme();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your wishlist is empty
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Wishlist</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border group relative ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <Link to={`/product/${item.id}`} className="block">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="product"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className={`text-lg font-semibold line-clamp-2 transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-pink-400' 
                      : 'text-gray-900 group-hover:text-pink-600'
                  }`}>
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Remove from Wishlist Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className={`absolute top-2 right-2 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${
                  isDark ? 'bg-gray-700 hover:bg-red-500' : 'bg-white hover:bg-red-50'
                }`}
                title="Remove from wishlist"
              >
                <svg 
                  className="w-5 h-5 text-red-500 fill-current" 
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
          ))}
        </div>

        {/* Clear Wishlist Button */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={clearWishlist}
              className={`font-medium transition-colors ${
                isDark 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-600 hover:text-red-800'
              }`}
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
