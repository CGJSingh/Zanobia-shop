# Address Autocomplete System - Complete Guide

## 📦 Overview

Your Zanobia e-commerce platform now has a **premium address autocomplete system** with live search, restricted to **Canada and United States only**. The system integrates seamlessly with your Edit Profile and Checkout pages, providing an elegant user experience with smart address management.

---

## 🎯 Key Features

### 1. **Live Address Search**
- Type at least 3 characters to get real-time suggestions
- Powered by **Nominatim OpenStreetMap API** (free, no API key required)
- Debounced search (500ms) for optimal performance
- Beautiful dropdown with address formatting

### 2. **Geolocation Support**
- **"Use My Current Location"** button (📍 icon)
- Automatically detects and fills user's address
- Validates that location is within Canada or US

### 3. **Country Restriction**
- **Canada** (🍁) and **United States** (🇺🇸) ONLY
- Invalid locations are rejected with clear error messages

### 4. **Smart Address Management**

#### Edit Profile Page (`/account/edit`)
- **Dual Address Sections:**
  - Current Address (Billing)
  - Mailing/Shipping Address
- **Toggle Switch:** "Mailing/shipping address is the same as current address"
  - When enabled: Shipping address auto-fills from current address
  - When disabled: Separate shipping address fields appear
- **Live Sync:** Changes to current address update shipping when toggle is ON

#### Checkout Page (`/checkout`)
- **Pre-filled User Data:** Automatically loads saved addresses for logged-in users
- **Billing & Shipping Sections** with same toggle logic
- **Dynamic Shipping Cost:** ClickShip rates update based on shipping address
- **Guest Checkout:** Available for non-logged-in users

---

## 🏗 Architecture

### File Structure
```
my-shop/
├── src/
│   ├── api/
│   │   ├── address.js              # Address autocomplete API
│   │   └── user.js                 # User profile & address management
│   ├── components/
│   │   └── AddressAutocomplete.jsx # Reusable autocomplete component
│   └── pages/
│       ├── EditProfilePage.jsx     # Dual address edit page
│       └── CheckoutPage.jsx        # Pre-filled checkout
└── wordpress-plugin/
    └── zanobia-business-accounts.php # WordPress backend
```

---

## 🔧 Components

### 1. `AddressAutocomplete.jsx`

**Props:**
- `value` (string) - Current address value
- `onChange` (function) - Called when user types
- `onAddressSelect` (function) - Called when address is selected
- `country` (string) - 'CA' or 'US'
- `placeholder` (string) - Input placeholder
- `label` (string) - Field label
- `required` (boolean) - Mark field as required
- `error` (string) - Error message
- `disabled` (boolean) - Disable input
- `showUseLocation` (boolean) - Show geolocation button

**Features:**
- Keyboard navigation (↑ ↓ Enter Escape)
- Debounced search
- Loading spinner
- Clear button
- Auto-focus on first suggestion
- Responsive dropdown

**Example:**
```jsx
<AddressAutocomplete
  value={formData.currentAddress}
  onChange={(val) => setFormData({ ...formData, currentAddress: val })}
  onAddressSelect={handleAddressSelect}
  country="CA"
  placeholder="Start typing your address..."
  label="Street Address"
  required={true}
  showUseLocation={true}
/>
```

---

### 2. `address.js` API

**Functions:**

#### `searchAddress(query, country)`
- Searches for addresses matching query
- Returns array of suggestions
- Rate limited to 1 req/second (Nominatim requirement)

#### `isValidCountry(country)`
- Validates country code ('CA' or 'US')

#### `formatAddressDisplay(address)`
- Formats address object for display
- Returns: "123 Main St, Toronto, ON, M5V 3A8, Canada"

#### `reverseGeocode(lat, lon)`
- Converts coordinates to address
- Used for geolocation

#### `getUserLocationAddress()`
- Prompts for location permission
- Returns formatted address
- Validates country restriction

**Address Object Structure:**
```javascript
{
  street: "Main Street",
  houseNumber: "123",
  city: "Toronto",
  state: "Ontario",
  postalCode: "M5V 3A8",
  country: "CA",
  suburb: "Downtown"
}
```

---

## 📝 Integration Examples

### Edit Profile Page Flow

1. **User loads `/account/edit`**
   - Fetches profile data via `getUserProfile()`
   - Fetches addresses via `getUserAddresses()`
   - Pre-fills both current and shipping addresses
   - Sets `sameAddress` toggle if addresses match

2. **User types in Current Address field**
   - AddressAutocomplete shows suggestions
   - User selects an address
   - `handleCurrentAddressSelect()` called
   - If toggle ON: shipping address auto-updates

3. **User clicks Save**
   - `updateUserProfile()` sends both addresses to WordPress
   - WordPress plugin saves to `billing_*` and `shipping_*` meta fields

### Checkout Page Flow

1. **User visits `/checkout`**
   - If authenticated: Pre-fills from saved addresses
   - If guest: Empty fields ready for input
   - `sameAddress` toggle defaults to TRUE

2. **User enters Billing Address**
   - AddressAutocomplete provides suggestions
   - Address auto-populates city, state, postal code, country
   - If toggle ON: Shipping address mirrors billing

3. **Shipping Cost Calculation**
   - When postal code entered (≥3 chars)
   - Debounced call to ClickShip API (500ms)
   - Displays shipping options
   - Updates order total

4. **Order Submission**
   - Validates all required fields
   - Sends both billing and shipping addresses to WooCommerce
   - Creates order with Clover payment

---

## 🔐 WordPress Backend

