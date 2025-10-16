import axios from "axios";
import { API_CONFIG } from '../config/api';

/**
 * WooCommerce REST API Integration
 * 
 * This module handles all interactions with the WooCommerce REST API
 * Documentation: https://woocommerce.github.io/woocommerce-rest-api-docs/
 */

// WooCommerce API configuration
const baseURL = API_CONFIG.WOOCOMMERCE.BASE_URL;
const auth = {
  username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
  password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET
};

// Create axios instance with authentication
const woocommerceAPI = axios.create({
  baseURL,
  auth,
  timeout: 20000, // Increased timeout to 20 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Error handler utility to provide consistent error messages
 * @param {Error} error - The error object from axios
 * @param {string} context - Description of what operation failed
 * @returns {Error} - Formatted error with user-friendly message
 */
const handleAPIError = (error, context) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
  const statusCode = error.response?.status;
  
  console.error(`${context}:`, {
    message: errorMessage,
    status: statusCode,
    data: error.response?.data
  });
  
  const formattedError = new Error(`${context}: ${errorMessage}`);
  formattedError.statusCode = statusCode;
  formattedError.originalError = error;
  
  return formattedError;
};

// ==================== PRODUCT OPERATIONS ====================

/**
 * Fetch all products with optional filtering parameters
 * @param {Object} params - Query parameters for filtering
 * @param {number} params.per_page - Number of products per page (default: 10)
 * @param {number} params.page - Page number (default: 1)
 * @param {string} params.search - Search query
 * @param {number} params.category - Category ID
 * @param {string} params.orderby - Sort by: date, id, title, popularity, rating (default: date)
 * @param {string} params.order - Sort order: asc, desc (default: desc)
 * @returns {Promise<Array>} Array of product objects
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await woocommerceAPI.get("/products", { params });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error fetching products");
  }
};

/**
 * Fetch a single product by its ID
 * @param {number|string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (id) => {
  try {
    if (!id) {
      throw new Error('Product ID is required');
    }
    const response = await woocommerceAPI.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error fetching product with ID ${id}`);
  }
};

/**
 * Fetch a single product by its slug
 * @param {string} slug - Product slug
 * @returns {Promise<Object>} Product object
 */
export const getProductBySlug = async (slug) => {
  try {
    if (!slug) {
      throw new Error('Product slug is required');
    }
    const response = await woocommerceAPI.get("/products", {
      params: { slug: slug }
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error('Product not found');
    }
    
    return response.data[0]; // Return first match
  } catch (error) {
    throw handleAPIError(error, `Error fetching product with slug ${slug}`);
  }
};

/**
 * Fetch product categories
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of category objects
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await woocommerceAPI.get("/products/categories", { params });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error fetching categories");
  }
};

/**
 * Fetch products by category ID
 * @param {number|string} categoryId - Category ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} Array of product objects
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await woocommerceAPI.get("/products", {
      params: { category: categoryId, ...params }
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error fetching products for category ${categoryId}`);
  }
};

/**
 * Search products by query string
 * @param {string} query - Search query
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} Array of matching product objects
 */
export const searchProducts = async (query, params = {}) => {
  try {
    if (!query) {
      throw new Error('Search query is required');
    }
    const response = await woocommerceAPI.get("/products", {
      params: { search: query, ...params }
    });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error searching products");
  }
};

/**
 * Fetch product variations (for variable products)
 * @param {number|string} productId - Parent product ID
 * @returns {Promise<Array>} Array of variation objects
 */
export const getProductVariations = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    const response = await woocommerceAPI.get(`/products/${productId}/variations`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error fetching variations for product ${productId}`);
  }
};

// ==================== ORDER OPERATIONS ====================

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @param {Array} orderData.line_items - Array of items with product_id and quantity
 * @param {Object} orderData.billing - Billing address and contact info
 * @param {Object} orderData.shipping - Shipping address
 * @param {string} orderData.payment_method - Payment method ID
 * @param {string} orderData.payment_method_title - Payment method title
 * @returns {Promise<Object>} Created order object
 * 
 * @example
 * createOrder({
 *   payment_method: 'bacs',
 *   payment_method_title: 'Direct Bank Transfer',
 *   billing: {
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     address_1: '123 Main St',
 *     city: 'City',
 *     state: 'State',
 *     postcode: '12345',
 *     country: 'US',
 *     email: 'john@example.com',
 *     phone: '555-1234'
 *   },
 *   shipping: {
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     address_1: '123 Main St',
 *     city: 'City',
 *     state: 'State',
 *     postcode: '12345',
 *     country: 'US'
 *   },
 *   line_items: [
 *     { product_id: 123, quantity: 2 },
 *     { product_id: 456, quantity: 1 }
 *   ]
 * })
 */
export const createOrder = async (orderData) => {
  try {
    if (!orderData || !orderData.line_items || orderData.line_items.length === 0) {
      throw new Error('Order must contain at least one line item');
    }
    
    const response = await woocommerceAPI.post("/orders", orderData);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error creating order");
  }
};

/**
 * Fetch a single order by ID
 * @param {number|string} orderId - Order ID
 * @returns {Promise<Object>} Order object
 */
export const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    const response = await woocommerceAPI.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error fetching order with ID ${orderId}`);
  }
};

/**
 * Fetch all orders with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.customer - Customer ID
 * @param {string} params.status - Order status (pending, processing, completed, etc.)
 * @returns {Promise<Array>} Array of order objects
 */
