import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';
import ScrollToTop from './components/ScrollToTop';
import AgeGate from './components/AgeGate';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import AboutPage from './pages/AboutPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';

// Checkout Pages
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersWithSuggestions from './pages/OrdersWithSuggestions';
import WholesalePage from './pages/WholesalePage';
import OrdersPage from './pages/OrdersPage';
import EditProfilePage from './pages/EditProfilePage';

// Additional Components
import ProductGalleryGrouped from './components/ProductGalleryGrouped';

// Inner App Component that uses theme and age verification
const AppContent = () => {
  const { isDark } = useTheme();
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check localStorage for age verification on mount
  useEffect(() => {
    const verified = localStorage.getItem('isAgeVerified');
    if (verified === 'true') {
      setIsAgeVerified(true);
    }
    setIsChecking(false);
  }, []);

  // Handle age verification
  const handleAgeVerify = () => {
    setIsAgeVerified(true);
  };

  // Don't render anything while checking
  if (isChecking) {
    return null;
  }

  // Show age gate if not verified
  if (!isAgeVerified) {
    return <AgeGate onVerify={handleAgeVerify} />;
  }
  
  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products-light" element={<ProductsPage />} />
            <Route path="/gallery" element={<ProductGalleryGrouped />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Cart (Guest & Authenticated) */}
            <Route path="/cart" element={<Cart />} />
            
            {/* Checkout (Guest & Authenticated) */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/order-continue" element={<OrdersWithSuggestions />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
            <Route path="/account/edit" element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            
            {/* Wholesale - Requires Active Business Account */}
            <Route path="/wholesale" element={<WholesalePage />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={
              <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h1 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog coming soon!</h1>
              </div>
            } />
            <Route path="/blog/:id" element={
              <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h1 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog post coming soon!</h1>
              </div>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                  <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>404</h1>
                  <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Page not found</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <FloatingChat />
      </div>
    </Router>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
