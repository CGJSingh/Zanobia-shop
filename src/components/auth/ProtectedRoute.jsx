import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication and/or specific roles
 * Redirects to login if not authenticated
 * Shows access denied message if user doesn't have required role
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string} props.requireRole - Required role ('customer', 'business', etc.)
 * @param {boolean} props.requireBusinessActive - Require active business account (not pending)
 * @param {boolean} props.allowGuest - Allow guest access (default: false)
 */
export default function ProtectedRoute({ 
  children, 
  requireRole = null, 
  requireBusinessActive = false,
  allowGuest = false 
}) {
  const { isAuthenticated, user, isLoading, isBusinessPending, canAccessWholesale } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <svg 
            className={`animate-spin h-12 w-12 mx-auto mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Allow guest access if specified
  if (allowGuest && !isAuthenticated) {
    return children;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Check if specific role is required
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl text-center ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Access Denied Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-red-500 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Access Denied
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            This page requires a <strong className="capitalize">{requireRole}</strong> account.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if active business account is required
  if (requireBusinessActive && !canAccessWholesale()) {
    const isPending = isBusinessPending();

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl text-center ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Pending Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isPending ? 'Account Pending Verification' : 'Business Account Required'}
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {isPending 
              ? 'Your business account is currently under review. You\'ll receive an email once it\'s approved.'
              : 'This page requires an active business account to access wholesale features.'
            }
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Home
            </a>
            {!isPending && (
              <a
                href="/signup"
                className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Register as Business
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User is authorized, render children
  return children;
}

