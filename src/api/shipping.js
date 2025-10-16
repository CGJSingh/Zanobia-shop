/**
 * ClickShip Shipping API
 * 
 * Fetches real-time shipping rates from ClickShip via WooCommerce
 * Handles rate calculation, carrier selection, and order integration
 * 
 * @module api/shipping
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api';

/**
 * Calculate total cart weight
 * 
 * @param {Array} items - Cart items with weight property
 * @returns {number} Total weight in kg
 */
export const calculateCartWeight = (items) => {
  if (!items || items.length === 0) return 0.5; // Minimum weight
  
  const totalWeight = items.reduce((acc, item) => {
    const itemWeight = item.weight || 0.5; // Default 0.5kg if no weight
    return acc + (itemWeight * item.quantity);
  }, 0);
  
  return Math.max(totalWeight, 0.5); // Minimum 0.5kg
};

/**
 * Get ClickShip Shipping Rates
 * 
 * Fetches available shipping rates based on destination and cart weight
 * 
 * @param {Object} address - Shipping address details
 * @param {string} address.country - Country code (e.g., 'CA', 'US')
 * @param {string} address.province - Province/State code
 * @param {string} address.postal_code - Postal/ZIP code
 * @param {string} address.city - City name
 * @param {number} weight - Total cart weight in kg
 * @returns {Promise<Array>} Array of shipping rate objects
 */
export const getShippingRates = async (address, weight) => {
  try {
    const { country, province, postal_code, city } = address;

    // Validate required fields
    if (!country || !postal_code) {
      throw new Error('Country and postal code are required');
    }

    // Call WooCommerce ClickShip endpoint
    // Note: Using base domain + custom endpoint path (not WORDPRESS.BASE_URL which has /wp/v2)
    const baseUrl = API_CONFIG.WORDPRESS.BASE_URL.replace('/wp-json/wp/v2', '');
    const response = await axios.get(
      `${baseUrl}/wp-json/clickship/v1/rates`,
      {
        params: {
          country,
          province: province || '',
          postal: postal_code,
          city: city || '',
          weight: weight || 0.5,
        },
        auth: {
          username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
          password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
        },
      }
    );

    // Parse and format response
    if (response.data && response.data.rates) {
      return response.data.rates.map(rate => ({
        id: rate.id || rate.service_code,
        carrier: rate.carrier || 'ClickShip',
        service: rate.service_name || rate.name,
        delivery_days: rate.delivery_days || rate.est_delivery_days,
        delivery_date: rate.delivery_date,
        cost: parseFloat(rate.total || rate.cost || 0),
        currency: rate.currency || 'CAD',
        logo: rate.carrier_logo || null,
        description: rate.description || '',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    console.warn('⚠️ ClickShip endpoint not available, using static shipping rates');
    
    // ALWAYS return static rates if ClickShip endpoint fails
    // This ensures shipping works in both development AND production
    // TODO: Remove this fallback once ClickShip WordPress plugin is installed and configured
    return getMockShippingRates(address, weight);
  }
};

/**
 * Get Mock Shipping Rates (for development/testing)
 * 
 * @param {Object} address - Shipping address
 * @param {number} weight - Cart weight
 * @returns {Array} Mock shipping rates
 */
const getMockShippingRates = (address, weight) => {
  console.log('🚀 Using mock shipping rates for development');
  
  const baseRate = weight * 5; // $5 per kg base rate
  
  return [
    {
      id: 'canada_post_regular',
      carrier: 'Canada Post',
      service: 'Regular Parcel',
      delivery_days: '5-7',
      delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cost: baseRate + 12.99,
      currency: 'CAD',
      logo: null,
      description: 'Standard delivery within 5-7 business days',
    },
    {
      id: 'canada_post_expedited',
      carrier: 'Canada Post',
      service: 'Expedited Parcel',
      delivery_days: '2-3',
      delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cost: baseRate + 24.99,
      currency: 'CAD',
      logo: null,
      description: 'Faster delivery within 2-3 business days',
    },
    {
      id: 'canada_post_priority',
      carrier: 'Canada Post',
      service: 'Priority',
      delivery_days: '1-2',
      delivery_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cost: baseRate + 34.99,
      currency: 'CAD',
      logo: null,
      description: 'Express delivery within 1-2 business days',
    },
    {
      id: 'ups_ground',
      carrier: 'UPS',
      service: 'Ground',
      delivery_days: '3-5',
      delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cost: baseRate + 18.99,
      currency: 'CAD',
      logo: null,
      description: 'UPS ground shipping',
    },
    {
      id: 'fedex_ground',
      carrier: 'FedEx',
      service: 'Ground',
      delivery_days: '3-5',
      delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cost: baseRate + 19.99,
      currency: 'CAD',
      logo: null,
      description: 'FedEx ground shipping',
    },
  ];
};

/**
 * Validate Canadian Postal Code
 * 
 * @param {string} postalCode - Postal code to validate
 * @returns {boolean} True if valid
 */
export const validateCanadianPostalCode = (postalCode) => {
  const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return regex.test(postalCode);
};

/**
 * Validate US ZIP Code
 * 
 * @param {string} zipCode - ZIP code to validate
 * @returns {boolean} True if valid
 */
export const validateUSZipCode = (zipCode) => {
  const regex = /^\d{5}(-\d{4})?$/;
  return regex.test(zipCode);
};

/**
 * Format Postal Code
 * 
 * @param {string} postalCode - Raw postal code
 * @param {string} country - Country code
 * @returns {string} Formatted postal code
 */
export const formatPostalCode = (postalCode, country = 'CA') => {
  if (!postalCode) return '';
  
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  
  if (country === 'CA' && cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  return cleaned;
};

/**
 * Get Carrier Logo URL
 * 
 * @param {string} carrier - Carrier name
 * @returns {string|null} Logo URL or null
 */
export const getCarrierLogo = (carrier) => {
  const logos = {
    'Canada Post': '/logos/canada-post.svg',
    'UPS': '/logos/ups.svg',
    'FedEx': '/logos/fedex.svg',
    'Purolator': '/logos/purolator.svg',
  };
  
  return logos[carrier] || null;
};

/**
 * Format shipping rate for display
 * 
 * @param {number} cost - Cost in dollars
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
export const formatShippingCost = (cost, currency = 'CAD') => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(cost);
};

export default {
  getShippingRates,
  calculateCartWeight,
  validateCanadianPostalCode,
  validateUSZipCode,
  formatPostalCode,
  getCarrierLogo,
  formatShippingCost,
};