### Updated `update_user_profile` Function

Now handles BOTH old and new field names for backward compatibility:

**Old Fields (still supported):**
- `address`, `city`, `province`, `postalCode`

**New Fields (preferred):**
- `currentAddress`, `currentCity`, `currentProvince`, `currentPostalCode`, `currentCountry`
- `shippingAddress`, `shippingCity`, `shippingProvince`, `shippingPostalCode`, `shippingCountry`

**WooCommerce Meta Keys:**
- `billing_address_1`, `billing_city`, `billing_state`, `billing_postcode`, `billing_country`
- `shipping_address_1`, `shipping_city`, `shipping_state`, `shipping_postcode`, `shipping_country`

---

## 🧪 Testing Checklist

### Edit Profile Page
- [ ] Load page - addresses pre-fill correctly
- [ ] Type address - suggestions appear
- [ ] Select suggestion - all fields populate
- [ ] Use geolocation button - detects location
- [ ] Toggle "Same address" ON - shipping mirrors current
- [ ] Toggle OFF - shipping fields appear
- [ ] Change current address with toggle ON - shipping updates
- [ ] Save - both addresses saved to WordPress
- [ ] Reload page - addresses persist

### Checkout Page
- [ ] **Logged in:** Addresses pre-fill
- [ ] **Guest:** Fields empty, ready for input
- [ ] Type billing address - autocomplete works
- [ ] Toggle "Same as billing" - shipping updates
- [ ] Enter postal code - shipping rates appear
- [ ] Select shipping method - total updates
- [ ] Submit order - both addresses in WooCommerce order

### Address Autocomplete Component
- [ ] Type <3 characters - no search
- [ ] Type ≥3 characters - suggestions appear
- [ ] Use keyboard (↑↓) - highlight changes
- [ ] Press Enter - selects highlighted
- [ ] Press Escape - closes dropdown
- [ ] Click outside - closes dropdown
- [ ] Use location button - fills from GPS
- [ ] Try location outside CA/US - shows error
- [ ] Clear button - empties field

---

## 🚀 Deployment Checklist

### Frontend (React)
- [x] `src/api/address.js` deployed
- [x] `src/components/AddressAutocomplete.jsx` deployed
- [x] `src/pages/EditProfilePage.jsx` updated
- [x] `src/pages/CheckoutPage.jsx` updated
- [x] No hardcoded API keys (Nominatim is free!)

### Backend (WordPress)
- [ ] Upload updated `zanobia-business-accounts.php` to `/wp-content/plugins/zanobia-business-accounts/`
- [ ] Activate plugin in WP Admin
- [ ] Test `/wp-json/zanobia/v1/update-profile` endpoint
- [ ] Test `/wp-json/zanobia/v1/user-addresses` endpoint

---

## 📊 API Usage

### Nominatim OpenStreetMap
- **Endpoint:** `https://nominatim.openstreetmap.org`
- **Rate Limit:** 1 request per second (enforced in code)
- **No API Key Required**
- **User-Agent:** `Zanobia-Ecommerce/1.0` (required by Nominatim)

**Important:** Nominatim is a **free, community-run service**. Be respectful:
- Our code already implements 1 req/sec rate limiting
- Debouncing prevents excessive requests
- Consider self-hosting Nominatim if traffic grows significantly

---

## 🎨 UI/UX Highlights

### Visual Design
- **Minimalist** - Clean, modern Tailwind CSS
- **Glassmorphism** - Frosted glass effects on Edit Profile
- **Neumorphic Toggles** - Smooth, animated switches
- **Framer Motion** - Elegant transitions and animations
- **Dark Mode** - Full support across all components

### User Experience
- **Smart Pre-filling** - Saves time for returning users
- **Live Validation** - Instant feedback
- **Error Messages** - Clear, actionable guidance
- **Loading States** - Skeletons and spinners
- **Auto-scroll** - Errors visible immediately
- **Keyboard Support** - Full navigation without mouse

---

## 🔧 Customization

### Change Allowed Countries
Edit `src/api/address.js`:
```javascript
export const isValidCountry = (country) => {
  const allowedCountries = ['CA', 'US', 'UK']; // Add more!
  return allowedCountries.includes(country?.toUpperCase());
};
```

### Adjust Debounce Timing
Edit `AddressAutocomplete.jsx`:
```javascript
searchTimeoutRef.current = setTimeout(async () => {
  // ...
}, 500); // Change from 500ms to your preference
```

### Custom Styling
All components use Tailwind CSS. Modify classes directly in JSX.

---

## 🐛 Troubleshooting

### Address suggestions not appearing
- Check console for CORS errors
- Verify internet connection
- Ensure query ≥3 characters
- Check Nominatim API status

### Geolocation not working
- User must grant location permission
- HTTPS required (localhost exempt)
- Check browser compatibility

### Addresses not saving
- Verify JWT token in localStorage
- Check WordPress endpoints in Network tab
- Ensure plugin is activated
- Check WordPress `debug.log`

### Shipping rates not updating
- Verify postal code is valid format
- Check ClickShip API configuration
- Ensure WooCommerce is connected

---

## 📚 Additional Resources

- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [OpenStreetMap Data](https://www.openstreetmap.org/)
- [WordPress User Meta](https://developer.wordpress.org/reference/functions/update_user_meta/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

---

## 🎉 Success!

Your Zanobia platform now has a **production-ready** address autocomplete system! Users will love the seamless experience, and you'll benefit from accurate, validated addresses for shipping and billing.

**Happy Coding!** 🚀


