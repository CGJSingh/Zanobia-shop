import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO';

/**
 * Order Success Page
 * 
 * Displays order confirmation after successful checkout
 * 
 * @page
 */
export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { isDark } = useTheme();

  useEffect(() => {
    // Optional: Track order completion
    console.log('Order completed:', orderId);
  }, [orderId]);

  return (
    <>
      <SEO 
        title="Order Confirmed - Zanobia"
        description="Your order has been successfully placed"
      />
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 ease-in-out">
        <div className="max-w-md w-full text-center animate-fadeIn">
          {/* Success Icon */}
          <div className="mb-8 animate-bounceIn">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-lg transition-all duration-300">
              <svg 
                className="w-12 h-12 text-green-600 dark:text-green-400 transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
            Order Confirmed!
          </h1>
          
          <p className="text-lg mb-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Thank you for your order
          </p>
          
          <p className="text-sm mb-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Order ID: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">#{orderId}</span>
          </p>

          {/* Order Details */}
          <div className="p-6 rounded-lg mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">
              What's Next?
            </h2>
            <ul className="text-sm space-y-2 text-left text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <li className="flex items-start transition-colors duration-300">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive an email confirmation shortly</span>
              </li>
              <li className="flex items-start transition-colors duration-300">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We'll process your order within 24-48 hours</span>
              </li>
              <li className="flex items-start transition-colors duration-300">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive tracking information once shipped</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/products"
              className="block w-full px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="block w-full px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

