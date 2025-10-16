import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Signup Form Component
 * 
 * Allows new users to create an account
 * Supports two account types: Customer and Business
 * Business accounts require admin approval
 * Regular customer accounts are active immediately
 * 
 * @component
 */
export default function SignupForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '', // For business accounts
    mobilePhone: '',
    role: 'customer', // 'customer' or 'business'
    agreeToTerms: false
  });

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [useEmailAsUsername, setUseEmailAsUsername] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Password validation state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // OTP state
  const [otpStep, setOtpStep] = useState('form'); // 'form' | 'choose-method' | 'verify'
  const [otpMethod, setOtpMethod] = useState(''); // 'email' | 'mobile'
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 individual digits
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Refs for scrolling to errors
  const errorRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // OTP input refs
  const otpRefs = useRef([]);
  otpRefs.current = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  /**
   * Sync email to username if option is enabled
   */
  useEffect(() => {
    if (useEmailAsUsername && formData.email) {
      setFormData(prev => ({
        ...prev,
        username: formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
      }));
    }
  }, [formData.email, useEmailAsUsername]);

  /**
   * Check password requirements in real-time
   */
  useEffect(() => {
    const password = formData.password;
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  }, [formData.password]);

  /**
   * Check password confirmation match
   */
  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);

  /**
   * Scroll to error message when error appears
   */
  useEffect(() => {
    if (error && errorRef?.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error]);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Scroll to first error field
   */
  const scrollToError = (ref) => {
    // First scroll to error message at top
    if (errorRef?.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Then optionally scroll to the specific field
    if (ref?.current && ref !== errorRef) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.current.focus();
      }, 300);
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    // Username validation
    if (!formData.username.trim()) {
      setError('Username is required');
      scrollToError(usernameRef);
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      scrollToError(usernameRef);
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      scrollToError(usernameRef);
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError('Email is required');
      scrollToError(emailRef);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      scrollToError(emailRef);
      return false;
    }

    // Mobile phone validation
    if (!formData.mobilePhone.trim()) {
      setError('Mobile phone is required');
      scrollToError(phoneRef);
      return false;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.mobilePhone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid mobile phone number');
      scrollToError(phoneRef);
      return false;
    }

    // Business name validation (required for business accounts)
    if (formData.role === 'business' && !formData.businessName.trim()) {
      setError('Business name is required for business accounts');
      scrollToError(errorRef);
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required');
      scrollToError(passwordRef);
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      scrollToError(passwordRef);
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      scrollToError(passwordRef);
      return false;
    }

    // Check for common weak passwords
    const passwordLower = formData.password.toLowerCase();
    if (passwordLower.includes('12345')) {
      setError('Password cannot contain common sequences like "12345"');
      scrollToError(passwordRef);
      return false;
    }
    if (passwordLower.includes('abcde')) {
      setError('Password cannot contain common sequences like "abcde"');
      scrollToError(passwordRef);
      return false;
    }
    if (passwordLower.includes('password')) {
      setError('Password cannot contain the word "password"');
      scrollToError(passwordRef);
      return false;
    }

    // Check if password contains user's name
    if (formData.firstName && passwordLower.includes(formData.firstName.toLowerCase())) {
      setError('Password cannot contain your first name');
      scrollToError(passwordRef);
      return false;
    }
    if (formData.lastName && passwordLower.includes(formData.lastName.toLowerCase())) {
      setError('Password cannot contain your last name');
      scrollToError(passwordRef);
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      scrollToError(confirmPasswordRef);
      return false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      scrollToError(errorRef);
      return false;
    }

    return true;
  };

  /**
   * Generate OTP code
   */
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  /**
   * Send OTP to user
   */
  const sendOTP = (method) => {
    const code = generateOTP();
    setGeneratedOtp(code);
    setOtpMethod(method);
    setOtpStep('verify');
    setOtpTimer(60); // 60 seconds timer

    // Simulate sending OTP (in production, call your backend API)
    console.log(`OTP sent to ${method}:`, code);
    alert(`OTP sent to your ${method}: ${code}\n(This is a demo - in production, you'll receive this via ${method})`);

    // Start countdown
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].current?.focus();
    }
    
    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Handle OTP input keydown
   */
  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current?.focus();
    }
  };

  /**
   * Handle OTP paste
   */
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    
    // Focus last filled digit or last box
    const lastFilledIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastFilledIndex].current?.focus();
  };

  /**
   * Verify OTP
   */
  const verifyOTP = () => {
    const otpString = otp.join('');
    if (otpString === generatedOtp) {
      return true;
    }
    setError('Invalid OTP. Please try again.');
    return false;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Move to OTP method selection
    setOtpStep('choose-method');
  };

  /**
   * Handle OTP verification and registration
   */
  const handleOTPVerification = async () => {
    if (!verifyOTP()) {
      return;
    }

    try {
      const result = await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobilePhone: formData.mobilePhone.trim(),
        businessName: formData.role === 'business' ? formData.businessName.trim() : '',
        role: formData.role
      });

      if (result.requiresApproval) {
        // Business account created, needs approval
        setSuccess('Business account created! Please wait for admin approval. We will notify you via email.');
        // Reset form
        setTimeout(() => {
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            businessName: '',
            mobilePhone: '',
            role: 'customer',
            agreeToTerms: false
          });
          setOtpStep('form');
          setOtp(['', '', '', '', '', '']);
        }, 3000);
      } else {
        // Regular account created and logged in
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl bg-white border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">
          Create Account
        </h2>
        <p className="text-sm text-gray-600">
          Join Zanobia and start shopping
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div ref={errorRef} className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Option */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role === 'customer'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <svg className={`w-8 h-8 ${formData.role === 'customer' ? 'text-blue-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className={`font-semibold mb-1 ${formData.role === 'customer' ? 'text-blue-600' : 'text-gray-700'}`}>
                Customer
              </h3>
              <p className="text-xs text-gray-600">
                For personal shopping
              </p>
              {formData.role === 'customer' && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                    Instant Access
                  </span>
                </div>
              )}
            </button>

            {/* Business Option */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'business' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role === 'business'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <svg className={`w-8 h-8 ${formData.role === 'business' ? 'text-purple-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className={`font-semibold mb-1 ${formData.role === 'business' ? 'text-purple-600' : 'text-gray-700'}`}>
                Business
              </h3>
              <p className="text-xs text-gray-600">
                For wholesale orders
              </p>
              {formData.role === 'business' && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                    Requires Approval
                  </span>
                </div>
              )}
            </button>
          </div>
          {formData.role === 'business' && (
            <p className="mt-2 text-xs text-gray-600">
              ⓘ Business accounts are reviewed by our team. You'll receive an email once approved.
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
            placeholder="john@example.com"
            autoComplete="email"
            required
          />
        </div>

        {/* Username Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useEmailAsUsername}
                onChange={(e) => setUseEmailAsUsername(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-600">
                Use email as username
              </span>
            </label>
          </div>
          <input
            ref={usernameRef}
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading || useEmailAsUsername}
            className={`w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors ${useEmailAsUsername ? 'cursor-not-allowed' : ''}`}
            placeholder={useEmailAsUsername ? 'Auto-generated from email' : 'johndoe'}
            autoComplete="username"
            required
          />
          {useEmailAsUsername && (
            <p className="mt-1 text-xs text-gray-600">
              ℹ️ Username will be created from your email address
            </p>
          )}
        </div>

        {/* Mobile Phone Field */}
        <div>
          <label htmlFor="mobilePhone" className="block text-sm font-medium mb-2 text-gray-700">
            Mobile Phone <span className="text-red-500">*</span>
          </label>
          <input
            ref={phoneRef}
            type="tel"
            id="mobilePhone"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
            required
          />
        </div>

        {/* Business Name Field (only for business accounts) */}
        {formData.role === 'business' && (
          <div className="animate-fadeIn">
            <label htmlFor="businessName" className="block text-sm font-medium mb-2 text-gray-700">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 transition-colors"
              placeholder="Your Business Name LLC"
              required
            />
            <p className="mt-1 text-xs text-gray-600">
              Enter your registered business name
            </p>
          </div>
        )}

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {/* Real-time Password Requirements */}
            {formData.password && (
              <div className="mt-2 text-xs space-y-1 p-2 rounded-lg bg-gray-50">
                <div className={`flex items-center space-x-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.minLength ? '✓' : '○'}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.hasUppercase ? '✓' : '○'}</span>
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.hasLowercase ? '✓' : '○'}</span>
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                  <span>One number</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                  <span>One special character (!@#$%^&*)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={confirmPasswordRef}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors ${
                  confirmPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''
                }`}
                placeholder="Repeat password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {/* Inline Confirm Password Error */}
            {confirmPasswordError && (
              <p className="mt-1 text-xs text-red-600 flex items-center animate-fadeIn">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {confirmPasswordError}
              </p>
            )}
            
            {/* Success indicator when passwords match */}
            {formData.confirmPassword && !confirmPasswordError && formData.password === formData.confirmPassword && (
              <p className="mt-1 text-xs text-green-600 flex items-center animate-fadeIn">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Passwords match!
              </p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <Link 
          to="/login" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Login instead
        </Link>
      </div>

      {/* OTP Method Selection Modal */}
      {otpStep === 'choose-method' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl p-8 shadow-2xl bg-white border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Verify Your Identity
            </h3>
            <p className="mb-6 text-gray-600">
              Choose how you'd like to receive your verification code:
            </p>

            <div className="space-y-3">
              {/* Email Option */}
              <button
                onClick={() => sendOTP('email')}
                className="w-full p-4 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center"
              >
                <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Email
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.email}
                  </div>
                </div>
              </button>

              {/* Mobile Option */}
              <button
                onClick={() => sendOTP('mobile')}
                className="w-full p-4 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all flex items-center"
              >
                <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Mobile Phone
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.mobilePhone}
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setOtpStep('form')}
              className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Form
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpStep === 'verify' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl p-8 shadow-2xl bg-white border border-gray-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                Enter Verification Code
              </h3>
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to your {otpMethod}
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="mb-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs.current[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all caret-transparent ${
                      digit 
                        ? 'border-blue-500 bg-blue-50 scale-105' 
                        : 'border-gray-300 bg-white'
                    } text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:scale-105`}
                    placeholder="0"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-center mt-3 text-xs text-gray-600">
                💡 Tip: You can paste all 6 digits at once
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {otpTimer > 0 && (
              <p className="text-center text-sm mb-4 text-gray-600">
                Resend code in {otpTimer}s
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={handleOTPVerification}
                disabled={otp.some(digit => !digit) || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  otp.some(digit => !digit) || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                } shadow-lg`}
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              {otpTimer === 0 && (
                <button
                  onClick={() => sendOTP(otpMethod)}
                  className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Resend Code
                </button>
              )}

              <button
                onClick={() => {
                  setOtpStep('choose-method');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Choose Different Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

