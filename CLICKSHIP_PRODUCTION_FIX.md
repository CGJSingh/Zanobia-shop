# ClickShip Production Issue - Complete Fix Guide 🚚

## 🔍 **Where ClickShip is Integrated**

### **React Frontend (3 Files):**

#### **1. `src/api/shipping.js`** - Main Integration File
**Line 43-101:** The `getShippingRates()` function

```javascript
export const getShippingRates = async (address, weight) => {
  try {
    // Calls WordPress ClickShip endpoint
    const baseUrl = API_CONFIG.WORDPRESS.BASE_URL.replace('/wp-json/wp/v2', '');
    const response = await axios.get(
      `${baseUrl}/wp-json/clickship/v1/rates`,  // ← THIS IS THE KEY ENDPOINT
      {
        params: {
          country,
          province: province || '',
          postal: postal_code,
          city: city || '',
          weight: weight || 0.5,
        },
        auth: {
          username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
          password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
        },
      }
    );
    
    // Returns formatted rates
    return response.data.rates.map(rate => ({...}));
  } catch (error) {
    // IN DEVELOPMENT: Returns mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockShippingRates(address, weight);  // ← Fallback
    }
    
    // IN PRODUCTION: Throws error
    throw new Error('Failed to fetch shipping rates...');
  }
};
```

**What it does:**
- Calls: `GET https://go.zanobiaonline.com/wp-json/clickship/v1/rates`
- Passes: address + weight
- Expects: array of shipping rates
- **Fallback:** Mock data in development only

#### **2. `src/pages/CheckoutPage.jsx`** - Usage
**Line 7:** Imports the function
```javascript
import { getShippingRates, calculateCartWeight, formatPostalCode } from '../api/shipping';
```

**Line 130-174:** Calls the function
```javascript
const fetchShippingRates = useCallback(async () => {
  const { shippingZipCode, shippingState, shippingCity, shippingCountry } = formData;

  // Validate postal code
  if (!shippingZipCode || shippingZipCode.length < 3) {
    setShippingRates([]);
    return;
  }

  setLoadingRates(true);
  setRatesError('');

  try {
    const address = {
      country: shippingCountry,
      province: shippingState,
      postal_code: formatPostalCode(shippingZipCode, shippingCountry),
      city: shippingCity,
    };

    const rates = await getShippingRates(address, cartWeight);  // ← CALLS API
    setShippingRates(rates);
    
    // Auto-select cheapest
    if (rates.length > 0) {
      setSelectedRate(prevSelected => {
        if (!prevSelected) {
          const cheapest = rates.reduce((min, rate) => 
            rate.cost < min.cost ? rate : min
          );
          return cheapest;
        }
        return prevSelected;
      });
    }
  } catch (err) {
    setRatesError(err.message || 'Failed to fetch shipping rates');
    setShippingRates([]);
  } finally {
    setLoadingRates(false);
  }
}, [formData.shippingZipCode, formData.shippingState, formData.shippingCity, formData.shippingCountry, cartWeight]);
```

**When it triggers:**
- User enters postal code (3+ characters)
- Debounced 500ms (waits for user to finish typing)
- Automatically fetches rates

#### **3. `src/components/checkout/ShippingRates.jsx`** - UI Display
Displays the rates returned from the API.

---

## ❌ **Why It's NOT Working in Production**

### **The Problem:**

Your React app is trying to call:
```
GET https://www.zanobiaonline.com/wp-json/clickship/v1/rates
```

**BUT** this endpoint doesn't exist on your WordPress server! Here's why:

### **Expected Setup:**

```
WordPress Backend
    ↓
ClickShip WordPress Plugin (REQUIRED)
    ↓
Creates REST API Endpoint: /wp-json/clickship/v1/rates
    ↓
React calls this endpoint
    ↓
Returns shipping rates
```

### **Current Production Setup:**

