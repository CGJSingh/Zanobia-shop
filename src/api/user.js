import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { getStoredToken } from './auth';

/**
 * User Profile API Module
 * 
 * Handles fetching and updating user profile data
 * Uses JWT authentication for secure operations
 * Integrates with WordPress/WooCommerce user meta
 */

const userAPI = axios.create({
  baseURL: 'https://www.zanobiaonline.com/wp-json',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to all requests
userAPI.interceptors.request.use(
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
 * Get user profile with all meta data
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await userAPI.get('/zanobia/v1/user-role');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await userAPI.post('/zanobia/v1/update-profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Upload user profile picture
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} Response with image URL
 */
export const uploadProfilePicture = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const token = getStoredToken();
    
    // Use correct WordPress media endpoint (without /wp/v2 since BASE_URL already has it)
    const baseUrl = 'https://www.zanobiaonline.com/wp-json';
    
    const response = await axios.post(
      `${baseUrl}/wp/v2/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'Content-Disposition': `attachment; filename="${imageFile.name}"`
        }
      }
    );

    // Also update user meta with avatar URL
    if (response.data?.source_url) {
      try {
        await userAPI.post('/zanobia/v1/update-profile', {
          avatar: response.data.source_url
        });
      } catch (metaError) {
        console.warn('Failed to update avatar meta:', metaError);
      }
    }

    return {
      url: response.data.source_url,
      id: response.data.id
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

/**
 * Get user's billing and shipping addresses
 * @returns {Promise<Object>} Address data
 */
export const getUserAddresses = async () => {
  try {
    const response = await userAPI.get('/zanobia/v1/user-addresses');
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
  }
};

/**
 * Update user's addresses
 * @param {Object} addressData - Billing and shipping addresses
 * @returns {Promise<Object>} Updated addresses
 */
export const updateUserAddresses = async (addressData) => {
  try {
    const response = await userAPI.post('/zanobia/v1/update-addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating addresses:', error);
    throw new Error(error.response?.data?.message || 'Failed to update addresses');
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getUserAddresses,
  updateUserAddresses
};