export const getOrders = async (params = {}) => {
  try {
    const response = await woocommerceAPI.get("/orders", { params });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error fetching orders");
  }
};

/**
 * Update an existing order
 * @param {number|string} orderId - Order ID
 * @param {Object} updates - Order fields to update
 * @returns {Promise<Object>} Updated order object
 */
export const updateOrder = async (orderId, updates) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    const response = await woocommerceAPI.put(`/orders/${orderId}`, updates);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error updating order ${orderId}`);
  }
};

// ==================== CUSTOMER OPERATIONS ====================

/**
 * Create a new customer account
 * @param {Object} customerData - Customer details
 * @param {string} customerData.email - Customer email (required)
 * @param {string} customerData.first_name - First name
 * @param {string} customerData.last_name - Last name
 * @param {string} customerData.username - Username (optional, will use email if not provided)
 * @param {string} customerData.password - Password (optional for guest checkout)
 * @param {Object} customerData.billing - Billing address
 * @param {Object} customerData.shipping - Shipping address
 * @returns {Promise<Object>} Created customer object
 */
export const registerCustomer = async (customerData) => {
  try {
    if (!customerData || !customerData.email) {
      throw new Error('Email is required for customer registration');
    }
    
    const response = await woocommerceAPI.post("/customers", customerData);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error registering customer");
  }
};

/**
 * Fetch customer by ID
 * @param {number|string} customerId - Customer ID
 * @returns {Promise<Object>} Customer object
 */
export const getCustomerById = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    const response = await woocommerceAPI.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error fetching customer with ID ${customerId}`);
  }
};

/**
 * Update customer information
 * @param {number|string} customerId - Customer ID
 * @param {Object} updates - Customer fields to update
 * @returns {Promise<Object>} Updated customer object
 */
export const updateCustomer = async (customerId, updates) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    const response = await woocommerceAPI.put(`/customers/${customerId}`, updates);
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Error updating customer ${customerId}`);
  }
};

/**
 * Fetch all customers (requires admin privileges)
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of customer objects
 */
export const getCustomers = async (params = {}) => {
  try {
    const response = await woocommerceAPI.get("/customers", { params });
    return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error fetching customers");
  }
};

/**
 * Fetch orders for a specific customer
 * @param {number|string} customerId - Customer ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} Array of order objects
 */
export const getCustomerOrders = async (customerId, params = {}) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    return await getOrders({ customer: customerId, ...params });
  } catch (error) {
    throw handleAPIError(error, `Error fetching orders for customer ${customerId}`);
  }
};

// ==================== AUTHENTICATION ====================

/**
 * Note: WooCommerce REST API uses Basic Auth with consumer keys.
 * For user login/authentication, you typically need to use WordPress REST API
 * with JWT or other authentication plugins.
 * 
 * For a complete authentication solution, consider:
 * 1. WooCommerce REST API Authentication plugin
 * 2. JWT Authentication for WP REST API plugin
 * 3. Custom authentication endpoint
 */

/**
 * Validate customer credentials (requires additional WordPress plugin)
 * This is a placeholder - implement based on your authentication method
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} Authentication response with token
 */
export const loginCustomer = async (username, password) => {
  try {
    // This is a placeholder implementation
    // You'll need to implement this based on your authentication plugin
    // Common options: JWT, OAuth, WooCommerce session cookies
    
    console.warn('loginCustomer: Not implemented. Please configure authentication plugin.');
    throw new Error('Authentication not configured. Please install and configure a WordPress authentication plugin.');
    
    // Example implementation with JWT plugin:
    // const response = await axios.post(`${API_CONFIG.WORDPRESS.BASE_URL}/jwt-auth/v1/token`, {
    //   username,
    //   password
    // });
    // return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error logging in customer");
  }
};

/**
 * Validate authentication token
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Validation response
 */
export const validateToken = async (token) => {
  try {
    console.warn('validateToken: Not implemented. Please configure authentication plugin.');
    throw new Error('Authentication not configured.');
    
    // Example implementation with JWT plugin:
    // const response = await axios.post(
    //   `${API_CONFIG.WORDPRESS.BASE_URL}/jwt-auth/v1/token/validate`,
    //   {},
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    // return response.data;
  } catch (error) {
    throw handleAPIError(error, "Error validating token");
  }
};

// ==================== CART OPERATIONS ====================

/**
 * Note: WooCommerce doesn't have built-in REST API endpoints for cart operations.
 * Cart is typically managed client-side in React state.
 * For server-side cart, consider:
 * 1. WooCommerce Store API (for Blocks)
 * 2. CoCart plugin
 * 3. Custom implementation
 */

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if WooCommerce API is configured correctly
 * @returns {boolean} True if all required config is present
 */
export const isConfigured = () => {
  return !!(
    API_CONFIG.WOOCOMMERCE.BASE_URL &&
    API_CONFIG.WOOCOMMERCE.CONSUMER_KEY &&
    API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET
  );
};

/**
 * Test connection to WooCommerce API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testConnection = async () => {
  try {
    await woocommerceAPI.get("/");
    return true;
  } catch (error) {
    console.error("WooCommerce API connection test failed:", error.message);
    return false;
  }
};

// ==================== BACKWARD COMPATIBILITY ====================
// Keep old function names for backward compatibility

export const fetchProducts = getProducts;
export const fetchProduct = getProductById;
export const fetchCategories = getCategories;
export const fetchProductsByCategory = getProductsByCategory;
export const fetchProductVariations = getProductVariations;
