/**
 * Stripe Payment Form Component
 * 
 * Premium, elegant payment form using Stripe Elements
 * Supports Credit/Debit cards, Apple Pay, and Google Pay
 * 
 * @component
 */

import { useState, useEffect } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements,
  PaymentRequestButtonElement
} from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Stripe Payment Form
 * 
 * @param {Object} props
 * @param {number} props.amount - Total amount to charge
 * @param {Function} props.onSuccess - Callback when payment succeeds
 * @param {Function} props.onError - Callback when payment fails
 * @param {boolean} props.disabled - Disable form interaction
 */
export default function StripePaymentForm({ 
  amount, 
  onSuccess, 
  onError,
  disabled = false 
}) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentRequest, setPaymentRequest] = useState(null);

  // Initialize Payment Request (Apple Pay / Google Pay)
  useEffect(() => {
    if (!stripe || !amount) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: Math.round(amount * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Payment Request is available
    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    // Handle payment method event
    pr.on('paymentmethod', async (e) => {
      setIsProcessing(true);
      setErrorMessage('');

      try {
        // Confirm payment
        const { error: confirmError } = await stripe.confirmCardPayment(
          clientSecret, // This should come from your payment intent
          { payment_method: e.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          e.complete('fail');
          setErrorMessage(confirmError.message);
          onError?.(confirmError);
        } else {
          e.complete('success');
          onSuccess?.({ paymentMethod: e.paymentMethod });
        }
      } catch (error) {
        e.complete('fail');
        setErrorMessage('Payment failed. Please try again.');
        onError?.(error);
      } finally {
        setIsProcessing(false);
      }
    });

  }, [stripe, amount]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || disabled) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm payment using Stripe Elements
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        onError?.(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.({ paymentIntent });
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Apple Pay / Google Pay Button */}
      {paymentRequest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <PaymentRequestButtonElement 
            options={{ paymentRequest }}
            className="rounded-lg overflow-hidden"
          />
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            or pay with card below
          </p>
        </motion.div>
      )}

      {/* Payment Element Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Element */}
        <div className="relative">
          <PaymentElement 
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  // Pre-fill if available
                }
              }
            }}
            className="stripe-payment-element"
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stripe Branding */}
        <div className="flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secured by</span>
          <svg className="h-3" viewBox="0 0 60 25" fill="currentColor">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 013.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 01-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 01-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 00-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" />
          </svg>
        </div>
        
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Click "Pay Now" in the order summary to complete your payment
        </p>
      </form>
    </div>
  );
}

