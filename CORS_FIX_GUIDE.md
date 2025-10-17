# 🔧 CORS Error Fix - WordPress Configuration

## ❌ **The Error:**

```
Access to XMLHttpRequest at 'https://www.zanobiaonline.com/wp-json/wc/v3/products' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:3000, *', but only one is allowed.
```

---

## 🔍 **Root Cause:**

Your WordPress server is sending **DUPLICATE** CORS headers from multiple sources:
- CORS plugin
- `.htaccess` file
- `wp-config.php`
- Custom plugin code

**Browsers reject this** because only ONE `Access-Control-Allow-Origin` header is allowed.

---

## ✅ **Solution 1: WordPress Plugin Method (RECOMMENDED)**

### **Step 1: Install "WP CORS" Plugin**

1. Login to WordPress admin
2. Go to: **Plugins** → **Add New**
3. Search: **"WP CORS"**
4. Install and Activate

### **Step 2: Configure WP CORS**

1. Go to: **Settings** → **WP CORS**
2. **Add these origins:**
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
3. **Enable these headers:**
   - ✅ Access-Control-Allow-Origin
   - ✅ Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   - ✅ Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With
   - ✅ Access-Control-Allow-Credentials: true
4. **Save Changes**

### **Step 3: Remove Other CORS Configurations**

**Important:** Remove CORS headers from other locations to avoid duplicates:

#### **A. Check .htaccess** (in WordPress root)
```apache
# Remove or comment out these lines if they exist:
# Header set Access-Control-Allow-Origin "*"
# Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
# Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

#### **B. Check wp-config.php**
```php
// Remove or comment out these lines if they exist:
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

#### **C. Check Zanobia Plugin**
In `zanobia-business-accounts.php`, we'll update to let WP CORS handle it.

---

## ✅ **Solution 2: Manual .htaccess Configuration**

If you don't want to use a plugin, update your `.htaccess` file manually.

### **File Location:**
```
/public_html/.htaccess
```

### **Add This Code** (at the top, after `# BEGIN WordPress`):

```apache
# BEGIN CORS Configuration
<IfModule mod_headers.c>
    # Handle preflight OPTIONS requests
    Header always set Access-Control-Allow-Origin "http://localhost:3000"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Max-Age "3600"
    
    # Handle OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
# END CORS Configuration
```

**For Production + Development:**
```apache
# BEGIN CORS Configuration
<IfModule mod_headers.c>
    # Allow multiple origins (development + production)
    SetEnvIf Origin "^http(s)?://(localhost:3000|www\.zanobiaonline\.com|zanobiaonline\.com)$" ORIGIN_ALLOWED=$0
    Header always set Access-Control-Allow-Origin "%{ORIGIN_ALLOWED}e" env=ORIGIN_ALLOWED
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Max-Age "3600"
    
    # Handle OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
# END CORS Configuration
```

---

## ✅ **Solution 3: WordPress wp-config.php**

Add this to `wp-config.php` (before `/* That's all, stop editing! */`):

```php
// CORS Configuration - Allow localhost:3000 and production domain
function zanobia_cors_headers() {
    $allowed_origins = array(
        'http://localhost:3000',
        'https://www.zanobiaonline.com',
        'https://zanobiaonline.com'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}

add_action('init', 'zanobia_cors_headers');
add_action('rest_api_init', 'zanobia_cors_headers');
```

---

## ✅ **Solution 4: Update Zanobia Plugin**

Update the Zanobia Business Accounts plugin to use proper CORS configuration.

**File:** `wordpress-plugin/zanobia-business-accounts.php`

**Add this method to the class:**

```php
/**
 * Setup CORS headers for REST API
 */
public function setup_cors() {
    $allowed_origins = array(
        'http://localhost:3000',
        'https://www.zanobiaonline.com',
        'https://zanobiaonline.com'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
    }
}
```

**Add this to the `__construct()` method:**

```php
public function __construct() {
    // ... existing code ...
    
    // Setup CORS
    add_action('rest_api_init', array($this, 'setup_cors'), 0);
    add_action('init', array($this, 'setup_cors'), 0);
}
```

---

## 🧪 **How to Test**

### **Test 1: Check Current CORS Headers**

Open terminal and run:

```bash
curl -I -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type" \
  https://www.zanobiaonline.com/wp-json/wc/v3/products
```

**Look for:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

**Should NOT see:**
```
Access-Control-Allow-Origin: http://localhost:3000, *
```

---

