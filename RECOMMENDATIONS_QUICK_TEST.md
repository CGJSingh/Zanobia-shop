# Product Recommendations - Quick Test Guide

## ⚡ 5-Minute Test Plan

### 1. Cart Page - Empty State ✅

```bash
# Navigate to:
http://localhost:3000/cart
```

**Expected Behavior:**
1. See "Your cart is empty" message
2. Scroll down to see "You May Also Like" carousel
3. Carousel shows popular products (up to 12)
4. Each card has:
   - Product image (clickable)
   - Product name (clickable, 2 lines max)
   - Price in green
   - "Add to Cart" button with cart icon
5. Loading skeletons appear first (6 pulsing cards)
6. Smooth horizontal scroll

**Test Actions:**
- ✅ Click product image → Navigate to product detail
- ✅ Click product name → Navigate to product detail
- ✅ Click "Add to Cart" → Product added to cart
- ✅ **Verify**: Carousel **disappears** after adding item

---

### 2. Cart Page - With Items ✅

```bash
# Add items to cart first, then visit:
http://localhost:3000/cart
```

**Expected Behavior:**
1. See cart items listed
2. **NO recommendations carousel visible**
3. Only cart summary and checkout button

**Test Actions:**
- ✅ Remove all items → Carousel **reappears**
- ✅ Add items again → Carousel **disappears**

---

### 3. Product Detail Page ✅

```bash
# Navigate to any product:
http://localhost:3000/product/{any-product-slug}
```

**Expected Behavior:**
1. Product details load at top
2. Scroll to bottom
3. See "Similar Products" carousel
4. Carousel shows products from **same category**
5. **Current product NOT included** in carousel
6. Carousel **always visible** (even with full cart)

**Test Actions:**
- ✅ Empty cart → Carousel still visible
- ✅ Full cart → Carousel still visible
- ✅ Navigate to different product → Carousel updates
- ✅ Click "Add to Cart" on similar product → Added to cart
- ✅ Click product → Navigate to that product detail

---

### 4. Responsive Design Test 📱

**Mobile (< 768px):**
```bash
# Resize browser to 375px width or use mobile device
```
- ✅ Cards are 200px wide
- ✅ Smooth horizontal scroll
- ✅ No scroll hint arrow (hidden on mobile)
- ✅ Touch-friendly buttons

**Desktop (> 768px):**
- ✅ Cards are 240px wide
- ✅ Scroll hint arrow visible (if >4 products)
- ✅ Hover effects work smoothly
- ✅ Scale animation on card hover

---

### 5. Loading States Test ⏳

**Clear Browser Cache:**
```bash
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

**Expected Behavior:**
1. See 6 skeleton cards pulsing
2. Each skeleton has:
   - Gray image placeholder
   - Gray text lines
   - Gray button placeholder
3. Smooth transition to real products
4. Stagger animation (products appear one by one)

---

### 6. Dark Mode Test 🌙

**Enable Dark Mode:**
```bash
# Click theme toggle in header
```

**Expected Behavior:**
- ✅ Carousel background adapts to dark
- ✅ Product cards have dark background
- ✅ Text is white/light gray
- ✅ Borders are dark gray
- ✅ Skeleton loaders are dark themed
- ✅ Buttons remain green (consistent branding)
- ✅ Scroll hint arrow is dark themed

**Toggle Back to Light:**
- ✅ Everything reverts smoothly
- ✅ No visual glitches

---

### 7. Error Handling Test 🔧

**Simulate Network Error:**
```bash
# Open DevTools → Network tab → Set to "Offline"
```

**Expected Behavior:**
1. Console shows error message
2. Component returns `null` (hidden)
3. No broken UI
4. Page still functional

**Restore Network:**
```bash
# Set to "Online" → Refresh page
```
- ✅ Carousel loads successfully

---

## 🎯 Quick Verification Checklist

### Cart Page Empty
- [ ] Carousel only shows when cart is empty
- [ ] "You May Also Like" title
- [ ] 12 products (or less if fewer in store)
- [ ] Add to Cart works
- [ ] Carousel disappears when item added

### Cart Page Full
- [ ] Carousel NOT visible
- [ ] Only cart items and summary

### Product Detail
- [ ] Carousel always visible
- [ ] "Similar Products" title
- [ ] 8 products from same category
- [ ] Current product excluded
- [ ] Works with empty or full cart

### UI/UX
- [ ] Loading skeletons appear first
- [ ] Smooth animations
- [ ] Hover effects work
- [ ] Responsive on mobile and desktop
- [ ] Dark mode works correctly
- [ ] All links navigate properly

---

## 🚨 Common Issues & Fixes

### Issue: Carousel not appearing on empty cart
**Fix:**
1. Check browser console for errors
2. Verify WooCommerce has published products
3. Ensure `.env.local` has correct API credentials
4. Hard refresh: `Ctrl+Shift+R`

### Issue: Same products everywhere
**Fix:**
1. Ensure products have categories assigned
2. Check `currentProduct` is passed correctly
3. Verify products are in `publish` status

### Issue: Add to Cart button not working
**Fix:**
1. Open console, check for errors
2. Verify CartContext is imported
3. Test manually adding to cart from product page

### Issue: Loading forever
**Fix:**
1. Check Network tab for API response
2. Verify WooCommerce REST API is accessible
3. Check CORS settings if hosted remotely
4. Ensure products endpoint returns data

---

## 📊 Expected Data Flow

### Cart Empty → Add Product
```
1. Empty cart page loads
2. SimilarProducts fetches popular products
3. User clicks "Add to Cart"
4. Product added to CartContext
5. Cart re-renders with items
6. Carousel disappears ✅
```

### Cart Full → Remove All
```
1. Cart page with items
2. User clicks "Clear Cart"
3. CartContext empties
4. Cart re-renders
5. Carousel appears ✅
```

### Product Detail
```
1. Product page loads
2. SimilarProducts fetches category products
3. Filters out current product
4. Displays carousel
5. Always visible (no conditions) ✅
```

---

## ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ **Cart page**: Carousel ONLY when empty
2. ✅ **Product detail**: Carousel ALWAYS visible
3. ✅ **Add to Cart**: Works from carousel
4. ✅ **Loading**: Skeletons before products
5. ✅ **Responsive**: Works on all screen sizes
6. ✅ **Dark mode**: Fully supported
7. ✅ **Navigation**: All clicks navigate correctly
8. ✅ **Performance**: Smooth scrolling and animations

---

## 🎉 All Tests Passing?

**Congratulations!** Your product recommendation system is production-ready! 🚀

**Next Steps:**
1. Monitor user engagement
2. Track add-to-cart rate from carousel
3. A/B test different titles
4. Consider personalization in future

**Questions?** Review `PRODUCT_RECOMMENDATIONS_GUIDE.md` for detailed docs.

---

**Happy Testing!** 🧪✨


