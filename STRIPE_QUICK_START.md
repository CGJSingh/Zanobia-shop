# 🚀 Stripe Checkout - Quick Start

## ⚡ Get Started in 5 Minutes!

### **Step 1: Get Stripe Test Key** (2 min)

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up (free, no credit card needed)
3. Dashboard → [API Keys](https://dashboard.stripe.com/test/apikeys)
4. Copy **Publishable key** (starts with `pk_test_`)

### **Step 2: Add to Environment** (1 min)

Create/update `d:\Zanobia\website\my-shop\.env.local`:

```bash
# Add this line (replace with your actual key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QW...YOUR_KEY_HERE
```

### **Step 3: Test It!** (2 min)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Add items to cart:**
   - Browse products
   - Add 2-3 items
   - Click "Proceed to Checkout"

3. **Fill shipping info:**
   - Enter email, phone, address
   - Select shipping method

4. **Pay with test card:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```

5. **Click "Pay $XX.XX"**
   - ✅ Should redirect to success page!

---

## 🎯 What You Get

### **✨ Features:**
- 💳 Credit/Debit Cards
-  Apple Pay (Safari only)
- 🅖 Google Pay (Chrome/Android)
- 🌗 Full Dark Mode
- 📱 Mobile Responsive
- 🔒 Secure & PCI Compliant

### **🎨 Premium UI:**
- Elegant, minimalist design
- Smooth animations
- Real-time validation
- Clear error messages
- Loading states

---

## 🧪 Test Cards

### **✅ Success:**
```
4242 4242 4242 4242  → Payment succeeds
```

### **❌ Decline:**
```
4000 0000 0000 0002  → Card declined
```

### **⚠️ Auth Required:**
```
4000 0027 6000 3184  → Requires 3D Secure
```

**Expiry:** Any future date (e.g., 12/34)  
**CVC:** Any 3 digits (e.g., 123)  
**ZIP:** Any 5 digits (e.g., 12345)

[More test cards →](https://stripe.com/docs/testing)

---

## 🎨 Test Mode Banner

**You'll see:**
```
┌─────────────────────────────────────┐
│ ⚠️ Test Mode Active                │
│ Use test card: 4242 4242 4242 4242 │
└─────────────────────────────────────┘
```

This appears automatically when using `pk_test_` keys!

---

## 🔄 Payment Flow

```
1. Fill shipping info
   ↓
2. Enter test card
   ↓
3. Click "Pay"
   ↓
4. ✅ Order success!
```

---

## 📱 Apple Pay / Google Pay

### **To Test Apple Pay:**
- Use Safari on Mac/iPhone/iPad
- Works on `localhost` (test mode)
- Shows button above card form

### **To Test Google Pay:**
- Use Chrome browser
- Android device or desktop
- Shows button above card form

**Note:** May not show if device/browser doesn't support it.

---

## 🐛 Quick Troubleshooting

### **"Stripe not loading"**
```bash
# Check .env.local exists and has key
cat .env.local | grep STRIPE

# Should show:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **"Payment failed"**
```
✅ Use correct test card: 4242 4242 4242 4242
✅ Check test mode is enabled in Stripe
✅ Verify key starts with pk_test_
```

### **"Apple Pay not showing"**
```
✅ Use Safari browser
✅ Use Apple device (Mac/iPhone/iPad)
✅ Make sure on localhost or HTTPS
```

---

## 🎯 Where to Find Things

### **Files Changed:**
```
src/
├── config/stripe.js              # Stripe config
├── api/stripe.js                 # Payment API
├── components/payment/
│   └── StripePaymentForm.jsx     # Payment form
└── pages/CheckoutPage.jsx        # Updated checkout
```

### **Environment:**
```
.env.local                        # Your Stripe key
env.example                       # Template (updated)
```

---

## 📚 Full Documentation

For detailed setup, customization, and production:
📖 **[See STRIPE_INTEGRATION_GUIDE.md](./STRIPE_INTEGRATION_GUIDE.md)**

---

## ✅ Checklist

**Before Testing:**
- [ ] Stripe account created
- [ ] Test key copied
- [ ] Added to `.env.local`
- [ ] Dev server running

**Test Flow:**
- [ ] Add items to cart
- [ ] Fill shipping info
- [ ] Enter test card (4242...)
- [ ] Payment succeeds
- [ ] Redirects to success page

---

## 🎉 That's It!

**You're ready to test Stripe payments!**

### **Next Steps:**
1. ✅ Test with test cards
2. 📊 Check Stripe Dashboard → Payments
3. 🎨 Customize colors (see full guide)
4. 🚀 Go live (when ready)

---

**Questions?**
- [Stripe Docs](https://stripe.com/docs)
- [Full Integration Guide](./STRIPE_INTEGRATION_GUIDE.md)
- [Stripe Support](https://stripe.com/support)

**Happy Testing!** 🎊

