import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  getUserDetails,
  validateToken,
  getStoredToken,
  getStoredUser,
  isBusinessPending as checkBusinessPending,
  canAccessWholesale as checkWholesaleAccess
} from '../api/auth';

/**
 * Authentication Context
 * 
 * Provides authentication state and functions throughout the app
 * Handles user login, registration, logout, and role management
 * 
 * @context AuthContext
 */

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Wraps the app and provides auth state to all children
 * 
 * @component
 */
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initialize authentication state from localStorage
   * Validates stored token on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          // Validate token
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            // Token is valid, restore session
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear data
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Listen for logout events from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    };

    const handleLogout = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await apiRegister(userData);

      // For business accounts, don't auto-login (they need approval)
      if (userData.role === 'business') {
        return {
          success: true,
          message: 'Business account created! Please wait for admin approval.',
          requiresApproval: true
        };
      }

      // For regular users, auto-login after registration
      const loginResult = await apiLogin({
        username: userData.username,
        password: userData.password
      });

      setToken(loginResult.token);
      setUser(loginResult.user);
      setIsAuthenticated(true);

      return {
        success: true,
        message: 'Account created and logged in successfully!',
        user: loginResult.user
      };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user with credentials
   * @param {Object} credentials - Login credentials (username, password)
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await apiLogin(credentials);

      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);

      return {
        success: true,
        message: 'Login successful!',
        user: result.user
      };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      apiLogout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from server
   * @returns {Promise<Object>} Updated user data
   */
  const refreshUser = async () => {
    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const userData = await getUserDetails(token);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  /**
   * Manually update user data in state and localStorage
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('✅ User data updated in AuthContext');
    }
  };

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user is a business account
   * @returns {boolean}
   */
  const isBusiness = () => {
    return user?.isBusiness === true;
  };

  /**
   * Check if business account is pending approval
   * @returns {boolean}
   */
  const isBusinessPending = () => {
    return user?.isBusiness && user?.isPending;
  };

  /**
   * Check if user can access wholesale features
   * @returns {boolean}
   */
  const canAccessWholesale = () => {
    return user?.isBusiness && user?.isActive;
  };

  /**
   * Get user's display name
   * @returns {string}
   */
  const getDisplayName = () => {
    if (!user) return 'Guest';
    return user.displayName || user.firstName || user.username || 'User';
  };

  /**
   * Check if user is guest (not logged in)
   * @returns {boolean}
   */
  const isGuest = () => {
    return !isAuthenticated;
  };

  // Context value
  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    
    // Utility functions
    hasRole,
    isBusiness,
    isBusinessPending,
    canAccessWholesale,
    getDisplayName,
    isGuest,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;

