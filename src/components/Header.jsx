/**
 * Header Component
 * 
 * Main navigation bar that appears at the top of every page.
 * This header is ALWAYS DARK (bg-gray-900) regardless of theme or route.
 * 
 * Features:
 * - Fixed positioning with scroll-aware visibility (auto-hides on scroll down)
 * - Logo, navigation links, login/signup buttons
 * - Theme toggle button (affects other pages, not this header)
 * - Shopping cart and wishlist icons with item count badges
 * - Mobile responsive with hamburger menu
 * - Backdrop blur effect for modern look
 * - Green accent colors for CTAs
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for scroll-based styling
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Get cart and wishlist data from context
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  
  // Theme context (affects other pages, but header is always dark)
  const { isDark, toggleTheme } = useTheme();
  
  // Auth context
  const { isAuthenticated, user, logout } = useAuth();
  
  // Navigation hook
  const navigate = useNavigate();
  
  // Location hook to detect auth pages
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  /**
   * Scroll effect handler
   * Hides header when scrolling down (after 100px), shows it when scrolling up
   * Also adds a scrolled state for styling changes (after 50px)
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Add scrolled class for styling (backdrop blur, border)
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Navigate to cart page
   */
  const handleCartClick = () => {
    navigate('/cart');
  };

  /**
   * Navigate to wishlist page
   */
  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  /**
   * Handle search form submission
   * Navigates to products page with search query parameter
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-gray-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Center */}
          <Link to="/" className="flex items-center group">
            <img
              src="/images/logos/logo.png"
              alt="ZANOBIA Logo"
              className="h-12 w-auto mr-3 group-hover:rotate-12 transition-all duration-300 transform"
            />
            <span className="text-2xl font-bold tracking-wider text-white group-hover:text-green-400 transition-all duration-300">
              ZANOBIA
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">

            <Link 
              to="/" 
              className="transition-colors duration-200 relative group text-gray-300 hover:text-white"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link 
              to="/about" 
              className="transition-colors duration-200 relative group text-gray-300 hover:text-white"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link 
              to="/products" 
              className="transition-colors duration-200 relative group text-gray-300 hover:text-white"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link 
              to="/wholesale" 
              className="transition-colors duration-200 relative group text-gray-300 hover:text-white"
            >
              Wholesale
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
          </nav>

          {/* Right side - Login/Signup, Dark mode toggle and cart */}
          <div className="flex items-center space-x-4">
            {/* Login/Signup or User Account */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* User Account Dropdown */}
                  <Link 
                    to="/account"
                    className="flex items-center space-x-2 font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.firstName || user?.username}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="font-medium text-gray-300 hover:text-red-400 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={isAuthPage ? undefined : toggleTheme}
              disabled={isAuthPage}
              className={`p-2 rounded-lg transition-all duration-200 group relative ${
                isAuthPage
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label="Toggle theme"
              title={isAuthPage ? 'Theme toggle disabled on auth pages' : (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            >
              {isDark ? (
                <svg className={`w-5 h-5 text-yellow-400 ${!isAuthPage && 'group-hover:rotate-180'} transition-transform duration-500`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className={`w-5 h-5 text-gray-800 ${!isAuthPage && 'group-hover:rotate-[360deg]'} transition-transform duration-500`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              
              {/* Tooltip on hover */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                {isAuthPage ? 'Disabled on auth pages' : (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
              </span>
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                <circle cx="9" cy="21" r="1" strokeWidth={2} />
                <circle cx="18" cy="21" r="1" strokeWidth={2} />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 transition-colors duration-300">
            <div className="px-4 pt-4 pb-3 space-y-3">
              {/* Search Bar - Mobile */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/products"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/wholesale"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wholesale
                </Link>
              </div>

              {/* Theme Toggle - Mobile */}
              <div className="px-3 py-2 border-t border-gray-700">
                <button
                  onClick={isAuthPage ? undefined : toggleTheme}
                  disabled={isAuthPage}
                  className={`flex items-center space-x-3 w-full transition-colors duration-200 ${
                    isAuthPage 
                      ? 'text-gray-500 cursor-not-allowed opacity-50' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title={isAuthPage ? 'Theme toggle disabled on auth pages' : (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
                >
                  {isDark ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                      </svg>
                      <span className="text-sm">{isAuthPage ? 'Light Mode (Disabled)' : 'Light Mode'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span className="text-sm">{isAuthPage ? 'Dark Mode (Disabled)' : 'Dark Mode'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Auth Buttons - Mobile */}
              <div className="space-y-2 pt-2 border-t border-gray-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      className="w-full flex items-center justify-center space-x-2 font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                      </div>
                      <span>{user?.firstName || user?.username}</span>
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full text-center font-medium text-red-400 hover:text-red-300 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full block text-center font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full block text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;