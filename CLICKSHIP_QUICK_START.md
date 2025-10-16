# 🚀 ClickShip Quick Start Guide

## ⚡ Test Your ClickShip Integration

Follow these steps to test the new shipping integration!

---

## 📋 Prerequisites

✅ **Before testing:**
- [ ] ClickShip plugin installed in WordPress
- [ ] WooCommerce Consumer Key & Secret in `.env.local`
- [ ] At least one product in cart
- [ ] Dev server running (`npm run dev`)

---

## 🧪 Testing Steps

### **1. Start Dev Server**

```bash
cd d:\Zanobia\website\my-shop
npm run dev
```

Open: `http://localhost:3000/checkout`

---

### **2. Fill Shipping Address**

**Test with Canadian Address:**
```
Name: John Doe
Email: john@example.com
Phone: +1 416-555-0100
Address: 123 King Street
City: Toronto
Province: Ontario (or ON)
Postal Code: M5V 3A8    ← Enter this!
Country: Canada
```

**What should happen:**
- After typing postal code (3+ chars)
- Wait 500ms (debounce)
- Loading spinner appears
- Shipping rates display

---

### **3. Verify Shipping Rates**

**Expected UI:**

```
🚚 Shipping Options        ⟳ Loading rates...

┌─────────────────────────────────────────┐
│ ● Canada Post - Regular Parcel          │
│   Delivery in 5-7 business days         │
│                                  $17.99  │
│   ✓ Selected shipping method            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ○ Canada Post - Expedited Parcel        │
│   Delivery in 2-3 business days         │
│                                  $29.99  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ○ UPS Ground                            │
│   Delivery in 3-5 business days         │
│                                  $23.99  │
└─────────────────────────────────────────┘

Package weight: 1.50 kg
```

**Check:**
- [ ] Multiple carrier options visible
- [ ] Cheapest option auto-selected
- [ ] Prices displayed correctly
- [ ] Delivery estimates shown
- [ ] Smooth animations

---

### **4. Test Rate Selection**

**Click different options:**
1. Click "Canada Post Expedited" → Border turns indigo
2. Check order summary → Shipping price updates
3. Total animates with spring effect
4. "✓ Shipping method updated" toast appears

**Order Summary:**
```
Subtotal:        $50.00
Shipping:        $29.99
                 Canada Post - Expedited
Tax (8%):        $6.40
────────────────────────
Total:           $86.39  ← Animated!
```

---

### **5. Test Different Postal Codes**

**Try these:**

**Toronto:**
```
Postal: M5V 3A8
Result: 5 carrier options
```

**Vancouver:**
```
Postal: V6B 1A1
Result: Different rates (farther)
```

**Montreal:**
```
Postal: H3B 1A1
Result: Quebec rates
```

**US (New York):**
```
Country: United States
ZIP: 10001
Result: Cross-border rates
```

---

### **6. Test Edge Cases**

#### **A. Empty Postal Code:**
```
Leave postal code blank
Result: "Enter your postal code to see available shipping options"
```

#### **B. Invalid Postal Code:**
```
Postal: 123456
Result: No rates or error message
```

#### **C. Very Heavy Cart:**
```
Add many products (total weight > 10kg)
Result: Higher shipping prices
```

#### **D. API Failure (Mock Mode):**
```
If API fails → Mock rates appear
Console shows: "🚀 Using mock shipping rates for development"
```

---

## 🎯 Success Checklist

After testing, verify:

- [ ] Rates load within 1-2 seconds
- [ ] Skeleton loader shows while loading
- [ ] Cheapest option auto-selected
- [ ] Can select different options
- [ ] Order summary updates instantly
- [ ] Total animates smoothly
- [ ] Package weight displays
- [ ] Works on mobile (responsive)
- [ ] Dark mode looks good
- [ ] Error messages are helpful

---

## 📱 Mobile Testing

**Responsive Breakpoints:**

**Desktop (1024px+):**
```
┌─────────────────────────────────────────────────┐
│  Shipping Address  │  Shipping Options          │
│  [Form Fields]     │  [Rate Cards]              │
│                    │                            │
│                    │  Order Summary (sticky)    │
└─────────────────────────────────────────────────┘
```

**Tablet (768px):**
```
┌────────────────────────┐
│  Shipping Address      │
│  [Form Fields]         │
├────────────────────────┤
│  Shipping Options      │
│  [Rate Cards]          │
├────────────────────────┤
│  Order Summary         │
└────────────────────────┘
```

**Mobile (< 640px):**
```
┌──────────────┐
│ Address      │
│ [Fields]     │
├──────────────┤
│ Shipping     │
│ [Rates]      │
├──────────────┤
│ Summary      │
└──────────────┘
```

---

## 🌗 Dark Mode Testing

**Toggle theme:**
1. Click moon/sun icon in header
2. All shipping UI should adapt:
   - Cards: `bg-gray-800`
   - Text: `text-white`
   - Borders: `border-gray-700`
   - Selected: `bg-indigo-900/20`

---

## 🔍 Console Checks

**Open DevTools (F12) → Console**

**Successful load:**
```
✅ Rates fetched successfully
✅ 5 shipping options available
✅ Auto-selected: Canada Post Regular Parcel
```

**Development mode:**
```
🚀 Using mock shipping rates for development
```

**Errors (expected if API not configured):**
```
⚠️ Error fetching shipping rates: Network Error
ℹ️ Fallback to mock data
```

---

## 🔧 Backend Configuration

### **If Rates Don't Load:**