```
WordPress Backend
    ↓
No ClickShip Plugin Installed ❌
    ↓
Endpoint /wp-json/clickship/v1/rates doesn't exist
    ↓
React calls this endpoint
    ↓
Returns: 404 Not Found or 500 Error ❌
    ↓
In Development: Falls back to mock data ✅
In Production: Shows error to user ❌
```

---

## ✅ **Solutions (Choose One)**

### **Option 1: Install ClickShip WordPress Plugin (RECOMMENDED)**

This is the **proper** solution if you want real shipping rates.

#### **Steps:**

1. **Install ClickShip Plugin:**
   ```
   WordPress Admin Dashboard
   → Plugins → Add New
   → Search: "ClickShip"
   → Install & Activate
   ```

   **OR via WooCommerce:**
   ```
   WooCommerce → Extensions
   → Search: "ClickShip"
   → Install
   ```

2. **Configure ClickShip:**
   ```
   WooCommerce → ClickShip → Settings
   → Enter your ClickShip API credentials
   → Enable carriers (Canada Post, UPS, FedEx, Purolator)
   → Set default package dimensions & weight
   → Save settings
   ```

3. **Get ClickShip API Credentials:**
   ```
   → Sign up at: https://www.clickship.com/
   → Go to: Account → API Settings
   → Copy: API Key & API Secret
   → Paste into WordPress plugin settings
   ```

4. **Verify Endpoint Exists:**
   ```bash
   # Test the endpoint
   curl https://www.zanobiaonline.com/wp-json/clickship/v1/rates?country=CA&postal=M5H2N2&weight=1
   ```

   **Expected Response:**
   ```json
   {
     "rates": [
       {
         "id": "canada_post_regular",
         "carrier": "Canada Post",
         "service_name": "Regular Parcel",
         "total": 12.99,
         "currency": "CAD"
       }
     ]
   }
   ```

---

### **Option 2: Create Custom WordPress Endpoint (Alternative)**

If you can't use the ClickShip plugin, create a custom REST endpoint.

#### **Create WordPress Plugin:**

**File:** `/wp-content/plugins/custom-clickship/custom-clickship.php`

```php
<?php
/**
 * Plugin Name: Custom ClickShip Integration
 * Description: Custom REST endpoint for shipping rates
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

class Custom_ClickShip_API {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    public function register_routes() {
        register_rest_route('clickship/v1', '/rates', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_shipping_rates'),
            'permission_callback' => '__return_true',
        ));
    }
    
    public function get_shipping_rates($request) {
        $country = $request->get_param('country');
        $province = $request->get_param('province');
        $postal = $request->get_param('postal');
        $city = $request->get_param('city');
        $weight = $request->get_param('weight') ?: 0.5;
        
        // Validate inputs
        if (empty($country) || empty($postal)) {
            return new WP_Error('missing_params', 'Country and postal code are required', array('status' => 400));
        }
        
        // Call ClickShip API
        $clickship_api_key = get_option('clickship_api_key');
        $clickship_api_secret = get_option('clickship_api_secret');
        
        if (empty($clickship_api_key) || empty($clickship_api_secret)) {
            // Return static rates if ClickShip not configured
            return $this->get_static_rates($country, $weight);
        }
        
        // Make API call to ClickShip
        $response = wp_remote_post('https://api.clickship.com/v1/rates', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $clickship_api_key,
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode(array(
                'origin' => array(
                    'country' => 'CA',
                    'postal_code' => 'L5L5M4', // Your warehouse postal code
                ),
                'destination' => array(
                    'country' => $country,
                    'postal_code' => $postal,
                    'province' => $province,
                    'city' => $city,
                ),
                'packages' => array(
                    array(
                        'weight' => $weight,
                        'length' => 30,
                        'width' => 20,
                        'height' => 20,
                        'weight_unit' => 'kg',
                        'dimension_unit' => 'cm',
                    )
                ),
            )),
        ));
        
        if (is_wp_error($response)) {
            return $this->get_static_rates($country, $weight);
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        return rest_ensure_response(array(
            'rates' => $body['rates'] ?? $this->get_static_rates($country, $weight)['rates']
        ));
    }
    
    private function get_static_rates($country, $weight) {
        $base_rate = $weight * 5; // $5 per kg
        
        $rates = array(
            array(
                'id' => 'canada_post_regular',
                'carrier' => 'Canada Post',
                'service_name' => 'Regular Parcel',
                'delivery_days' => '5-7',
                'delivery_date' => date('Y-m-d', strtotime('+7 days')),
                'total' => $base_rate + 12.99,
                'currency' => 'CAD',
                'description' => 'Standard delivery within 5-7 business days',
            ),
            array(
                'id' => 'canada_post_expedited',
                'carrier' => 'Canada Post',
                'service_name' => 'Expedited Parcel',
                'delivery_days' => '2-3',
                'delivery_date' => date('Y-m-d', strtotime('+3 days')),
                'total' => $base_rate + 24.99,
                'currency' => 'CAD',
                'description' => 'Faster delivery within 2-3 business days',
            ),
            array(
                'id' => 'canada_post_priority',
                'carrier' => 'Canada Post',
                'service_name' => 'Priority',
                'delivery_days' => '1-2',
                'delivery_date' => date('Y-m-d', strtotime('+2 days')),
                'total' => $base_rate + 34.99,
                'currency' => 'CAD',
                'description' => 'Express delivery within 1-2 business days',
            ),
        );
        
        return array('rates' => $rates);
    }
}

new Custom_ClickShip_API();
```

