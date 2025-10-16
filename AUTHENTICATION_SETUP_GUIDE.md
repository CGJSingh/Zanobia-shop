# 🔐 Authentication System Setup Guide

Complete user authentication system for React + WooCommerce with role-based access control.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [WordPress/Backend Setup](#wordpressbackend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This authentication system provides:
- **User Registration** with role selection (Customer/Business)
- **JWT-based Login** with secure token storage
- **Role-based Access Control** (customer, business)
- **Business Account Approval** workflow
- **Guest Checkout** support
- **Protected Routes** with automatic redirects
- **Global Authentication State** via React Context

---

## ✨ Features

### Registration
- ✅ Two account types: **Customer** (instant access) and **Business** (requires approval)
- ✅ Form validation (username, email, password strength)
- ✅ Auto-login after registration (for customers)
- ✅ Email confirmation for business accounts

### Login
- ✅ JWT token authentication
- ✅ Remember me functionality via localStorage
- ✅ Auto-redirect after login
- ✅ Token validation on app load

### Role Management
- ✅ Customer role: Full shopping access
- ✅ Business role: Access to wholesale portal (when approved)
- ✅ Pending status banner for business accounts
- ✅ Role-based route protection

### Guest Features
- ✅ Guest checkout without account
- ✅ Persistent cart for guests
- ✅ Easy conversion to registered user

---

## 📁 File Structure

```
src/
├── api/
│   ├── auth.js                    # Authentication API functions
│   └── woocommerce.js             # WooCommerce API functions
│
├── components/
│   └── auth/
│       ├── LoginForm.jsx          # Login form component
│       ├── SignupForm.jsx         # Registration form with role selection
│       └── ProtectedRoute.jsx     # Route protection wrapper
│
├── context/
│   ├── AuthContext.jsx            # Global auth state management
│   ├── CartContext.jsx            # Shopping cart state
│   ├── ThemeContext.jsx           # Theme state
│   └── WishlistContext.jsx        # Wishlist state
│
├── pages/
│   ├── LoginPage.jsx              # Login page layout
│   ├── SignupPage.jsx             # Registration page layout
│   ├── AccountPage.jsx            # User account dashboard
│   └── Cart.jsx                   # Shopping cart with guest checkout
│
└── App.jsx                        # Main app with auth routes
```

---

## 🔧 WordPress/Backend Setup

### Step 1: Install Required WordPress Plugins

#### 1. JWT Authentication for WP REST API
```bash
# Install from WordPress dashboard:
# Plugins → Add New → Search "JWT Authentication for WP REST API"
# OR download from:
https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
```

#### 2. Configure JWT Plugin

Add to `wp-config.php` (before "That's all, stop editing!"):

```php
// JWT Authentication
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here-make-it-long-and-random');
define('JWT_AUTH_CORS_ENABLE', true);
```

Generate a secret key:
```bash
# Use this command or any random string generator:
openssl rand -base64 64
```

#### 3. Enable CORS in `.htaccess`

Add to your `.htaccess` file:

```apache
# Allow CORS for JWT
<IfModule mod_headers.c>
    SetEnvIf Origin "http(s)?://(www\.)?(localhost:3000|yourdomain.com)$" AccessControlAllowOrigin=$0
    Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header set Access-Control-Allow-Credentials true
    Header set Access-Control-Allow-Headers "Authorization, Content-Type"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
</IfModule>
```

### Step 2: Create Custom User Role (Optional)

Add this to your theme's `functions.php`:

```php
// Add custom 'business' role on theme activation
function add_business_role() {
    add_role(
        'business',
        'Business Customer',
        array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
        )
    );
}
add_action('after_switch_theme', 'add_business_role');
```

### Step 3: Create Custom Registration Endpoint (Optional but Recommended)

Create a plugin file: `wp-content/plugins/custom-auth/custom-auth.php`

```php
<?php
/**
 * Plugin Name: Custom Auth Endpoints
 * Description: Custom REST API endpoints for user registration with roles
 * Version: 1.0
 */

// Register custom REST API endpoint
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true'
    ));
});

function custom_user_registration($request) {
    $params = $request->get_json_params();
    
    // Validate required fields
    if (empty($params['username']) || empty($params['email']) || empty($params['password'])) {
        return new WP_Error('missing_fields', 'Username, email, and password are required', array('status' => 400));
    }
    
    // Check if username exists
    if (username_exists($params['username'])) {
        return new WP_Error('username_exists', 'Username already exists', array('status' => 400));
    }
    
    // Check if email exists
    if (email_exists($params['email'])) {
        return new WP_Error('email_exists', 'Email already exists', array('status' => 400));
    }
    
    // Get role from params
    $role = isset($params['role']) && $params['role'] === 'business' ? 'business' : 'customer';
    $account_status = $role === 'business' ? 'pending' : 'active';
    
    // Create user
    $user_id = wp_create_user($params['username'], $params['password'], $params['email']);
    
    if (is_wp_error($user_id)) {
        return $user_id;
    }
    
    // Update user meta
    wp_update_user(array(
        'ID' => $user_id,
        'first_name' => $params['first_name'] ?? '',
        'last_name' => $params['last_name'] ?? '',
        'role' => $role
    ));
    
    // Add custom meta
    update_user_meta($user_id, 'account_type', $role);
    update_user_meta($user_id, 'account_status', $account_status);
    update_user_meta($user_id, 'is_business', $role === 'business' ? 'yes' : 'no');
    
    // Send email notification
    if ($role === 'business') {
        wp_mail(
            $params['email'],
            'Business Account Pending Approval',
            'Your business account has been created and is pending approval. We will notify you once it\'s approved.'
        );
        
        // Notify admin
        $admin_email = get_option('admin_email');
        wp_mail(
            $admin_email,
            'New Business Account Registration',
            "A new business account has been registered:\n\nUsername: {$params['username']}\nEmail: {$params['email']}"
        );
    }
    
    return array(
        'success' => true,
        'user_id' => $user_id,
        'message' => $role === 'business' ? 'Business account created, pending approval' : 'Account created successfully'
    );
}
```

Activate this plugin in WordPress admin.

---

## 🚀 Frontend Setup

### Step 1: Environment Variables

Create `.env.local` in your project root:

```env
# WooCommerce API
VITE_WOOCOMMERCE_URL=https://yourdomain.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here

# WordPress API  
VITE_WORDPRESS_URL=https://yourdomain.com/wp-json

# JWT Authentication
VITE_JWT_AUTH_URL=https://yourdomain.com/wp-json/jwt-auth/v1

# Site Config
VITE_SITE_NAME=Zanobia Shop
VITE_SITE_DESCRIPTION=Your trusted online destination for quality products
```

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

## 📖 Usage Examples

### Using Auth Context in Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { 
    user,                    // Current user object
    isAuthenticated,         // Boolean: is user logged in?
    isLoading,              // Boolean: is auth loading?
    login,                  // Function: login user
    logout,                 // Function: logout user
    register,               // Function: register user
    hasRole,                // Function: check user role
    isBusiness,             // Function: is business account?
    isBusinessPending,      // Function: is business pending?
    canAccessWholesale      // Function: can access wholesale?
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {isBusinessPending() && <p>Your account is pending approval</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Example

```javascript
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      // Redirect or show success
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="username" 
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
      />
      <input 
        type="password"
        name="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Registration Example

```javascript
import { useAuth } from '../context/AuthContext';

function SignupComponent() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'customer' // or 'business'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(formData);
      if (result.requiresApproval) {
        alert('Business account created! Awaiting approval.');
      } else {
        alert('Account created and logged in!');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
        <option value="customer">Customer</option>
        <option value="business">Business</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Protected Route Example

```javascript
import ProtectedRoute from './components/auth/ProtectedRoute';

// In your routing:
<Route 
  path="/account" 
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  } 
/>

// Require specific role:
<Route 
  path="/wholesale" 
  element={
    <ProtectedRoute requireBusinessActive={true}>
      <WholesalePage />
    </ProtectedRoute>
  } 
/>
```

---

## 🧪 Testing

### Test Login

1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Should redirect to home with user info in header

### Test Registration

1. Navigate to `http://localhost:3000/signup`
2. Fill form and select **Customer**
3. Should create account and auto-login
4. Try **Business** account - should show pending message

### Test Protected Routes

1. Logout
2. Try to access `/account` - should redirect to login
3. Login and access `/account` - should work
4. Try `/wholesale` without business account - should show access denied

### Test Guest Checkout

1. Logout
2. Add items to cart
3. Go to `/cart`
4. Should see "Guest Checkout" banner with login/signup options
5. Can proceed as guest or login

---

## 🔍 Troubleshooting

### "JWT token invalid" error

**Solution:**
- Check JWT secret key in `wp-config.php`
- Verify CORS headers in `.htaccess`
- Clear browser localStorage and try again

### "403 Forbidden" on registration

**Solution:**
- Check WooCommerce REST API permissions
- Verify consumer key/secret are correct
- Enable "Allow registration" in WordPress settings

### Token expires immediately

**Solution:**
- JWT tokens expire after 7 days by default
- Extend expiration in WordPress JWT plugin settings
- Or implement refresh token logic

### Business account can't access wholesale

**Solution:**
- Check user meta: `account_status` should be `'active'`
- Update in WordPress admin or via custom endpoint
- Verify user role is `'business'`

### CORS errors in browser console

**Solution:**
- Add proper CORS headers to `.htaccess`
- Or use WordPress plugin like "WP CORS"
- Ensure your domain is whitelisted

### Can't see user info after login

**Solution:**
- Check browser console for errors
- Verify `/wp/v2/users/me` endpoint works
- Token might be invalid - try re-login

---

## 🎨 Customization

### Change Token Expiration

In WordPress, add filter:

```php
add_filter('jwt_auth_expire', function() {
    return time() + (DAY_IN_SECONDS * 30); // 30 days
});
```

### Add Custom User Fields

Extend registration form and API:

```javascript
// In SignupForm.jsx
const [formData, setFormData] = useState({
  // ... existing fields
  companyName: '',
  phoneNumber: ''
});
```

### Custom Role Redirects

```javascript
// In AuthContext.jsx after login:
if (result.user.role === 'business') {
  navigate('/wholesale');
} else {
  navigate('/');
}
```

---

## 📚 API Reference

### Auth API Functions (`api/auth.js`)

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `registerUser(userData)` | Object | Promise<Object> | Register new user |
| `loginUser(credentials)` | Object | Promise<Object> | Login user, get token |
| `logoutUser()` | - | Object | Clear auth data |
| `getUserDetails(token)` | string | Promise<Object> | Get user info |
| `validateToken(token)` | string | Promise<boolean> | Check if token valid |
| `isAuthenticated()` | - | boolean | Check if user logged in |
| `hasRole(role)` | string | boolean | Check user role |
| `isBusinessAccount()` | - | boolean | Is business account? |
| `canAccessWholesale()` | - | boolean | Can access wholesale? |

### Auth Context Hooks

```javascript
const {
  user,                    // User object or null
  token,                   // JWT token or null
  isAuthenticated,         // boolean
  isLoading,              // boolean
  error,                  // string or null
  login,                  // async function
  register,               // async function
  logout,                 // async function
  refreshUser,            // async function
  hasRole,                // function
  isBusiness,             // function
  isBusinessPending,      // function
  canAccessWholesale,     // function
  getDisplayName,         // function
  isGuest,                // function
  clearError              // function
} = useAuth();
```

---

## 🚀 Next Steps

Now that authentication is set up, you can:

1. ✅ **Implement Checkout Flow**
   - Create checkout page
   - Integrate with WooCommerce orders API
   - Add payment gateway

2. ✅ **Build Order History**
   - Fetch user orders
   - Display order details
   - Track shipments

3. ✅ **Add Profile Management**
   - Edit user profile
   - Change password
   - Update billing/shipping addresses

4. ✅ **Implement Wholesale Portal**
   - Business-only products
   - Bulk pricing
   - Custom ordering interface

5. ✅ **Add Email Notifications**
   - Welcome emails
   - Order confirmations
   - Business approval notifications

---

## 📝 Notes

- All passwords are hashed by WordPress (never sent plain text)
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Business accounts require manual approval in WordPress admin
- Guest carts persist until cleared by user
- Auth state syncs across browser tabs

---

## 🤝 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review WordPress error logs
3. Check browser console for errors
4. Verify all environment variables are set

---

**Last Updated:** October 8, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

