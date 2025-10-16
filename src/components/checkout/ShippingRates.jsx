/**
 * Shipping Rates Component
 * 
 * Displays available ClickShip shipping options with elegant UI
 * Supports carrier selection with smooth animations
 * 
 * @component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { formatShippingCost } from '../../api/shipping';

/**
 * Shipping Rates Display
 * 
 * @param {Object} props
 * @param {Array} props.rates - Available shipping rates
 * @param {string} props.selectedRateId - Currently selected rate ID
 * @param {Function} props.onSelectRate - Callback when rate is selected
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 */
export default function ShippingRates({ 
  rates = [], 
  selectedRateId, 
  onSelectRate,
  loading = false,
  error = null 
}) {

  /**
   * Shipping Rate Card Skeleton Loader
   */
  const SkeletonLoader = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Fetching shipping rates...</span>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">Unable to fetch shipping rates</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="p-6 text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Enter your postal code to see available shipping options
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {rates.map((rate, index) => {
          const isSelected = selectedRateId === rate.id;
          
          return (
            <motion.button
              key={rate.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectRate(rate)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Carrier & Service Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Radio Indicator */}
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>

                    {/* Carrier & Service Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold truncate ${
                        isSelected
                          ? 'text-indigo-900 dark:text-indigo-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {rate.carrier} - {rate.service}
                      </h4>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <p className={`text-xs truncate ${
                    isSelected
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {rate.delivery_days ? `Delivery in ${rate.delivery_days} business days` : rate.description}
                  </p>
                </div>

                {/* Right: Price */}
                <div className="flex-shrink-0 text-right">
                  <p className={`text-lg font-bold ${
                    isSelected
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatShippingCost(rate.cost, rate.currency)}
                  </p>
                  {rate.delivery_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      by {rate.delivery_date}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800"
                >
                  <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Selected shipping method</span>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {selectedRateId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Shipping method updated</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