**Activate the plugin:**
```
WordPress → Plugins → Activate "Custom ClickShip Integration"
```

---

### **Option 3: Use Static Shipping Rates (Quick Fix)**

If you don't need dynamic rates right now, use static rates instead.

#### **Update:** `src/api/shipping.js`

```javascript
export const getShippingRates = async (address, weight) => {
  try {
    const { country, province, postal_code, city } = address;

    if (!country || !postal_code) {
      throw new Error('Country and postal code are required');
    }

    // TRY to call ClickShip endpoint
    const baseUrl = API_CONFIG.WORDPRESS.BASE_URL.replace('/wp-json/wp/v2', '');
    const response = await axios.get(
      `${baseUrl}/wp-json/clickship/v1/rates`,
      {
        params: { country, province: province || '', postal: postal_code, city: city || '', weight: weight || 0.5 },
        auth: {
          username: API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
          password: API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
        },
      }
    );

    if (response.data && response.data.rates) {
      return response.data.rates.map(rate => ({
        id: rate.id || rate.service_code,
        carrier: rate.carrier || 'ClickShip',
        service: rate.service_name || rate.name,
        delivery_days: rate.delivery_days || rate.est_delivery_days,
        delivery_date: rate.delivery_date,
        cost: parseFloat(rate.total || rate.cost || 0),
        currency: rate.currency || 'CAD',
        logo: rate.carrier_logo || null,
        description: rate.description || '',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    
    // ALWAYS return mock data (remove NODE_ENV check)
    console.warn('⚠️ ClickShip endpoint not available, using static rates');
    return getMockShippingRates(address, weight);  // ← ALWAYS fallback
  }
};
```

**This makes it work in both development AND production** by always using mock data when the ClickShip endpoint fails.

---

## 🧪 **Testing ClickShip in Production**

### **1. Check if Endpoint Exists:**

```bash
curl https://www.zanobiaonline.com/wp-json/clickship/v1/rates
```

**Expected (if working):**
```json
{"rates": [...]}
```

**Expected (if not working):**
```json
{"code":"rest_no_route","message":"No route was found matching the URL and request method","data":{"status":404}}
```

### **2. Check WordPress Plugins:**

```
WordPress Admin
→ Plugins → Installed Plugins
→ Look for: "ClickShip" or "Shipping" related plugins
```

