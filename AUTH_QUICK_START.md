# 🚀 Authentication Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install WordPress JWT Plugin

Go to your WordPress admin and install:
**JWT Authentication for WP REST API**

### 2. Configure WordPress

Add to `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key-here-make-it-very-long-and-random');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 3. Update Environment Variables

Your `.env.local` should have:

```env
VITE_WORDPRESS_URL=https://go.zanobiaonline.com/wp-json
VITE_JWT_AUTH_URL=https://go.zanobiaonline.com/wp-json/jwt-auth/v1
```

### 4. Restart Dev Server

```bash
npm run dev
```

---

## 📍 Available Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | User login page |
| `/signup` | Public | User registration |
| `/account` | Protected | User dashboard |
| `/cart` | Public/Guest | Shopping cart |
| `/wishlist` | Protected | User wishlist |
| `/orders` | Protected | Order history |
| `/wholesale` | Business Only | Wholesale portal |

---

## 🔑 Quick Usage

### Check if User is Logged In

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.displayName}!</p>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
```

### Protect a Route

```javascript
import ProtectedRoute from './components/auth/ProtectedRoute';

<Route 
  path="/account" 
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  } 
/>
```

### Check User Role

```javascript
const { isBusiness, canAccessWholesale, isBusinessPending } = useAuth();

if (isBusinessPending()) {
  return <div>Your account is pending approval</div>;
}

if (canAccessWholesale()) {
  return <div>Access wholesale portal</div>;
}
```

---

## ✅ Test Your Setup

### Test 1: Visit Login Page
```
http://localhost:3000/login
```
Should show login form.

### Test 2: Visit Signup Page
```
http://localhost:3000/signup
```
Should show registration form with role selection.

### Test 3: Try Protected Route
```
http://localhost:3000/account
```
Should redirect to login if not authenticated.

### Test 4: Check Console
Open browser console (F12), should see:
```
WooCommerce API Configuration: {...}
```
No errors.

---

## 🐛 Common Issues

### Issue: "JWT token invalid"
**Fix:** Check JWT secret key in wp-config.php

### Issue: Can't register users
**Fix:** Enable user registration in WordPress Settings → General

### Issue: CORS errors
**Fix:** Add to .htaccess:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Headers "Authorization, Content-Type"
```

---

## 📖 Full Documentation

For complete setup instructions, see:
- `AUTHENTICATION_SETUP_GUIDE.md` - Complete guide
- `WOOCOMMERCE_API_GUIDE.md` - API reference

---

## 🎯 What's Next?

After authentication works, you can:

1. **Test Registration**
   - Create a customer account
   - Create a business account
   - Verify business accounts need approval

2. **Build Checkout**
   - Implement order creation
   - Add payment gateway
   - Send confirmation emails

3. **Add Profile Management**
   - Edit user details
   - Change password
   - Update addresses

4. **Implement Orders**
   - Fetch user orders
   - Show order history
   - Track shipments

---

**Need Help?** Check the full setup guide or troubleshooting section.

**Status:** ✅ All authentication features are ready to use!

