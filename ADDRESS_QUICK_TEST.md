# Address Autocomplete - Quick Test Guide

## ⚡ Quick Start Testing (5 Minutes)

### 1. Edit Profile Page Test
```bash
# Navigate to:
http://localhost:3000/account/edit
```

**Test Steps:**
1. ✅ Login with your account
2. ✅ Click on "Edit Profile" from Account page
3. ✅ Type "123 Main" in Current Address field
4. ✅ See dropdown suggestions appear
5. ✅ Select an address - watch fields auto-populate
6. ✅ Toggle "Same as current address" ON
7. ✅ Type new address - shipping mirrors it
8. ✅ Toggle OFF - shipping fields become independent
9. ✅ Click Save - wait for success message
10. ✅ Reload page - verify addresses persist

**Expected Result:**
- ✨ Addresses save successfully
- ✨ Pre-fill works on reload
- ✨ Toggle syncs addresses instantly

---

### 2. Checkout Page Test
```bash
# Navigate to:
http://localhost:3000/checkout
```

**Test Steps (Logged In):**
1. ✅ Add items to cart
2. ✅ Go to checkout
3. ✅ See name, email, addresses pre-filled
4. ✅ Toggle "Same as billing" to test shipping sync
5. ✅ Enter postal code
6. ✅ Wait for shipping rates to load
7. ✅ Select shipping method
8. ✅ See total update
9. ✅ Click "Pay with Clover"

**Test Steps (Guest):**
1. ✅ Logout
2. ✅ Add items to cart
3. ✅ Go to checkout
4. ✅ Fields should be empty
5. ✅ Type address in billing section
6. ✅ Select from autocomplete
7. ✅ Toggle "Same as billing" ON
8. ✅ Enter postal code
9. ✅ Continue checkout

**Expected Result:**
- ✨ Logged-in users see saved data
- ✨ Guests get clean forms
- ✨ Shipping cost updates dynamically
- ✨ Toggle works for both user types

---

### 3. Address Autocomplete Component Test

**Test Keyboard Navigation:**
1. ✅ Type "456 King" in any address field
2. ✅ Press ↓ arrow - highlight moves down
3. ✅ Press ↑ arrow - highlight moves up
4. ✅ Press Enter - selects highlighted address
5. ✅ Press Escape - closes dropdown

**Test Geolocation:**
1. ✅ Click 📍 (Navigation) icon
2. ✅ Allow location permission
3. ✅ Wait for address to populate
4. ✅ Verify all fields filled correctly

**Test Clear:**
1. ✅ Type any address
2. ✅ Click X (clear) button
3. ✅ Field should empty

**Expected Result:**
- ✨ All interactions smooth and responsive
- ✨ No console errors
- ✨ Dropdown closes properly

---

### 4. Country Restriction Test

**Test Invalid Location:**
1. ✅ Try typing a UK address (e.g., "10 Downing Street London")
2. ✅ Or use geolocation in a country other than CA/US

**Expected Result:**
- ✨ Error message: "Your location is outside our service area (Canada & US only)"
- ✨ No addresses from unauthorized countries

---

## 🎯 Test Scenarios

### Scenario 1: New User Signup → Edit Profile → Checkout
```
1. Register new account
2. Go to Edit Profile
3. Fill in both addresses (different)
4. Save
5. Go to Checkout
6. Verify both addresses pre-filled correctly
7. Complete order
```

### Scenario 2: Existing User Changes Address
```
1. Login
2. Go to Edit Profile
3. Change shipping address
4. Save
5. Go to Checkout
6. Verify new shipping address appears
7. Order uses correct shipping address
```

### Scenario 3: Guest Checkout
```
1. Logout
2. Add to cart
3. Checkout
4. Use autocomplete for billing
5. Toggle "Same as billing" ON
6. Complete order
7. Verify order has correct addresses
```

---

## 🐛 Common Issues & Fixes

### Issue: Suggestions not showing
**Fix:** 
- Type at least 3 characters
- Check internet connection
- Clear browser cache

### Issue: Geolocation not working
**Fix:**
- Use HTTPS (or localhost)
- Grant location permission
- Check browser settings

### Issue: Addresses not saving
**Fix:**
- Verify you're logged in
- Check Network tab for API errors
- Ensure WordPress plugin is active

### Issue: Shipping rates not loading
**Fix:**
- Enter valid postal code
- Wait for debounce (500ms)
- Check ClickShip API configuration

---

## ✅ Quick Checklist

**Before Testing:**
- [ ] Dev server running (`npm run dev`)
- [ ] WordPress plugin activated
- [ ] Test user account ready
- [ ] Cart has some items

**After Testing:**
- [ ] No console errors
- [ ] All address fields work
- [ ] Toggles function correctly
- [ ] Data persists after reload
- [ ] Checkout completes successfully

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify WordPress REST API endpoints are accessible
3. Ensure JWT token is valid
4. Review `ADDRESS_AUTOCOMPLETE_GUIDE.md` for detailed docs

---

**Happy Testing!** 🎉