**Step 1: Verify ClickShip Plugin**
```
WordPress Admin → Plugins → ClickShip → Settings
✓ API Key entered
✓ Carriers enabled
✓ Plugin active
```

**Step 2: Test API Endpoint**
```bash
curl https://your-site.com/wp-json/clickship/v1/rates?country=CA&postal=M5V3A8&weight=2.0
```

**Expected Response:**
```json
{
  "rates": [
    {
      "carrier": "Canada Post",
      "service_name": "Regular Parcel",
      "total": 17.99,
      ...
    }
  ]
}
```

**Step 3: Check WooCommerce Auth**
```javascript
// In .env.local
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
```

---

## 📊 Performance Testing

### **Rate Fetch Speed:**
```
Postal code entered
   ↓ (500ms debounce)
API call sent
   ↓ (200-800ms API)
Rates displayed
   ↓ (100ms animation)
Total: ~1 second
```

**Optimal:**
- Debounce: 500ms
- API response: < 1s
- Animation: 100ms
- **Total UX:** < 2s

---

## 🎨 Visual Testing

### **Animation Checklist:**

**Rate Cards:**
- [ ] Fade in from bottom
- [ ] Stagger effect (50ms delay each)
- [ ] Hover scale (1.01)
- [ ] Tap scale (0.99)

**Selection:**
- [ ] Radio fills smoothly
- [ ] Border color transition
- [ ] Background color fade
- [ ] Checkmark icon appears

**Total Update:**
- [ ] Spring animation
- [ ] Scale from 1.1 to 1
- [ ] Opacity fade in
- [ ] Smooth transition

---

## 🐛 Common Issues & Fixes

### **Issue 1: No rates appearing**

**Symptoms:**
- Empty shipping section
- "Enter postal code" message persists

**Fixes:**
```javascript
// 1. Check postal code format
M5V 3A8  ✓ (with space)
M5V3A8   ✓ (without space)
m5v 3a8  ✓ (lowercase, auto-formatted)

// 2. Check minimum length
M5V      ✓ (3 characters minimum)
M5       ✗ (too short)

// 3. Manually trigger
fetchShippingRates(); // In console
```

---

### **Issue 2: Rates not updating**

**Symptoms:**
- Same rates for all postal codes
- Stale data

**Fixes:**
```javascript
// 1. Clear selected rate
setSelectedRate(null);

// 2. Force refresh
setShippingRates([]);
fetchShippingRates();

// 3. Check debounce
// Wait at least 500ms after typing
```

---

### **Issue 3: Wrong total**

**Symptoms:**
- Total doesn't include shipping
- Shipping cost = $0.00

**Fixes:**
```javascript
// 1. Verify selectedRate
console.log(selectedRate); // Should have .cost

// 2. Check calculation
console.log({
  subtotal: totalPrice,
  shipping: shippingCost,
  tax: taxAmount,
  total: finalTotal
});

// 3. Ensure rate selected
// Should auto-select cheapest on load
```

---

## 📸 Expected Screenshots

### **Initial State:**
![Checkout with no rates](https://via.placeholder.com/800x400?text=Enter+Postal+Code)

### **Loading State:**
![Skeleton loader](https://via.placeholder.com/800x400?text=Loading+Rates...)

### **Rates Displayed:**
![5 carrier options](https://via.placeholder.com/800x400?text=Shipping+Options)

### **Rate Selected:**
![Selected with checkmark](https://via.placeholder.com/800x400?text=Canada+Post+Selected)

### **Order Summary:**
![Updated total](https://via.placeholder.com/800x400?text=Total+Updated)

---

## ✅ Final Verification

**Before going live:**

1. **Test Real API:**
   - [ ] ClickShip returns actual rates
   - [ ] Not using mock data
   - [ ] Carriers match your account

2. **Test Checkout Flow:**
   - [ ] Select shipping → Proceed to payment
   - [ ] Complete Stripe payment
   - [ ] Verify order in WooCommerce
   - [ ] Check shipping data saved

3. **Verify Order Data:**
   ```
   WooCommerce Admin → Orders → [Order #123]
   
   Shipping:
   ✓ Method: ClickShip - Canada Post Expedited
   ✓ Cost: $29.99
   ✓ Meta data: carrier, service, delivery_days
   ```

4. **Test Edge Cases:**
   - [ ] International shipping
   - [ ] Very heavy packages
   - [ ] Rural addresses
   - [ ] API timeout/error

---

## 🎉 Success!

**Your ClickShip integration is working if:**

✅ Rates load automatically on postal code entry  
✅ Multiple carrier options displayed  
✅ Cheapest auto-selected  
✅ Total updates with animation  
✅ Selection changes update summary  
✅ Order includes ClickShip data  
✅ Smooth, elegant UI/UX  
✅ Works on mobile  
✅ Dark mode supported  

---

## 📞 Need Help?

**If something isn't working:**

1. **Check console for errors** (F12)
2. **Verify `.env.local` has WooCommerce keys**
3. **Test API endpoint directly** (curl/Postman)
4. **Review `CLICKSHIP_INTEGRATION_GUIDE.md`**
5. **Check ClickShip plugin settings**

**Debug mode:**
```javascript
// Add to CheckoutPage.jsx
console.log('Shipping State:', {
  rates: shippingRates,
  selected: selectedRate,
  loading: loadingRates,
  error: ratesError,
  weight: cartWeight,
  address: formData
});
```

---

**Happy Testing!** 🚀📦

Your checkout now has professional, real-time shipping rates!

