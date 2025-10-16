import axios from 'axios';

/**
 * Authentication API Module
 * 
 * Handles user registration, login, logout, and profile management
 * Uses JWT (JSON Web Token) for authentication
 * 
 * Required WordPress Plugins:
 * - JWT Authentication for WP REST API
 * - WooCommerce
 */

// API Configuration
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://www.zanobiaonline.com/wp-json';
const JWT_AUTH_URL = import.meta.env.VITE_JWT_AUTH_URL || `${WORDPRESS_URL}/jwt-auth/v1`;

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Create axios instance for auth requests
 */
const authAPI = axios.create({
  baseURL: WORDPRESS_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Add token to requests automatically if available
 */
authAPI.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle 401 unauthorized responses (token expired)
 */
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      clearAuthData();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ==================== TOKEN MANAGEMENT ====================

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 */
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 * @param {Object} user - User object
 */
export const storeUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get stored user data
 * @returns {Object|null} User object or null
 */
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getStoredToken();
};

// ==================== USER REGISTRATION ====================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.first_name - First name (optional)
 * @param {string} userData.last_name - Last name (optional)
 * @param {string} userData.role - User role: 'customer' or 'business' (default: 'customer')
 * @returns {Promise<Object>} Created user object
 * 
 * @example
 * registerUser({
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   role: 'customer'
 * })
 */
export const registerUser = async (userData) => {
  try {
    const { role, firstName, lastName, email, password, username, mobilePhone, businessName } = userData;
    
    // Prepare registration data for Zanobia custom endpoint
    const registrationData = {
      email: email,
      password: password,
      firstName: firstName || '',
      lastName: lastName || '',
      mobilePhone: mobilePhone || '',
      accountType: role || 'user', // 'user' or 'business'
      username: username || email.split('@')[0],
    };

    // Add business name if business account
    if (role === 'business' && businessName) {
      registrationData.businessName = businessName;
    }

    // Call custom Zanobia registration endpoint
    const response = await authAPI.post('/zanobia/v1/register', registrationData);
    
    if (response.data && response.data.success) {
      const isBusiness = response.data.user.role === 'pending_business';
      
      return {
        success: true,
        user: response.data.user,
        message: isBusiness 
          ? 'Business account created! Your account is pending verification. You will be notified once approved.' 
          : 'Account created successfully!'
      };
    }

    throw new Error('Registration failed');

  } catch (error) {
    // Log detailed error for debugging
    console.error('Registration error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific errors
    if (error.response?.data?.code === 'email_exists') {
      throw new Error('This email is already registered. Please login instead.');
    }
    if (error.response?.data?.code === 'missing_business_name') {
      throw new Error('Business name is required for business accounts.');
    }
    if (error.response?.data?.code === 'missing_field') {
      const field = error.response?.data?.message?.match(/Missing required field: (\w+)/)?.[1];
      throw new Error(`Missing required field: ${field || 'unknown'}. Please fill all fields.`);
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Registration failed. Please try again.';
    
    throw new Error(errorMessage);
  }
};

// ==================== USER LOGIN ====================

/**
 * Login user with credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Authentication response with token and user data
 * 
 * @example
 * loginUser({
 *   username: 'johndoe',
 *   password: 'SecurePass123!'
 * })
 */
export const loginUser = async (credentials) => {
  try {
    // Request JWT token
    const response = await axios.post(`${JWT_AUTH_URL}/token`, {
      username: credentials.username,
      password: credentials.password
    });

    const { token, user_email, user_nicename, user_display_name } = response.data;

    if (!token) {
      throw new Error('No token received from server');
    }

    // Store token
    storeToken(token);

    // Fetch full user details
    const userDetails = await getUserDetails(token);

    // Store user data
    storeUser(userDetails);

    return {
      success: true,
      token,
      user: userDetails,
      message: 'Login successful!'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        'Login failed';
    
    console.error('Login error:', error);
    throw new Error(errorMessage);
  }
};

// ==================== USER DETAILS ====================

/**
 * Get current user details using token
 * @param {string} token - JWT token (optional, will use stored token if not provided)
 * @returns {Promise<Object>} User details including role and status
 */
export const getUserDetails = async (token = null) => {
  try {
    const authToken = token || getStoredToken();
    
    if (!authToken) {
      throw new Error('No authentication token available');
    }

    // Validate token and get user info
    const response = await axios.post(
      `${JWT_AUTH_URL}/token/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    const { data } = response.data;

    // Fetch additional user details from WordPress
    const userResponse = await authAPI.get(`/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const userData = userResponse.data;

    // Fetch customer data from WooCommerce
    let customerData = null;
    try {
      const customersResponse = await axios.get(
        `${WORDPRESS_URL}/wc/v3/customers`,
        {
          params: { email: userData.email },
          auth: {
            username: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY,
            password: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET
          }
        }
      );
      customerData = customersResponse.data[0] || null;
    } catch (err) {
      console.warn('Could not fetch customer data:', err);
    }

    // Determine user role and status
    const accountType = userData.meta?.account_type || 'customer';
    const accountStatus = userData.meta?.account_status || 'active';
    const isBusiness = userData.meta?.is_business === 'yes';

    return {
      id: userData.id,
      username: userData.username || userData.slug,
      email: userData.email || (customerData?.email),
      firstName: userData.first_name || (customerData?.first_name) || '',
      lastName: userData.last_name || (customerData?.last_name) || '',
      displayName: userData.name || userData.display_name,
      role: accountType,
      accountStatus: accountStatus,
      isBusiness: isBusiness,
      isPending: accountStatus === 'pending',
      isActive: accountStatus === 'active',
      avatar: userData.avatar_urls?.['96'] || null,
      customerId: customerData?.id || null,
      roles: userData.roles || [],
      capabilities: userData.capabilities || {}
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch user details';
    
    console.error('Get user details error:', error);
    throw new Error(errorMessage);
  }
};

// ==================== TOKEN VALIDATION ====================

/**
 * Validate JWT token
 * @param {string} token - JWT token (optional, will use stored token if not provided)
 * @returns {Promise<boolean>} True if token is valid
 */
export const validateToken = async (token = null) => {
  try {
    const authToken = token || getStoredToken();
    
    if (!authToken) {
      return false;
    }

    await axios.post(
      `${JWT_AUTH_URL}/token/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// ==================== LOGOUT ====================

/**
 * Logout user (clear auth data)
 * @returns {Object} Logout response
 */
export const logoutUser = () => {
  clearAuthData();
  window.dispatchEvent(new Event('auth:logout'));
  
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

// ==================== PASSWORD MANAGEMENT ====================

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset response
 */
export const requestPasswordReset = async (email) => {
  try {
    // This requires a WordPress plugin like "WP REST Password Reset"
    const response = await authAPI.post('/custom/v1/password-reset', {
      email
    });

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Password reset request failed';
    
    console.error('Password reset error:', error);
    throw new Error(errorMessage);
  }
};

/**
 * Update user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Update response
 */
export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await authAPI.post('/custom/v1/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Password update failed';
    
    console.error('Password update error:', error);
    throw new Error(errorMessage);
  }
};

// ==================== PROFILE MANAGEMENT ====================

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (updates) => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await authAPI.post(
      '/wp/v2/users/me',
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const updatedUser = await getUserDetails(token);
    storeUser(updatedUser);

    return {
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Profile update failed';
    
    console.error('Profile update error:', error);
    throw new Error(errorMessage);
  }
};

// ==================== ROLE CHECKING ====================

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (role) => {
  const user = getStoredUser();
  return user?.role === role;
};

/**
 * Check if user is a business account
 * @returns {boolean}
 */
export const isBusinessAccount = () => {
  const user = getStoredUser();
  return user?.isBusiness === true;
};

/**
 * Check if business account is pending verification
 * @returns {boolean}
 */
export const isBusinessPending = () => {
  const user = getStoredUser();
  return user?.isBusiness && user?.isPending;
};

/**
 * Check if user can access wholesale features
 * @returns {boolean}
 */
export const canAccessWholesale = () => {
  const user = getStoredUser();
  return user?.isBusiness && user?.isActive;
};

// Export all functions
export default {
  // Token management
  storeToken,
  getStoredToken,
  storeUser,
  getStoredUser,
  clearAuthData,
  isAuthenticated,
  
  // Authentication
  registerUser,
  loginUser,
  logoutUser,
  
  // User management
  getUserDetails,
  validateToken,
  updateUserProfile,
  
  // Password management
  requestPasswordReset,
  updatePassword,
  
  // Role checking
  hasRole,
  isBusinessAccount,
  isBusinessPending,
  canAccessWholesale
};

