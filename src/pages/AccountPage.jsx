import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut, Edit3, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../api/user';
import { useEffect, useState } from 'react';

/**
 * Account Page - Premium Minimalist Design
 * 
 * Elegant glassmorphic account dashboard
 * Features soft neumorphism and layered shadows
 * Clean typography with Deep Indigo/Emerald Green accents
 * 
 * @page
 */
export default function AccountPage() {
  const { user, logout, isBusinessPending, canAccessWholesale, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch latest user data from backend when page loads
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        setIsRefreshing(true);
        const latestUserData = await getUserProfile();
        
        // Update the user data in AuthContext
        if (updateUser && latestUserData) {
          updateUser(latestUserData);
          console.log('✅ User data refreshed from backend:', latestUserData);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        // Don't show error to user - just use cached data
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshUserData();
  }, []); // Run once when page loads

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get user's first initial for avatar
  const userInitial = (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase();
  
  // Get account type display - Dynamic based on user role and verification status
  const accountType = user?.verified 
    ? 'Business Verified'  // User has business_verified role
    : user?.role === 'pending_business' 
      ? 'Business Pending'  // User has pending_business role
      : user?.role === 'business_user'
        ? 'Business User'  // User is business but awaiting verification
        : 'Customer';  // Regular customer
  
  const accountStatus = user?.verified 
    ? 'Active'  // Verified business users are active
    : user?.role === 'pending_business' || user?.role === 'business_user'
      ? 'Pending'  // Business users awaiting verification
      : 'Active';  // Regular customers are active

  // Quick actions list
  const quickActions = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'View order history',
      path: '/orders',
      color: 'indigo'
    },
    {
      icon: Heart,
      title: 'My Wishlist',
      description: 'Saved items',
      path: '/wishlist',
      color: 'emerald'
    },
    {
      icon: LogOut,
      title: 'Logout',
      description: 'Sign out of account',
      onClick: handleLogout,
      color: 'gray'
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const floatIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <>
      <SEO 
        title="My Account - Zanobia"
        description="Manage your Zanobia account settings and preferences"
      />

      {/* Soft gradient background - theme aware */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Title - Minimal */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-light text-gray-900 dark:text-white tracking-tight mb-2">
              My Account
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 dark:via-amber-500 to-transparent mx-auto" />
          </motion.div>

          {/* Business Pending Banner */}
          {isBusinessPending() && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 shadow-lg shadow-amber-100/50 dark:shadow-amber-900/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">Business Verification Pending</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Your account is under review. You'll receive an email once approved.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Card - Floating with soft neumorphism */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={floatIn}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 
                       shadow-[0_8px_30px_rgb(0,0,0,0.04),0_2px_10px_rgb(0,0,0,0.02)] 
                       dark:shadow-[0_8px_30px_rgb(0,0,0,0.3),0_2px_10px_rgb(0,0,0,0.2)]
                       border border-white/80 dark:border-gray-700/50"
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-indigo-50/20 dark:from-gray-700/20 dark:via-transparent dark:to-amber-900/10 pointer-events-none" />

            {/* Content Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-10">
              
              {/* LEFT: User Profile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-5">
                  {/* Frosted Glass Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-amber-500 dark:to-amber-600 
                                    flex items-center justify-center text-white text-4xl font-light
                                    shadow-[0_8px_20px_rgba(99,102,241,0.25)] dark:shadow-[0_8px_20px_rgba(245,158,11,0.3)]
                                    ring-4 ring-white/50 dark:ring-gray-700/50">
                      {userInitial}
                    </div>
                    {/* Status dot */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
                  </motion.div>

                  {/* Name & Email */}
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-1 tracking-tight">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.displayName || user?.username || 'User'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Profile Details - Clean Cards */}
                <div className="space-y-3 pt-4">
                  {/* Account Type */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl 
                                bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/30 dark:to-transparent
                                hover:from-indigo-50/30 dark:hover:from-amber-900/20 hover:shadow-sm transition-all duration-300">
                    <span className="text-sm font-light text-gray-600 dark:text-gray-400">Account Type</span>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm 
                                     text-sm font-medium text-gray-900 dark:text-gray-100
                                     shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]
                                     border border-gray-100 dark:border-gray-600">
                        {accountType}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl 
                                bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/30 dark:to-transparent
                                hover:from-emerald-50/30 dark:hover:from-emerald-900/20 hover:shadow-sm transition-all duration-300">
                    <span className="text-sm font-light text-gray-600 dark:text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      {accountStatus === 'Active' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-sm 
                                         text-sm font-medium text-emerald-700
                                         shadow-[0_2px_8px_rgba(16,185,129,0.1)] 
                                         border border-emerald-100">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="px-4 py-1.5 rounded-full bg-amber-50/80 backdrop-blur-sm 
                                         text-sm font-medium text-amber-700
                                         shadow-[0_2px_8px_rgba(245,158,11,0.1)] 
                                         border border-amber-100">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl 
                                bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/30 dark:to-transparent
                                hover:from-gray-100/30 dark:hover:from-gray-600/30 hover:shadow-sm transition-all duration-300">
                    <span className="text-sm font-light text-gray-600 dark:text-gray-400">Username</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      @{user?.username}
                    </span>
                  </div>

                  {/* Member Since */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl 
                                bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-700/30 dark:to-transparent
                                hover:from-gray-100/30 dark:hover:from-gray-600/30 hover:shadow-sm transition-all duration-300">
                    <span className="text-sm font-light text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Edit Profile Button - Solid accent with pillowy depth */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/account/edit')}
                  className="w-full mt-6 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-amber-500 dark:to-amber-600
                           text-white font-medium tracking-wide
                           shadow-[0_8px_16px_rgba(99,102,241,0.25),0_2px_4px_rgba(99,102,241,0.15)]
                           dark:shadow-[0_8px_16px_rgba(245,158,11,0.3),0_2px_4px_rgba(245,158,11,0.2)]
                           hover:shadow-[0_12px_24px_rgba(99,102,241,0.3),0_4px_8px_rgba(99,102,241,0.2)]
                           dark:hover:shadow-[0_12px_24px_rgba(245,158,11,0.35),0_4px_8px_rgba(245,158,11,0.25)]
                           transition-all duration-300
                           flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </motion.button>
              </motion.div>

              {/* RIGHT: Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    const isLogout = action.title === 'Logout';

                    const Component = action.path ? Link : 'button';
                    const props = action.path 
                      ? { to: action.path }
                      : { onClick: action.onClick };

                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Component
                          {...props}
                          className={`group block w-full p-5 rounded-2xl text-left
                                     bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm
                                     border border-gray-200/50 dark:border-gray-600/50
                                     shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                                     hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                                     hover:border-${action.color}-200 dark:hover:border-${action.color}-600
                                     hover:-translate-y-1
                                     transition-all duration-300 ease-out
                                     ${isLogout ? 'hover:border-red-200 dark:hover:border-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon Container with soft glow */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl 
                                          flex items-center justify-center
                                          ${isLogout 
                                            ? 'bg-gray-100 dark:bg-gray-600 group-hover:bg-red-100 dark:group-hover:bg-red-900/50' 
                                            : action.color === 'indigo' 
                                              ? 'bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/50' 
                                              : 'bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/50'}
                                          transition-all duration-300
                                          shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]`}
                            >
                              <Icon className={`w-5 h-5 
                                              ${isLogout 
                                                ? 'text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400' 
                                                : action.color === 'indigo' 
                                                  ? 'text-indigo-600 dark:text-indigo-400' 
                                                  : 'text-emerald-600 dark:text-emerald-400'}
                                              transition-colors duration-300`} 
                              />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                              <h4 className={`font-medium text-gray-900 dark:text-white mb-0.5
                                            ${isLogout ? 'group-hover:text-red-600 dark:group-hover:text-red-400' : ''}
                                            transition-colors duration-300`}>
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                                {action.description}
                              </p>
                            </div>

                            {/* Arrow indicator */}
                            <motion.div
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </Component>
                      </motion.div>
                    );
                  })}

                  {/* Wholesale Access (if eligible) */}
                  {canAccessWholesale() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to="/wholesale"
                        className="group block w-full p-5 rounded-2xl
                                 bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 backdrop-blur-sm
                                 border-2 border-emerald-200
                                 shadow-[0_4px_12px_rgba(16,185,129,0.15)]
                                 hover:shadow-[0_8px_24px_rgba(16,185,129,0.25)]
                                 hover:-translate-y-1
                                 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl 
                                        bg-gradient-to-br from-emerald-500 to-emerald-600
                                        flex items-center justify-center
                                        shadow-[0_4px_12px_rgba(16,185,129,0.3)]
                                        group-hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]
                                        transition-all duration-300">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-emerald-900 mb-0.5">
                              Wholesale Portal
                            </h4>
                            <p className="text-sm text-emerald-700 font-light">
                              Business orders & exclusive pricing
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

            {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Need assistance?{' '}
              <a 
                href="https://wa.me/6479390809?text=Hello!%20I%20need%20help%20with%20my%20account" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-amber-500 hover:text-indigo-700 dark:hover:text-amber-400 font-medium underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
