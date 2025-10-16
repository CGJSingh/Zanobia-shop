import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle, Calendar, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../api/woocommerce';

/**
 * Orders Page Component
 * 
 * Premium order history page with elegant animations
 * Shows past orders with expandable details
 * Supports order tracking, status display, and item details
 * 
 * @page
 */
export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch real orders from WooCommerce
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch orders for logged-in user
        const wcOrders = await getCustomerOrders(user.id, {
          per_page: 20,
          orderby: 'date',
          order: 'desc'
        });

        // Map WooCommerce orders to our format
        const formattedOrders = wcOrders.map(order => ({
          id: `ZA-${order.id}`,
          orderNumber: order.number || order.id,
          date: order.date_created,
          total: `$${parseFloat(order.total).toFixed(2)}`,
          status: formatOrderStatus(order.status),
          payment: order.date_paid ? 'Paid' : 'Pending',
          paymentMethod: order.payment_method_title || 'N/A',
          shippingAddress: formatAddress(order.shipping),
          trackingNumber: order.meta_data?.find(m => m.key === '_tracking_number')?.value || null,
          estimatedDelivery: order.meta_data?.find(m => m.key === '_estimated_delivery')?.value || null,
          items: order.line_items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: `$${parseFloat(item.price).toFixed(2)}`,
            image: item.image?.src || '/images/products/placeholder.png'
          }))
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // Format WooCommerce order status to display status
  const formatOrderStatus = (wcStatus) => {
    const statusMap = {
      'completed': 'Delivered',
      'processing': 'Processing',
      'on-hold': 'On Hold',
      'pending': 'Processing',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'failed': 'Failed',
      'shipped': 'In Transit',
      'awaiting-shipment': 'Processing'
    };
    return statusMap[wcStatus] || 'Processing';
  };

  // Format shipping address
  const formatAddress = (shipping) => {
    if (!shipping) return 'No address provided';
    
    const parts = [
      shipping.address_1,
      shipping.address_2,
      shipping.city,
      shipping.state,
      shipping.postcode,
      shipping.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };


  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      'Delivered': { 
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle,
        glow: 'shadow-green-200'
      },
      'In Transit': { 
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: Truck,
        glow: 'shadow-blue-200'
      },
      'Processing': { 
        color: 'bg-amber-100 text-amber-700 border-amber-300',
        icon: Clock,
        glow: 'shadow-amber-200'
      },
      'Cancelled': { 
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: XCircle,
        glow: 'shadow-red-200'
      },
    };
    return badges[status] || badges['Processing'];
  };

  // Toggle order expansion
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <>
      <SEO 
        title="My Orders - Zanobia"
        description="View your order history, track shipments, and manage your Zanobia purchases"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* ===== HEADER SECTION ===== */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-12"
          >
            {/* Decorative Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl mb-6"
            >
              <Package className="w-10 h-10 text-white" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              My Orders
            </h1>

            {/* Underline Accent */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100px' }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6"
            />

            {/* Subtitle */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View your order history and manage returns or exchanges
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'Delivered').length}
                </div>
                <div className="text-sm text-gray-500">Delivered</div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'In Transit').length}
                </div>
                <div className="text-sm text-gray-500">In Transit</div>
              </div>
            </div>
          </motion.div>

          {/* ===== ORDERS LIST ===== */}
          {isLoading ? (
            /* Loading State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-48" />
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            /* Error State */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Orders</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:scale-105"
              >
                Try Again
              </button>
            </motion.div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            /* Orders Grid */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {orders.map((order, index) => {
                const statusBadge = getStatusBadge(order.status);
                const StatusIcon = statusBadge.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <motion.div
                    key={order.id}
                    variants={fadeInUp}
                    layout
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="w-full p-6 text-left hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Left: Order Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                          {/* Order Icon */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <Package className="w-6 h-6 text-white" />
                          </div>

                          {/* Order Details */}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              Order #{order.orderNumber}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </span>
                              <span>•</span>
                              <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>

                        {/* Center: Status Badge */}
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusBadge.color} ${statusBadge.glow} shadow-sm transition-all`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-semibold text-sm">{order.status}</span>
                          </div>
                        </div>

                        {/* Right: Total & Expand */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {order.total}
                            </div>
                            <div className="text-sm text-gray-500">{order.payment}</div>
                          </div>
                          
                          {/* Expand Icon */}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Order Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={expandVariants}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                            {/* Order Items */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors"
                                  >
                                    {/* Product Image */}
                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProduct%3C/text%3E%3C/svg%3E';
                                        }}
                                      />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-gray-900 truncate">
                                        {item.name}
                                      </h5>
                                      <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                      <div className="font-bold text-gray-900">{item.price}</div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              {/* Shipping Address */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Shipping Address
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                                  {order.shippingAddress}
                                </p>
                              </div>

                              {/* Payment Info */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  Payment Information
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Method:</span>
                                    <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-semibold ${
                                      order.payment === 'Paid' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {order.payment}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-bold text-gray-900 text-lg">{order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tracking Information */}
                            {order.trackingNumber && (
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  Tracking Information
                                </h4>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                                      <p className="font-mono font-bold text-gray-900">{order.trackingNumber}</p>
                                      {order.estimatedDelivery && (
                                        <p className="text-sm text-blue-600 mt-2">
                                          Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                          })}
                                        </p>
                                      )}
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                      Track Order
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                              {order.status === 'Delivered' && (
                                <>
                                  <button className="flex-1 min-w-[150px] px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:scale-105">
                                    Buy Again
                                  </button>
                                  <button className="flex-1 min-w-[150px] px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all hover:scale-105">
                                    Leave Review
                                  </button>
                                </>
                              )}
                              {order.status === 'In Transit' && (
                                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">
                                  Track Shipment
                                </button>
                              )}
                              {order.status === 'Processing' && (
                                <button className="flex-1 px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:border-red-500 hover:bg-red-50 transition-all hover:scale-105">
                                  Cancel Order
                                </button>
                              )}
                              <button className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all hover:scale-105">
                                Need Help?
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Blue accent line at bottom */}
                    <motion.div
                      className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ===== HELP SECTION ===== */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Need Assistance?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help with orders, returns, or any questions you may have.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/6479390809?text=Hello!%20I%20need%20help%20with%20my%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Contact Support
                </a>
                <Link
                  to="/faq"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 hover:scale-105 transition-all duration-300"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ===== CTA SECTION ===== */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Package className="w-5 h-5" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

