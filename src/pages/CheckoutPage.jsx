import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/woocommerce';
import { getShippingRates, calculateCartWeight, formatPostalCode } from '../api/shipping';
import { getUserProfile, getUserAddresses } from '../api/user';
import ShippingRates from '../components/checkout/ShippingRates';
import AddressAutocomplete from '../components/AddressAutocomplete';
import SEO from '../components/SEO';

/**
 * Premium Checkout Page with Clover Payment Integration
 * 
 * Elegant checkout with Clover payment processing via WooCommerce
 * Payment handled server-side by Clover plugin
 * 
 * @page
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Shipping state
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');

  // Payment method - Clover only
  const [paymentMethod, setPaymentMethod] = useState('clover');

  // Same address toggle
  const [sameAddress, setSameAddress] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    // Billing Address
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'CA',
    // Shipping Address
    shippingAddress: '',
    shippingApartment: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'CA',
    saveAddress: false,
    orderNotes: ''
  });

  // Calculate totals
  const shippingCost = selectedRate?.cost || 0;
  const taxRate = 0.08; // 8% tax
  const taxAmount = totalPrice * taxRate;
  const finalTotal = totalPrice + shippingCost + taxAmount;
  const cartWeight = calculateCartWeight(items);

  // Pre-fill user data when authenticated
  useEffect(() => {
    const prefillUserData = async () => {
      if (!isAuthenticated || !user?.id) return;

      setIsLoadingProfile(true);
      try {
        const [profileData, addresses] = await Promise.all([
          getUserProfile(),
          getUserAddresses()
        ]);

        // Pre-fill form with saved data
        setFormData(prev => ({
          ...prev,
          email: profileData.email || user.email || prev.email,
          phone: addresses.billing?.phone || profileData.mobilePhone || '',
          firstName: profileData.firstName || user.firstName || prev.firstName,
          lastName: profileData.lastName || user.lastName || prev.lastName,
          // Billing Address
          billingAddress: addresses.billing?.address1 || '',
          billingApartment: addresses.billing?.address2 || '',
          billingCity: addresses.billing?.city || '',
          billingState: addresses.billing?.state || '',
          billingZipCode: addresses.billing?.postcode || '',
          billingCountry: addresses.billing?.country || 'CA',
          // Shipping Address
          shippingAddress: addresses.shipping?.address1 || addresses.billing?.address1 || '',
          shippingApartment: addresses.shipping?.address2 || addresses.billing?.address2 || '',
          shippingCity: addresses.shipping?.city || addresses.billing?.city || '',
          shippingState: addresses.shipping?.state || addresses.billing?.state || '',
          shippingZipCode: addresses.shipping?.postcode || addresses.billing?.postcode || '',
          shippingCountry: addresses.shipping?.country || addresses.billing?.country || 'CA',
        }));

        // Check if shipping is same as billing
        if (addresses.billing && addresses.shipping) {
          const isSame = 
            addresses.billing.address1 === addresses.shipping.address1 &&
            addresses.billing.city === addresses.shipping.city &&
            addresses.billing.state === addresses.shipping.state &&
            addresses.billing.postcode === addresses.shipping.postcode;
          setSameAddress(isSame);
        }

      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Continue with checkout even if prefill fails
      } finally {
        setIsLoadingProfile(false);
      }
    };

    prefillUserData();
  }, [isAuthenticated, user?.id, user?.email, user?.firstName, user?.lastName]);

  // Fetch shipping rates when address changes
  const fetchShippingRates = useCallback(async () => {
    const { shippingZipCode, shippingState, shippingCity, shippingCountry } = formData;

    // Require postal code at minimum
    if (!shippingZipCode || shippingZipCode.length < 3) {
      setShippingRates([]);
      return;
    }

    setLoadingRates(true);
    setRatesError('');

    try {
      const address = {
        country: shippingCountry,
        province: shippingState,
        postal_code: formatPostalCode(shippingZipCode, shippingCountry),
        city: shippingCity,
      };

      const rates = await getShippingRates(address, cartWeight);
      setShippingRates(rates);

      // Auto-select cheapest rate if none selected (only on first fetch)
      if (rates.length > 0) {
        setSelectedRate(prevSelected => {
          // If no rate was previously selected, select the cheapest
          if (!prevSelected) {
            const cheapest = rates.reduce((min, rate) => 
              rate.cost < min.cost ? rate : min
            );
            return cheapest;
          }
          // Keep previous selection if it still exists in new rates
          const stillAvailable = rates.find(r => r.id === prevSelected.id);
          return stillAvailable || rates[0];
        });
      }
    } catch (err) {
      setRatesError(err.message || 'Failed to fetch shipping rates');
      setShippingRates([]);
    } finally {
      setLoadingRates(false);
    }
  }, [formData.shippingZipCode, formData.shippingState, formData.shippingCity, formData.shippingCountry, cartWeight]);

  // Handle shipping rate selection without re-fetching
  const handleRateSelection = (rate) => {
    setSelectedRate(rate);
  };

  // Fetch rates when postal code changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.shippingZipCode && formData.shippingZipCode.length >= 3) {
        fetchShippingRates();
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [formData.shippingZipCode, formData.shippingState, fetchShippingRates]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // No payment intent needed - Clover handles payment server-side

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // If same address is checked and billing changes, update shipping
    if (sameAddress && name.startsWith('billing')) {
      const shippingField = name.replace('billing', 'shipping');
      setFormData(prev => ({
        ...prev,
        [shippingField]: value
      }));
    }
  };

  // Handle same address toggle
  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      // Copy billing to shipping
      setFormData(prev => ({
        ...prev,
        shippingAddress: prev.billingAddress,
        shippingApartment: prev.billingApartment,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingZipCode: prev.billingZipCode,
        shippingCountry: prev.billingCountry,
      }));
    }
  };

  // Handle billing address autocomplete
  const handleBillingAddressSelect = (address) => {
    if (!address) return;

    const updates = {
      billingAddress: `${address.houseNumber || ''} ${address.street || ''}`.trim(),
      billingCity: address.city || '',
      billingState: address.state || '',
      billingZipCode: address.postalCode || '',
      billingCountry: address.country || 'CA',
    };

    setFormData(prev => ({
      ...prev,
      ...updates,
      ...(sameAddress ? {
        shippingAddress: updates.billingAddress,
        shippingCity: updates.billingCity,
        shippingState: updates.billingState,
        shippingZipCode: updates.billingZipCode,
        shippingCountry: updates.billingCountry,
      } : {})
    }));
  };

  // Handle shipping address autocomplete
  const handleShippingAddressSelect = (address) => {
    if (!address) return;

    setFormData(prev => ({
      ...prev,
      shippingAddress: `${address.houseNumber || ''} ${address.street || ''}`.trim(),
      shippingCity: address.city || '',
      shippingState: address.state || '',
      shippingZipCode: address.postalCode || '',
      shippingCountry: address.country || 'CA',
    }));
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.billingAddress || !formData.billingCity || !formData.billingZipCode) {
        throw new Error('Please fill in all required billing fields');
      }

      if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingZipCode) {
        throw new Error('Please fill in all required shipping fields');
      }

      if (!selectedRate) {
        throw new Error('Please select a shipping method');
      }

      // Prepare order data for WooCommerce + Clover
      const orderData = {
        payment_method: 'clover',
        payment_method_title: 'Clover Payment',
        set_paid: false, // Clover will handle payment status
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.billingAddress,
          address_2: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          postcode: formData.billingZipCode,
          country: formData.billingCountry,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.shippingAddress,
          address_2: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          postcode: formData.shippingZipCode,
          country: formData.shippingCountry
        },
        line_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        customer_note: formData.orderNotes,
        shipping_lines: [{
          method_id: 'clickship',
          method_title: `ClickShip - ${selectedRate.carrier} ${selectedRate.service}`,
          total: selectedRate.cost.toString(),
          meta_data: [
            { key: 'carrier', value: selectedRate.carrier },
            { key: 'service', value: selectedRate.service },
            { key: 'delivery_days', value: selectedRate.delivery_days || '' },
            { key: 'clickship_rate_id', value: selectedRate.id }
          ]
        }]
      };

      if (isAuthenticated && user?.customerId) {
        orderData.customer_id = user.customerId;
      }

      // Create order in WooCommerce (Clover handles payment server-side)
      const order = await createOrder(orderData);
      
      if (!order || !order.id) {
        throw new Error('Failed to create order');
      }

      // Clear cart and navigate to success page
      clearCart();
      navigate(`/order-success/${order.id}`, {
        state: {
          orderNumber: order.number,
          orderTotal: finalTotal,
          shippingMethod: `${selectedRate.carrier} - ${selectedRate.service}`,
          items: items
        }
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.message || 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed. Please try again.');
    setIsProcessing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Progress steps
  const steps = [
    { number: 1, name: 'Cart', icon: '🛒' },
    { number: 2, name: 'Shipping', icon: '📦' },
    { number: 3, name: 'Payment', icon: '💳' },
    { number: 4, name: 'Review', icon: '✓' }
  ];

  const currentStep = 1; // For now, single page checkout

  return (
    <>
      <SEO 
        title="Secure Checkout - Clover Payments | Zanobia"
        description="Complete your purchase securely with Clover"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header with Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Complete your purchase in a few simple steps
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: currentStep >= step.number ? 1 : 0.9 }}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                          currentStep >= step.number
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        <span className="text-lg">{step.icon}</span>
                      </motion.div>
                      <span className={`ml-2 text-sm font-medium transition-colors duration-300 hidden sm:inline ${
                        currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-gray-200 dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Clover Test Mode Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">Clover Payment Ready</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Payment processing via Clover • Secure & PCI Compliant
                </p>
              </div>
            </div>
          </motion.div>

          {/* Guest Login Tip */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50"
            >
              <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Have an account?{' '}
                  <a href="/login?redirect=/checkout" className="font-semibold underline hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors">
                    Login
                  </a>{' '}
                  to track your orders
                </span>
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50"
              >
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📧</span> Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">💳</span> Billing Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <AddressAutocomplete
                      value={formData.billingAddress}
                      onChange={(val) => handleChange({ target: { name: 'billingAddress', value: val } })}
                      onAddressSelect={handleBillingAddressSelect}
                      country={formData.billingCountry}
                      placeholder="Start typing your billing address..."
                      label="Street Address"
                      required={true}
                      showUseLocation={true}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="billingApartment"
                      value={formData.billingApartment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="billingZipCode"
                      value={formData.billingZipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    >
                      <option value="CA">🍁 Canada</option>
                      <option value="US">🇺🇸 United States</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🏠</span> Shipping Address
                  </h2>
                  
                  {/* Same as Billing Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={handleSameAddressToggle}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300" />
                      <div className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md 
                                    peer-checked:translate-x-7 transition-transform duration-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Same as billing
                    </span>
                  </label>
                </div>

                <AnimatePresence>
                  {!sameAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="md:col-span-2">
                        <AddressAutocomplete
                          value={formData.shippingAddress}
                          onChange={(val) => handleChange({ target: { name: 'shippingAddress', value: val } })}
                          onAddressSelect={handleShippingAddressSelect}
                          country={formData.shippingCountry}
                          placeholder="Start typing your shipping address..."
                          label="Street Address"
                          required={true}
                          showUseLocation={true}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="shippingApartment"
                          value={formData.shippingApartment}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleChange}
                            required={!sameAddress}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            name="shippingState"
                            value={formData.shippingState}
                            onChange={handleChange}
                            required={!sameAddress}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            name="shippingZipCode"
                            value={formData.shippingZipCode}
                            onChange={handleChange}
                            required={!sameAddress}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Country
                          </label>
                          <select
                            name="shippingCountry"
                            value={formData.shippingCountry}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          >
                            <option value="CA">🍁 Canada</option>
                            <option value="US">🇺🇸 United States</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {sameAddress && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50"
                  >
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Shipping to same address as billing
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* ClickShip Shipping Rates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🚚</span> Shipping Options
                  </h2>
                  {loadingRates && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Loading rates...</span>
                    </div>
                  )}
                </div>

                <ShippingRates 
                  rates={shippingRates}
                  selectedRateId={selectedRate?.id}
                  onSelectRate={handleRateSelection}
                  loading={loadingRates}
                  error={ratesError}
                />

                {/* Weight Info */}
                {cartWeight > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Package weight:</span> {cartWeight.toFixed(2)} kg
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Payment Method - Clover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">💳</span> Payment Method
                </h2>

                {/* Clover Payment Info */}
                <div className="p-6 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                        Clover Secure Payment
                      </h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                        Your payment will be securely processed by Clover. No card details are stored on our servers.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          💳 Credit Card
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          💳 Debit Card
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          🔒 PCI Compliant
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        How Payment Works:
                      </h4>
                      <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>Click "Pay Now" in the order summary</li>
                        <li>Your order will be created in our system</li>
                        <li>Clover will process your payment securely</li>
                        <li>You'll receive an order confirmation</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📝</span> Order Notes (Optional)
                </h2>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special instructions for your order..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                />
              </motion.div>
            </div>

            {/* Order Summary Sidebar - Sticky */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-28 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 pt-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative flex-shrink-0 w-16">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 bg-indigo-500 dark:bg-indigo-600 text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900 transition-colors duration-300">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Details */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <motion.span 
                      key={shippingCost}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {selectedRate ? (
                        <span className="flex flex-col items-end">
                          <span>{formatPrice(shippingCost)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedRate.carrier} - {selectedRate.service}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Enter postal code</span>
                      )}
                    </motion.span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <motion.span 
                      key={finalTotal}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="text-xl font-semibold text-indigo-600 dark:text-indigo-400"
                    >
                      {formatPrice(finalTotal)}
                    </motion.span>
                  </div>
                </div>

                {/* Pay Now Button */}
                <motion.button
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  onClick={handlePaymentSuccess}
                  disabled={isProcessing || !selectedRate}
                  className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-300 ${
                    isProcessing || !selectedRate
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:shadow-green-500/30'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing Order...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Pay with Clover • {formatPrice(finalTotal)}
                    </span>
                  )}
                </motion.button>

                {/* Shipping Required Notice */}
                {!selectedRate && (
                  <p className="mt-2 text-xs text-center text-amber-600 dark:text-amber-400">
                    Please select a shipping method above
                  </p>
                )}

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secured by Clover</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
