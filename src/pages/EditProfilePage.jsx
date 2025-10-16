import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Upload, X, Check, AlertCircle, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { getUserProfile, updateUserProfile, getUserAddresses } from '../api/user';
import AddressAutocomplete from '../components/AddressAutocomplete';

/**
 * Edit Profile Page - Premium Minimalist Design
 * 
 * Elegant profile editing with glassmorphic design
 * Features profile picture upload, conditional business registration
 * Soft neumorphism and clean validation
 * 
 * @page
 */
export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Current Address
    currentAddress: '',
    currentCity: '',
    currentProvince: '',
    currentPostalCode: '',
    currentCountry: 'CA',
    // Mailing/Shipping Address
    shippingAddress: '',
    shippingCity: '',
    shippingProvince: '',
    shippingPostalCode: '',
    shippingCountry: 'CA',
    accountType: 'customer',
    // Business fields
    companyName: '',
    taxId: '',
    businessAddress: '',
  });

  // Toggle for same address
  const [sameAddress, setSameAddress] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  // UI state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [isBusinessRegistrationActive, setIsBusinessRegistrationActive] = useState(false);

  // Fetch user data and pre-fill form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingData(true);

        // Fetch profile data
        const profileData = await getUserProfile();
        
        // Fetch addresses
        const addresses = await getUserAddresses();

        // Pre-fill form with user data
        setFormData({
          firstName: profileData.firstName || user?.firstName || '',
          lastName: profileData.lastName || user?.lastName || '',
          email: profileData.email || user?.email || '',
          phone: addresses.billing?.phone || profileData.mobilePhone || '',
          // Current Address (from billing)
          currentAddress: addresses.billing?.address1 || '',
          currentCity: addresses.billing?.city || '',
          currentProvince: addresses.billing?.state || '',
          currentPostalCode: addresses.billing?.postcode || '',
          currentCountry: addresses.billing?.country || 'CA',
          // Mailing/Shipping Address
          shippingAddress: addresses.shipping?.address1 || '',
          shippingCity: addresses.shipping?.city || '',
          shippingProvince: addresses.shipping?.state || '',
          shippingPostalCode: addresses.shipping?.postcode || '',
          shippingCountry: addresses.shipping?.country || 'CA',
          accountType: profileData.role === 'pending_business' || profileData.role === 'business_verified' ? 'business' : 'customer',
          // Business fields
          companyName: profileData.businessName || addresses.billing?.company || '',
          taxId: profileData.taxId || '',
          businessAddress: profileData.businessAddress || '',
        });

        // Check if shipping address is same as billing
        if (addresses.billing && addresses.shipping) {
          const isSame = 
            addresses.billing.address1 === addresses.shipping.address1 &&
            addresses.billing.city === addresses.shipping.city &&
            addresses.billing.state === addresses.shipping.state &&
            addresses.billing.postcode === addresses.shipping.postcode;
          setSameAddress(isSame);
        }

        // Set business registration active if user is business
        setIsBusinessRegistrationActive(
          profileData.role === 'pending_business' || profileData.role === 'business_verified'
        );

        // Set profile image if exists
        if (profileData.avatar) {
          setImagePreview(profileData.avatar);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        showToastMessage('Failed to load profile data', 'error');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    } else {
      setIsLoadingData(false);
    }
  }, [user?.id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Toggle business form visibility
    if (name === 'accountType') {
      setIsBusinessRegistrationActive(value === 'business');
    }

    // If same address is checked and current address changes, update shipping
    if (sameAddress && name.startsWith('current')) {
      const shippingField = name.replace('current', 'shipping');
      setFormData(prev => ({
        ...prev,
        [shippingField]: value
      }));
    }
  };

  // Handle toggle for same address
  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      // Copy current address to shipping address
      setFormData(prev => ({
        ...prev,
        shippingAddress: prev.currentAddress,
        shippingCity: prev.currentCity,
        shippingProvince: prev.currentProvince,
        shippingPostalCode: prev.currentPostalCode,
        shippingCountry: prev.currentCountry,
      }));
    }
  };

  // Handle address autocomplete selection for current address
  const handleCurrentAddressSelect = (address) => {
    if (!address) return;

    const updates = {
      currentAddress: `${address.houseNumber || ''} ${address.street || ''}`.trim(),
      currentCity: address.city || '',
      currentProvince: address.state || '',
      currentPostalCode: address.postalCode || '',
      currentCountry: address.country || 'CA',
    };

    setFormData(prev => ({
      ...prev,
      ...updates,
      ...(sameAddress ? {
        shippingAddress: updates.currentAddress,
        shippingCity: updates.currentCity,
        shippingProvince: updates.currentProvince,
        shippingPostalCode: updates.currentPostalCode,
        shippingCountry: updates.currentCountry,
      } : {})
    }));
  };

  // Handle address autocomplete selection for shipping address
  const handleShippingAddressSelect = (address) => {
    if (!address) return;

    setFormData(prev => ({
      ...prev,
      shippingAddress: `${address.houseNumber || ''} ${address.street || ''}`.trim(),
      shippingCity: address.city || '',
      shippingProvince: address.state || '',
      shippingPostalCode: address.postalCode || '',
      shippingCountry: address.country || 'CA',
    }));
  };

  // Handle profile picture selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profileImage: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
      return;
    }

    setProfileImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear error
    setErrors(prev => ({ ...prev, profileImage: '' }));
  };

  // Remove profile picture
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setImagePreview(user?.avatar || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Business fields validation
    if (isBusinessRegistrationActive) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.taxId.trim()) {
        newErrors.taxId = 'Tax ID/VAT is required';
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToastMessage('Please fix the errors before submitting', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        accountType: formData.accountType,
        // Current/Billing Address
        currentAddress: formData.currentAddress,
        currentCity: formData.currentCity,
        currentProvince: formData.currentProvince,
        currentPostalCode: formData.currentPostalCode,
        currentCountry: formData.currentCountry,
        // Shipping Address
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingProvince: formData.shippingProvince,
        shippingPostalCode: formData.shippingPostalCode,
        shippingCountry: formData.shippingCountry,
      };

      // Add business data if applicable
      if (isBusinessRegistrationActive) {
        updateData.companyName = formData.companyName;
        updateData.taxId = formData.taxId;
        updateData.businessAddress = formData.businessAddress;
      }

      // Call update API
      const result = await updateUserProfile(updateData);

      // Handle profile image upload if changed
      if (profileImageFile) {
        try {
          const { uploadProfilePicture } = await import('../api/user');
          await uploadProfilePicture(profileImageFile);
        } catch (imgError) {
          console.error('Image upload failed:', imgError);
          // Don't fail the whole update if image upload fails
        }
      }

      showToastMessage(result.message || 'Profile updated successfully!', 'success');
      
      // Redirect back to account after 2 seconds
      setTimeout(() => {
        navigate('/account');
      }, 2000);

    } catch (err) {
      showToastMessage(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast notification
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const slideDown = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      marginTop: '24px',
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <>
      <SEO 
        title="Edit Profile - Zanobia"
        description="Update your account information and preferences"
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toastType === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
                : 'bg-red-50/95 border-red-200 text-red-800'
            }`}>
              {toastType === 'success' ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/account')}
            className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">Back to Account</span>
          </motion.button>

          {/* Page Title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-light text-gray-900 dark:text-white tracking-tight mb-2">
              Edit Profile
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 dark:via-amber-500 to-transparent mx-auto" />
          </motion.div>

          {/* Loading State */}
          {isLoadingData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 
                       shadow-[0_8px_30px_rgb(0,0,0,0.04),0_2px_10px_rgb(0,0,0,0.02)] 
                       dark:shadow-[0_8px_30px_rgb(0,0,0,0.3),0_2px_10px_rgb(0,0,0,0.2)]
                       border border-white/80 dark:border-gray-700/50"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left skeleton */}
                <div className="space-y-8 animate-pulse">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gray-200" />
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
                {/* Right skeleton */}
                <div className="space-y-8 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Main Form Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 
                         shadow-[0_8px_30px_rgb(0,0,0,0.04),0_2px_10px_rgb(0,0,0,0.02)] 
                         dark:shadow-[0_8px_30px_rgb(0,0,0,0.3),0_2px_10px_rgb(0,0,0,0.2)]
                         border border-white/80 dark:border-gray-700/50"
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-indigo-50/20 dark:from-gray-700/20 dark:via-transparent dark:to-amber-900/10 pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative">
              
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* LEFT: Profile Picture & Basic Info */}
                <div className="space-y-8">
                  
                  {/* Profile Picture Upload */}
                  <div className="text-center">
                    <label className="block text-sm font-light text-gray-600 mb-4">
                      Profile Picture
                    </label>
                    
                    {/* Circular Preview */}
                    <div className="relative inline-block">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 
                                 flex items-center justify-center text-white text-5xl font-light
                                 shadow-[0_8px_20px_rgba(99,102,241,0.25)] 
                                 ring-4 ring-white/50 overflow-hidden"
                      >
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{(formData.firstName?.[0] || 'U').toUpperCase()}</span>
                        )}
                      </motion.div>

                      {/* Change Photo Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2.5 rounded-full 
                                 bg-white border-2 border-indigo-500 
                                 text-indigo-600 hover:bg-indigo-50
                                 shadow-lg hover:shadow-xl
                                 transition-all duration-300"
                      >
                        <Upload className="w-4 h-4" />
                      </button>

                      {/* Remove Image Button (if image exists) */}
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 p-1.5 rounded-full 
                                   bg-red-500 text-white hover:bg-red-600
                                   shadow-lg transition-all duration-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>

                    {errors.profileImage && (
                      <p className="mt-2 text-sm text-red-500 font-light">
                        {errors.profileImage}
                      </p>
                    )}
                    
                    <p className="mt-3 text-xs text-gray-500 font-light">
                      Max size: 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-light text-gray-600 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                               border-b-2 border-gray-200 
                               focus:border-indigo-500 focus:bg-white
                               focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                               text-gray-900 placeholder-gray-400
                               rounded-xl rounded-b-none
                               transition-all duration-300 outline-none
                               ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-light text-gray-600 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                               border-b-2 border-gray-200 
                               focus:border-indigo-500 focus:bg-white
                               focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                               text-gray-900 placeholder-gray-400
                               rounded-xl rounded-b-none
                               transition-all duration-300 outline-none
                               ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email (Disabled) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-light text-gray-600 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-5 py-3.5 bg-gray-100/50 backdrop-blur-sm 
                                 border-b-2 border-gray-200 
                                 text-gray-500 
                                 rounded-xl rounded-b-none
                                 cursor-not-allowed opacity-75"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-light">
                        Cannot be changed
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-light">
                      Contact support to change your email address
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-light text-gray-600 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                               border-b-2 border-gray-200 
                               focus:border-indigo-500 focus:bg-white
                               focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                               text-gray-900 placeholder-gray-400
                               rounded-xl rounded-b-none
                               transition-all duration-300 outline-none
                               ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder="(XXX) XXX-XXXX"
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* Account Type */}
                  <div>
                    <label htmlFor="accountType" className="block text-sm font-light text-gray-600 mb-2">
                      Account Type
                    </label>
                    <select
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                               border-b-2 border-gray-200 
                               focus:border-indigo-500 focus:bg-white
                               focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                               text-gray-900
                               rounded-xl rounded-b-none
                               transition-all duration-300 outline-none
                               cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="business">Business</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 font-light">
                      Switching to Business requires admin approval
                    </p>
                  </div>
                </div>

                {/* RIGHT: Address Information */}
                <div className="space-y-8">
                  
                  <h3 className="text-xl font-light text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                    Current Address
                  </h3>

                  {/* Current Address Autocomplete */}
                  <AddressAutocomplete
                    value={formData.currentAddress}
                    onChange={(val) => handleChange({ target: { name: 'currentAddress', value: val } })}
                    onAddressSelect={handleCurrentAddressSelect}
                    country={formData.currentCountry}
                    placeholder="Start typing your current address..."
                    label="Street Address"
                    error={errors.currentAddress}
                    showUseLocation={true}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label htmlFor="currentCity" className="block text-sm font-light text-gray-600 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="currentCity"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                 border-b-2 border-gray-200 
                                 focus:border-indigo-500 focus:bg-white
                                 focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                                 text-gray-900 placeholder-gray-400
                                 rounded-xl rounded-b-none
                                 transition-all duration-300 outline-none"
                        placeholder="Toronto"
                      />
                    </div>

                    {/* Province/State */}
                    <div>
                      <label htmlFor="currentProvince" className="block text-sm font-light text-gray-600 mb-2">
                        Province/State
                      </label>
                      <input
                        type="text"
                        id="currentProvince"
                        name="currentProvince"
                        value={formData.currentProvince}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                 border-b-2 border-gray-200 
                                 focus:border-indigo-500 focus:bg-white
                                 focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                                 text-gray-900 placeholder-gray-400
                                 rounded-xl rounded-b-none
                                 transition-all duration-300 outline-none"
                        placeholder="Ontario"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Postal Code */}
                    <div>
                      <label htmlFor="currentPostalCode" className="block text-sm font-light text-gray-600 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="currentPostalCode"
                        name="currentPostalCode"
                        value={formData.currentPostalCode}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                 border-b-2 border-gray-200 
                                 focus:border-indigo-500 focus:bg-white
                                 focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                                 text-gray-900 placeholder-gray-400
                                 rounded-xl rounded-b-none
                                 transition-all duration-300 outline-none"
                        placeholder="M5V 3A8"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="currentCountry" className="block text-sm font-light text-gray-600 mb-2">
                        Country
                      </label>
                      <select
                        id="currentCountry"
                        name="currentCountry"
                        value={formData.currentCountry}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                 border-b-2 border-gray-200 
                                 focus:border-indigo-500 focus:bg-white
                                 focus:shadow-[0_4px_12px_rgba(99,102,241,0.08)]
                                 text-gray-900
                                 rounded-xl rounded-b-none
                                 transition-all duration-300 outline-none
                                 cursor-pointer"
                      >
                        <option value="CA">🍁 Canada</option>
                        <option value="US">🇺🇸 United States</option>
                      </select>
                    </div>
                  </div>

                  {/* Same Address Toggle */}
                  <div className="pt-6 border-t border-gray-200/50">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={sameAddress}
                          onChange={handleSameAddressToggle}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300" />
                        <div className="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md 
                                      peer-checked:translate-x-7 transition-transform duration-300" />
                      </div>
                      <span className="text-sm font-light text-gray-700 group-hover:text-gray-900 transition-colors">
                        Mailing/Shipping address is the same as current address
                      </span>
                    </label>
                  </div>

                  {/* Mailing/Shipping Address */}
                  <AnimatePresence>
                    {!sameAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <h3 className="text-xl font-light text-gray-900 mb-4 flex items-center gap-2 pt-6">
                          <span className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                          Mailing/Shipping Address
                        </h3>

                        {/* Shipping Address Autocomplete */}
                        <AddressAutocomplete
                          value={formData.shippingAddress}
                          onChange={(val) => handleChange({ target: { name: 'shippingAddress', value: val } })}
                          onAddressSelect={handleShippingAddressSelect}
                          country={formData.shippingCountry}
                          placeholder="Start typing your shipping address..."
                          label="Street Address"
                          error={errors.shippingAddress}
                          showUseLocation={true}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          {/* City */}
                          <div>
                            <label htmlFor="shippingCity" className="block text-sm font-light text-gray-600 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              id="shippingCity"
                              name="shippingCity"
                              value={formData.shippingCity}
                              onChange={handleChange}
                              className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                       border-b-2 border-gray-200 
                                       focus:border-emerald-500 focus:bg-white
                                       focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                       text-gray-900 placeholder-gray-400
                                       rounded-xl rounded-b-none
                                       transition-all duration-300 outline-none"
                              placeholder="Toronto"
                            />
                          </div>

                          {/* Province/State */}
                          <div>
                            <label htmlFor="shippingProvince" className="block text-sm font-light text-gray-600 mb-2">
                              Province/State
                            </label>
                            <input
                              type="text"
                              id="shippingProvince"
                              name="shippingProvince"
                              value={formData.shippingProvince}
                              onChange={handleChange}
                              className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                       border-b-2 border-gray-200 
                                       focus:border-emerald-500 focus:bg-white
                                       focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                       text-gray-900 placeholder-gray-400
                                       rounded-xl rounded-b-none
                                       transition-all duration-300 outline-none"
                              placeholder="Ontario"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Postal Code */}
                          <div>
                            <label htmlFor="shippingPostalCode" className="block text-sm font-light text-gray-600 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              id="shippingPostalCode"
                              name="shippingPostalCode"
                              value={formData.shippingPostalCode}
                              onChange={handleChange}
                              className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                       border-b-2 border-gray-200 
                                       focus:border-emerald-500 focus:bg-white
                                       focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                       text-gray-900 placeholder-gray-400
                                       rounded-xl rounded-b-none
                                       transition-all duration-300 outline-none"
                              placeholder="M5V 3A8"
                            />
                          </div>

                          {/* Country */}
                          <div>
                            <label htmlFor="shippingCountry" className="block text-sm font-light text-gray-600 mb-2">
                              Country
                            </label>
                            <select
                              id="shippingCountry"
                              name="shippingCountry"
                              value={formData.shippingCountry}
                              onChange={handleChange}
                              className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                       border-b-2 border-gray-200 
                                       focus:border-emerald-500 focus:bg-white
                                       focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                       text-gray-900
                                       rounded-xl rounded-b-none
                                       transition-all duration-300 outline-none
                                       cursor-pointer"
                            >
                              <option value="CA">🍁 Canada</option>
                              <option value="US">🇺🇸 United States</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Conditional Business Registration Form */}
              <AnimatePresence>
                {isBusinessRegistrationActive && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={slideDown}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 border-t border-gray-200/50">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                        Business Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Company Name */}
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-light text-gray-600 mb-2">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                     border-b-2 border-gray-200 
                                     focus:border-emerald-500 focus:bg-white
                                     focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                     text-gray-900 placeholder-gray-400
                                     rounded-xl rounded-b-none
                                     transition-all duration-300 outline-none
                                     ${errors.companyName ? 'border-red-300 focus:border-red-500' : ''}`}
                            placeholder="Your Company Inc."
                          />
                          {errors.companyName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.companyName}
                            </motion.p>
                          )}
                        </div>

                        {/* Tax ID/VAT */}
                        <div>
                          <label htmlFor="taxId" className="block text-sm font-light text-gray-600 mb-2">
                            Tax ID / VAT Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="taxId"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                     border-b-2 border-gray-200 
                                     focus:border-emerald-500 focus:bg-white
                                     focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                     text-gray-900 placeholder-gray-400
                                     rounded-xl rounded-b-none
                                     transition-all duration-300 outline-none
                                     ${errors.taxId ? 'border-red-300 focus:border-red-500' : ''}`}
                            placeholder="123-456-789"
                          />
                          {errors.taxId && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.taxId}
                            </motion.p>
                          )}
                        </div>

                        {/* Business Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="businessAddress" className="block text-sm font-light text-gray-600 mb-2">
                            Business Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="businessAddress"
                            name="businessAddress"
                            value={formData.businessAddress}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm 
                                     border-b-2 border-gray-200 
                                     focus:border-emerald-500 focus:bg-white
                                     focus:shadow-[0_4px_12px_rgba(16,185,129,0.08)]
                                     text-gray-900 placeholder-gray-400
                                     rounded-xl rounded-b-none
                                     transition-all duration-300 outline-none resize-none
                                     ${errors.businessAddress ? 'border-red-300 focus:border-red-500' : ''}`}
                            placeholder="456 Business Blvd, Suite 100, City, Province, Postal Code"
                          />
                          {errors.businessAddress && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 font-light flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.businessAddress}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Business Notice */}
                      <div className="mt-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/50">
                        <p className="text-sm text-emerald-800 font-light">
                          ℹ️ Business account registration requires admin approval. You'll be notified once verified.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-10 pt-8 border-t border-gray-200/50 flex flex-col sm:flex-row gap-4 justify-end">
                
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  disabled={isLoading}
                  className="px-8 py-3.5 text-gray-600 hover:text-gray-900 
                           font-medium tracking-wide
                           transition-colors duration-300
                           disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Save Changes Button - Pillowy Solid Accent */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 
                           text-white font-medium tracking-wide
                           shadow-[0_8px_16px_rgba(99,102,241,0.25),0_2px_4px_rgba(99,102,241,0.15)]
                           hover:shadow-[0_12px_24px_rgba(99,102,241,0.3),0_4px_8px_rgba(99,102,241,0.2)]
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>

              {/* Decorative orbs */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