### **Test 2: Test in Browser**

1. Open browser console (F12)
2. Run this:
   ```javascript
   fetch('https://www.zanobiaonline.com/wp-json/wc/v3/products?per_page=1', {
     headers: {
       'Authorization': 'Basic ' + btoa('YOUR_KEY:YOUR_SECRET')
     }
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```

**Should see:** Product data (not CORS error)

---

### **Test 3: Test React App**

1. Refresh React app: http://localhost:3000
2. Open browser console
3. Check Network tab
4. **Should NOT see:**
   - ❌ CORS policy errors
   - ❌ ERR_FAILED
5. **Should see:**
   - ✅ Products loading
   - ✅ Status 200 responses

---

## 🔍 **Debugging Steps**

### **Step 1: Check All CORS Sources**

Run this on your WordPress server:

```bash
# Check .htaccess
grep -i "Access-Control-Allow-Origin" /path/to/wordpress/.htaccess

# Check wp-config.php
grep -i "Access-Control-Allow-Origin" /path/to/wordpress/wp-config.php

# Check all PHP files
grep -r "Access-Control-Allow-Origin" /path/to/wordpress/wp-content/
```

**Expected:** Should find ONLY ONE location setting CORS headers

---

### **Step 2: Check Response Headers**

In browser DevTools:
1. Go to **Network** tab
2. Reload page
3. Click on failed request
4. Look at **Response Headers**
5. Check `Access-Control-Allow-Origin` header

**Good:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

**Bad (causes error):**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Origin: *
```

---

### **Step 3: Check Active Plugins**

WordPress Admin → Plugins → Installed Plugins

**Look for CORS-related plugins:**
- WP CORS
- CORS Headers
- Allow CORS
- etc.

**If multiple found:** Deactivate all except one

---

## 📋 **Quick Fix Checklist**

- [ ] **Remove duplicate CORS configurations**
  - [ ] Check `.htaccess` file
  - [ ] Check `wp-config.php`
  - [ ] Check active CORS plugins
  - [ ] Check custom plugin code

- [ ] **Choose ONE CORS method:**
  - [ ] Option 1: WP CORS plugin (easiest)
  - [ ] Option 2: .htaccess configuration
  - [ ] Option 3: wp-config.php function
  - [ ] Option 4: Custom plugin method

- [ ] **Configure allowed origins:**
  - [ ] `http://localhost:3000` (development)
  - [ ] `https://www.zanobiaonline.com` (production)

- [ ] **Test the fix:**
  - [ ] curl command shows correct headers
  - [ ] Browser console shows no CORS errors
  - [ ] React app loads products successfully

---

## 🎯 **Recommended Solution**

### **For Quick Fix (5 minutes):**

1. **Install WP CORS plugin**
2. **Add allowed origin:** `http://localhost:3000`
3. **Remove CORS from other locations**
4. **Test**

### **For Production (10 minutes):**

1. **Use .htaccess method** (Solution 2)
2. **Allow both development and production domains**
3. **Test thoroughly**
4. **Deploy**

---

## ⚠️ **Common Mistakes**

### **❌ Using Wildcard (*) in Production**
```apache
# DON'T DO THIS in production:
Header set Access-Control-Allow-Origin "*"
```

**Why:** Security risk - allows ANY website to access your API

### **✅ Use Specific Origins**
```apache
# DO THIS instead:
Header set Access-Control-Allow-Origin "http://localhost:3000"
```

---

### **❌ Multiple CORS Configurations**
```
.htaccess: Access-Control-Allow-Origin: *
wp-config.php: Access-Control-Allow-Origin: http://localhost:3000
Plugin: Access-Control-Allow-Origin: *
```

**Why:** Creates duplicate headers (your current issue)

### **✅ Single CORS Configuration**
```
Choose ONE location only
```

---

## 🚀 **After Fixing**

Once CORS is fixed, your React app should:
- ✅ Load products from WooCommerce
- ✅ Authenticate users
- ✅ Process orders
- ✅ Upload images
- ✅ Update profiles

**No more CORS errors!** 🎉

---

## 📞 **Need Help?**

If still having issues:

1. Check browser console for exact error
2. Check WordPress error logs
3. Test with curl command
4. Verify only ONE CORS source is active
5. Contact hosting support if needed

---

**Summary:** Your WordPress server is sending duplicate CORS headers. Choose ONE method above to fix it, and ensure NO other locations are setting CORS headers. This will resolve the error immediately!

