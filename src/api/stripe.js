/**
 * Stripe Payment API
 * 
 * Handles Stripe payment intent creation and confirmation
 * Integrates with WooCommerce for order management
 * 
 * @module api/stripe
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api';

/**
 * Create Stripe Payment Intent
 * 
 * Creates a payment intent through WooCommerce's Stripe integration
 * 
 * @param {Object} paymentData - Payment configuration
 * @param {number} paymentData.amount - Amount in cents (e.g., 1000 = $10.00)
 * @param {string} paymentData.currency - Currency code (default: 'usd')
 * @param {Object} paymentData.metadata - Order metadata
 * @returns {Promise<Object>} Payment intent object with client_secret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = paymentData;

    // In a production app, this would call your WooCommerce backend
    // For now, we'll simulate the payment intent creation
    // Your WooCommerce backend should have a Stripe webhook endpoint
    
    const response = await axios.post(
      `${API_CONFIG.WORDPRESS.BASE_URL}/wp-json/wc/v3/payment-intents`,
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method_types: ['card'],
        metadata: {
          ...metadata,
          integration: 'woocommerce',
        },
      },
      {
        auth: {
          username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
          password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // For local testing without backend, return mock payment intent
    if (process.env.NODE_ENV === 'development') {
      return {
        client_secret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        id: `pi_test_${Date.now()}`,
        amount: Math.round(paymentData.amount * 100),
        currency: paymentData.currency || 'usd',
        status: 'requires_payment_method',
      };
    }
    
    throw error;
  }
};

/**
 * Confirm Payment and Create WooCommerce Order
 * 
 * After Stripe payment succeeds, creates the order in WooCommerce
 * 
 * @param {Object} orderData - Order details
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Created order object
 */
export const confirmPaymentAndCreateOrder = async (orderData, paymentIntentId) => {
  try {
    // Import createOrder from woocommerce.js
    const { createOrder } = await import('./woocommerce.js');
    
    // Prepare order data with Stripe payment info
    const wooOrderData = {
      ...orderData,
      payment_method: 'stripe',
      payment_method_title: 'Credit Card (Stripe)',
      set_paid: true, // Mark as paid since Stripe confirmed
      transaction_id: paymentIntentId,
      meta_data: [
        {
          key: '_stripe_payment_intent_id',
          value: paymentIntentId,
        },
        {
          key: '_payment_method',
          value: 'stripe',
        },
      ],
    };

    // Create the order in WooCommerce
    const order = await createOrder(wooOrderData);
    
    return order;
  } catch (error) {
    console.error('Error confirming payment and creating order:', error);
    throw new Error('Failed to create order after payment. Please contact support with payment ID: ' + paymentIntentId);
  }
};

/**
 * Get Stripe Payment Status
 * 
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Payment status
 */
export const getPaymentStatus = async (paymentIntentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.WORDPRESS.BASE_URL}/wp-json/wc/v3/payment-intents/${paymentIntentId}`,
      {
        auth: {
          username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
          password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};

/**
 * Calculate Stripe Processing Fee
 * 
 * Stripe charges 2.9% + $0.30 per transaction
 * 
 * @param {number} amount - Amount in dollars
 * @returns {number} Processing fee in dollars
 */
export const calculateStripeFee = (amount) => {
  return (amount * 0.029) + 0.30;
};

/**
 * Format amount for Stripe (convert to cents)
 * 
 * @param {number} amount - Amount in dollars
 * @returns {number} Amount in cents
 */
export const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Stripe (convert to dollars)
 * 
 * @param {number} amount - Amount in cents
 * @returns {number} Amount in dollars
 */
export const formatAmountFromStripe = (amount) => {
  return amount / 100;
};

export default {
  createPaymentIntent,
  confirmPaymentAndCreateOrder,
  getPaymentStatus,
  calculateStripeFee,
  formatAmountForStripe,
  formatAmountFromStripe,
};

