/**
 * Stripe Configuration
 * 
 * Handles Stripe initialization and public key management
 * 
 * @module config/stripe
 */

import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Publishable Key
 * 
 * Test Key (starts with pk_test_):
 * - Safe to expose in frontend
 * - Only for test mode transactions
 * - Replace with live key (pk_live_) for production
 * 
 * @constant {string}
 */
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

/**
 * Check if Stripe key is valid
 * 
 * @returns {boolean} True if key exists and has correct format
 */
const isValidStripeKey = (key) => {
  return key && (key.startsWith('pk_test_') || key.startsWith('pk_live_'));
};

/**
 * Initialize Stripe instance
 * 
 * Loads Stripe.js asynchronously
 * Only loads if a valid key is provided
 * 
 * @returns {Promise<Stripe|null>} Stripe instance or null if key is invalid
 */
export const stripePromise = isValidStripeKey(STRIPE_PUBLIC_KEY) 
  ? loadStripe(STRIPE_PUBLIC_KEY)
  : Promise.resolve(null);

/**
 * Check if Stripe is in test mode
 * 
 * @returns {boolean} True if using test key
 */
export const isStripeTestMode = () => {
  return STRIPE_PUBLIC_KEY.startsWith('pk_test_');
};

/**
 * Stripe Configuration Object
 * 
 * @constant {Object}
 */
export const STRIPE_CONFIG = {
  publicKey: STRIPE_PUBLIC_KEY,
  isTestMode: isStripeTestMode(),
  
  // Appearance customization for Stripe Elements
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#6366f1', // Indigo-500
      colorBackground: '#ffffff',
      colorText: '#1f2937', // Gray-800
      colorDanger: '#ef4444', // Red-500
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
  
  // Payment Request Button (Apple Pay / Google Pay)
  paymentRequest: {
    country: 'US',
    currency: 'usd',
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
  },
};

export default {
  stripePromise,
  STRIPE_PUBLIC_KEY,
  STRIPE_CONFIG,
  isStripeTestMode,
};