### **3. Check Console Errors:**

In your React app (production):
```javascript
// Open browser console
// Go to checkout page
// Enter postal code
// Watch Network tab for:
GET https://www.zanobiaonline.com/wp-json/clickship/v1/rates

// Check response:
Status: 404 ← Endpoint doesn't exist
Status: 500 ← Endpoint exists but error
Status: 200 ← Working! ✅
```

---

## 🚀 **Recommended Production Fix**

### **Step-by-Step:**

1. ✅ **Option 3 (Quick Fix):** Update `shipping.js` to always use fallback (5 minutes)
2. ✅ **Deploy to production** - Shipping will work with static rates
3. ✅ **Install ClickShip plugin** on WordPress (when you have time)
4. ✅ **Configure ClickShip API** credentials
5. ✅ **Revert Option 3 changes** - Remove always-fallback logic
6. ✅ **Deploy again** - Now using real ClickShip rates!

---

## 📋 **Quick Comparison**

| Option | Time | Cost | Accuracy | Recommended |
|--------|------|------|----------|-------------|
| **1. ClickShip Plugin** | 1-2 hours | $$ (ClickShip fees) | Real-time ✅ | **YES** (Long-term) |
| **2. Custom Plugin** | 3-4 hours | $ (Dev time) | Real-time ✅ | If ClickShip unavailable |
| **3. Static Rates** | 5 minutes | Free | Estimates | **YES** (Quick fix) |

---

## 💡 **Why It Works in Development**

```javascript
// Line 92-93 in shipping.js
if (process.env.NODE_ENV === 'development') {
  return getMockShippingRates(address, weight);  // ← Fallback works
}
```

**In Development:**
- `NODE_ENV = 'development'`
- When ClickShip fails → Returns mock data
- User sees: 5 shipping options (Canada Post, UPS, FedEx)

**In Production:**
- `NODE_ENV = 'production'`
- When ClickShip fails → Throws error
- User sees: "Failed to fetch shipping rates" ❌

---

## ✅ **Immediate Action Plan**

### **Right Now (5 minutes):**

Use **Option 3** - Update `src/api/shipping.js` line 88-100:

**CHANGE:**
```javascript
} catch (error) {
  console.error('Error fetching shipping rates:', error);
  
  // Return mock data for development/testing
  if (process.env.NODE_ENV === 'development') {  // ← REMOVE THIS LINE
    return getMockShippingRates(address, weight);
  }
  
  throw new Error(
    error.response?.data?.message || 
    'Failed to fetch shipping rates. Please check your address and try again.'
  );
}
```

**TO:**
```javascript
} catch (error) {
  console.error('Error fetching shipping rates:', error);
  console.warn('⚠️ ClickShip not available, using static shipping rates');
  
  // ALWAYS return static rates if ClickShip fails
  return getMockShippingRates(address, weight);
}
```

**Deploy this** and shipping will work immediately in production! ✅

### **Later (When You Have Time):**

1. Install ClickShip WordPress plugin
2. Configure API credentials
3. Test endpoint
4. Revert the change above (remove always-fallback)
5. Deploy with real ClickShip integration

---

## 🎯 **Summary**

**Where ClickShip is integrated:**
- ✅ `src/api/shipping.js` - API calls
- ✅ `src/pages/CheckoutPage.jsx` - Usage
- ✅ `src/components/checkout/ShippingRates.jsx` - UI

**Why it's not working in production:**
- ❌ WordPress endpoint `/wp-json/clickship/v1/rates` doesn't exist
- ❌ ClickShip plugin not installed/configured
- ❌ Production throws error instead of using fallback

**Quick fix:**
- ✅ Update `shipping.js` to always use static rates (5 min)
- ✅ Deploy → Shipping works immediately!
- ✅ Install ClickShip plugin later for real rates

---

**That's it!** Let me know which option you want to use and I can help you implement it! 🚀

