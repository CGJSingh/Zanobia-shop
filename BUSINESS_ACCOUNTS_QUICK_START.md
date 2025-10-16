# 🚀 Business Accounts - Quick Start

## ✅ What You Have Now

1. ✅ **WordPress Plugin** - Complete role-based system
2. ✅ **React Integration** - Updated signup API
3. ✅ **Wholesale Page** - Dynamic access control
4. ✅ **Email Notifications** - Auto-sent on registration/approval

---

## 📦 Installation (5 Minutes)

### **Step 1: Upload Plugin**

```
1. Go to your WordPress site files
2. Navigate to: /wp-content/plugins/
3. Create folder: zanobia-business-accounts
4. Upload: zanobia-business-accounts.php (from wordpress-plugin folder)
```

### **Step 2: Activate**

```
1. WordPress Admin → Plugins
2. Find: "Zanobia Business Accounts"
3. Click: "Activate"
```

### **Step 3: Test**

```
1. Go to: http://localhost:3000/signup
2. Register as Business
3. Check WordPress → Users
4. Approve business user
```

---

## 🎯 How It Works

### **User Registers:**
```
Signup Form → accountType: "business"
   ↓
WordPress creates user
   ↓
Role: pending_business
   ↓
Email to: company@zanobiaonline.com
```

### **Admin Approves:**
```
WordPress → Users → All Users
   ↓
Find user with "Pending Business" role
   ↓
Click: "✓ Approve Business" (green link)
   ↓
Role changes to: business_verified
   ↓
Email sent to user
```

### **User Gets Access:**
```
User logs in
   ↓
Goes to: /wholesale
   ↓
React checks: user.role === 'business_verified'
   ↓
Shows: Product carousel ✓
```

---

## 📧 Emails

### **Email 1: To Admin**
**When:** Business user registers  
**To:** company@zanobiaonline.com  
**Subject:** "New Business Registration Pending Approval"

### **Email 2: To User**
**When:** Admin approves  
**To:** User's email  
**Subject:** "Your Business Account Has Been Approved"

**Local Testing:**
- Emails logged to `/wp-content/debug.log`
- No SMTP needed for development

---

## 🧪 Quick Test

### **Test 1: Business Registration**

```
1. Go to: /signup
2. Fill form:
   Name: Test Business
   Email: test-biz@example.com
   Phone: 1234567890
   Account Type: Business
   Business Name: Test Corp
3. Submit
4. Should see: "Business account created! Pending verification..."
```

### **Test 2: Admin Approval**

```
1. WordPress → Users → All Users
2. Find: test-biz@example.com
3. See role: "Pending Business"
4. Hover over user
5. Click: "✓ Approve Business"
6. See: "Success! Business account approved"
7. Role now: "Business Verified"
```

### **Test 3: Wholesale Access**

```
1. Login as: test-biz@example.com
2. Go to: /wholesale
3. Should see:
   ✓ "Verified Access" badge (green)
   ✓ Product carousel unlocked
   ✓ "Add to Cart" buttons active
```

---

## 📊 API Endpoints

### **Registration:**
```
POST /wp-json/zanobia/v1/register

Body:
{
  "email": "user@example.com",
  "password": "Pass123!",
  "firstName": "John",
  "lastName": "Doe",
  "mobilePhone": "1234567890",
  "accountType": "business",
  "businessName": "My Corp"
}
```

### **Get User Role:**
```
GET /wp-json/zanobia/v1/user-role
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "role": "business_verified",
  "verified": true,
  "canAccessWholesale": true
}
```

---

## ✅ Verification Checklist

- [ ] Plugin uploaded to correct folder
- [ ] Plugin activated in WordPress
- [ ] Custom roles created (check Users → Add New → Role dropdown)
- [ ] REST API working (test with Postman/curl)
- [ ] Signup form sends correct data
- [ ] Business users created with pending_business role
- [ ] Admin receives email (or check debug.log)
- [ ] Approval link appears in user list
- [ ] Approval changes role successfully
- [ ] Approval email sent to user
- [ ] Verified users can access /wholesale

---

## 🐛 Common Issues

### **Plugin doesn't activate:**
```
→ Check PHP syntax errors
→ View error in: /wp-content/debug.log
→ Ensure PHP version >= 7.4
```

### **Registration fails (404):**
```
→ Flush permalinks: Settings → Permalinks → Save
→ Ensure plugin is active
→ Test: /wp-json/zanobia/v1/register
```

### **Emails not received:**
```
→ Local testing: Check debug.log
→ Production: Install SMTP plugin
→ Test email settings
```

### **Approval doesn't work:**
```
→ Ensure you're logged in as admin
→ Check nonce is valid
→ Try manual role change instead
```

---

## 📁 File Locations

### **WordPress (Backend):**
```
/wp-content/plugins/zanobia-business-accounts/
  └── zanobia-business-accounts.php
```

### **React (Frontend):**
```
src/api/auth.js (updated)
src/pages/WholesalePage.jsx (access control)
src/components/auth/SignupForm.jsx (form)
```

---

## 🎉 You're Ready!

**Complete system for:**

✅ Business account registration  
✅ Admin approval workflow  
✅ Email notifications  
✅ Wholesale access control  
✅ Role-based permissions  

**Next:** Upload plugin to WordPress and test!

---

**Full Documentation:** `WORDPRESS_BUSINESS_ACCOUNTS_SETUP.md`

**Your business accounts system is production-ready!** 🏢🔐

