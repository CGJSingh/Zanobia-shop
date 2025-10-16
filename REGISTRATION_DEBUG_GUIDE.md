# 🐛 Registration Issue - Debug Guide

## 🔍 Current Issue

**Error:** 400 Bad Request when registering  
**Message:** "First name is required" (or similar field error)

---

## ✅ **What I Fixed:**

### **1. Field Name Mismatch:**
Changed from `snake_case` to `camelCase` to match WordPress plugin

### **2. Enhanced Error Logging:**
Added detailed console logging to show exact error from WordPress

---

## 🧪 **Test Registration Again:**

### **Steps:**

1. **Open browser console** (F12 → Console tab)

2. **Clear console** (trash icon or Ctrl+L)

3. **Go to signup:**
   ```
   http://localhost:3000/signup
   ```

4. **Fill form completely:**
   ```
   First Name: Test
   Last Name: User
   Email: newtest@example.com (use NEW email each time)
   Mobile Phone: 1234567890
   Password: TestPass123!
   Confirm Password: TestPass123!
   Account Type: Business
   Business Name: Test Company
   ✅ Agree to terms
   ```

5. **Click "Sign Up"**

6. **Choose OTP method** → Enter OTP

7. **Watch console for:**
   ```
   Registration error details: {
     status: 400,
     data: { code: "...", message: "..." },
     message: "..."
   }
   ```

---

## 📊 **What to Look For:**

### **In Browser Console:**

**Good (Success):**
```
Registration successful!
```

**Bad (Error):**
```
Registration error details: {
  status: 400,
  data: {
    code: "missing_field",
    message: "Missing required field: firstName"
  }
}
```

**Copy and share this with me!**

---

## 🔧 **Common Issues:**

### **Issue 1: Email Already Exists**

**Error:**
```
"This email is already registered"
```

**Fix:**
Use a **different email** each time you test:
```
test1@example.com
test2@example.com
test3@example.com
```

---

### **Issue 2: Required Field Missing**

**Error:**
```
"Missing required field: firstName"
```

**Cause:**
- Field not filled in form
- OR field not sent to API
- OR plugin expects different field name

**Debug:**
Add this temporarily to SignupForm before `await register()`:
```javascript
console.log('Sending to API:', {
  username: formData.username.trim(),
  email: formData.email.trim().toLowerCase(),
  password: formData.password,
  firstName: formData.firstName.trim(),
  lastName: formData.lastName.trim(),
  mobilePhone: formData.mobilePhone.trim(),
  businessName: formData.role === 'business' ? formData.businessName.trim() : '',
  role: formData.role
});
```

This will show what's actually being sent!

---

### **Issue 3: WordPress Plugin Not Active**

**Error:**
```
404 Not Found
OR
"rest_no_route"
```

**Fix:**
```
WordPress Admin → Plugins
Verify: "Zanobia Business Accounts" is Active
```

---

## 🎯 **Quick Test Checklist:**

Before registering:
- [ ] Email is NEW (not used before)
- [ ] First Name filled
- [ ] Last Name filled
- [ ] Mobile Phone filled (numbers only)
- [ ] Password meets requirements
- [ ] Account Type selected
- [ ] Business Name filled (if Business selected)
- [ ] Terms checkbox checked

---

## 📡 **Verify WordPress Endpoint:**

**Test endpoint directly in Postman:**

```
POST https://go.zanobiaonline.com/wp-json/zanobia/v1/register

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "directtest@example.com",
  "password": "TestPass123!",
  "firstName": "Direct",
  "lastName": "Test",
  "mobilePhone": "9999999999",
  "accountType": "user",
  "username": "directtest"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 123,
    "username": "directtest",
    "email": "directtest@example.com",
    ...
  }
}
```

**If this works in Postman but not in React:**
- Issue is in React code
- Check CORS headers
- Check payload format

**If this DOESN'T work in Postman:**
- Issue is in WordPress plugin
- Check plugin is active
- Check debug.log for PHP errors

---

## 🔍 **Next Steps:**

1. **Try registering again** with a NEW email
2. **Check browser console** for "Registration error details"
3. **Share the error details** with me
4. **I'll fix the exact issue**

---

## 📧 **Also Check:**

After successful registration:
```
WordPress → Users → All Users
Should see new user with "Pending Business" role

File: /wp-content/debug.log
Should contain registration logs
```

---

**Try one more time with a brand new email and share what the console shows!** 🔍

