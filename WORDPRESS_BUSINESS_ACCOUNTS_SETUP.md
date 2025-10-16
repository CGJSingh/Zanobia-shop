# 🔐 WordPress Business Accounts - Complete Setup Guide

## ✅ What Was Created

A complete **WordPress plugin** for role-based registration with business account approval workflow.

---

## 📦 Package Contents

### **1. WordPress Plugin:**
- **File:** `wordpress-plugin/zanobia-business-accounts.php`
- **Size:** ~400 lines of production-ready PHP
- **Features:** Custom roles, REST API endpoints, email notifications, admin approval

### **2. React Integration:**
- **Updated:** `src/api/auth.js` - registerUser function
- **Connects to:** `/wp-json/zanobia/v1/register`

---

## 🚀 Installation Steps

### **Step 1: Install WordPress Plugin**

1. **Locate the plugin file:**
   ```
   wordpress-plugin/zanobia-business-accounts.php
   ```

2. **Upload to WordPress:**
   - **Option A (Direct):**
     ```
     Upload to: /wp-content/plugins/zanobia-business-accounts/
     Create folder: zanobia-business-accounts
     Place file inside: zanobia-business-accounts.php
     ```

   - **Option B (FTP):**
     ```
     Connect to your server
     Navigate to: /wp-content/plugins/
     Create: zanobia-business-accounts folder
     Upload: zanobia-business-accounts.php
     ```

   - **Option C (cPanel File Manager):**
     ```
     cPanel → File Manager
     Navigate to: public_html/wp-content/plugins/
     Create folder: zanobia-business-accounts
     Upload: zanobia-business-accounts.php
     ```

3. **Activate the plugin:**
   ```
   WordPress Admin → Plugins → Installed Plugins
   Find: "Zanobia Business Accounts"
   Click: "Activate"
   ```

4. **Verify activation:**
   - Plugin creates custom roles automatically
   - Check: WordPress → Settings → Permalinks
   - Ensure "Post name" is selected (for REST API)

---

## 🔐 Custom User Roles Created

The plugin automatically creates **2 new roles**:

### **1. Pending Business** (`pending_business`)
- **When:** User registers with accountType = "business"
- **Capabilities:** Basic read-only access
- **Status:** Awaiting admin approval
- **Wholesale Access:** ❌ No

### **2. Business Verified** (`business_verified`)
- **When:** Admin approves pending business user
- **Capabilities:** Read + custom `access_wholesale`
- **Status:** Approved
- **Wholesale Access:** ✅ Yes

### **Existing Roles:**
- **Customer** (`customer`) - Regular users (default WooCommerce)
- **Administrator** - Full access

---

## 📡 REST API Endpoints

### **1. User Registration**
```
POST /wp-json/zanobia/v1/register
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "mobilePhone": "1234567890",
  "accountType": "business",
  "businessName": "ABC Corporation",
  "username": "johndoe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 123,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "pending_business",
    "status": "pending"
  }
}
```

**Response (Error):**
```json
{
  "code": "email_exists",
  "message": "This email is already registered",
  "status": 400
}
```

---

### **2. Get User Role**
```
GET /wp-json/zanobia/v1/user-role
Headers: Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "id": 123,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "business_verified",
  "mobilePhone": "1234567890",
  "businessName": "ABC Corporation",
  "businessStatus": "approved",
  "verified": true,
  "canAccessWholesale": true
}
```

---

### **3. Get Pending Businesses** (Admin Only)
```
GET /wp-json/zanobia/v1/pending-businesses
Headers: Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
[
  {
    "id": 123,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "ABC Corporation",
    "mobilePhone": "1234567890",
    "registrationDate": "2024-01-15 10:30:00"
  }
]
```

---

### **4. Approve Business** (Admin Only)
```
POST /wp-json/zanobia/v1/approve-business/123
Headers: Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "Business account approved successfully",
  "user": {
    "id": 123,
    "email": "john@example.com",
    "role": "business_verified"
  }
}
```

---

## 📧 Email Notifications

### **1. New Business Registration (to Admin)**

**Sent To:** `company@zanobiaonline.com`  
**When:** User registers with accountType = "business"  
**Subject:** "New Business Registration Pending Approval - Zanobia"

**Email Content:**
```
A new business account has been registered and requires your approval.

=== BUSINESS DETAILS ===

Business Name: ABC Corporation
Contact Person: John Doe
Email: john@example.com
Phone: 1234567890
Username: johndoe
Registration Date: 2024-01-15 10:30:00

=== NEXT STEPS ===

1. Review the business details
2. Log into WordPress Admin
3. Go to Users → All Users
4. Find: john@example.com
5. Change role from 'Pending Business' to 'Business Verified'

Admin Panel: https://yourdomain.com/wp-admin/users.php

Thank you,
Zanobia System
```

---

### **2. Business Approval (to User)**

**Sent To:** User's email  
**When:** Admin changes role to `business_verified`  
**Subject:** "Your Business Account Has Been Approved - Zanobia"

**Email Content:**
```
Dear John,

Congratulations! Your business account has been approved.

=== ACCOUNT DETAILS ===

Business Name: ABC Corporation
Account Type: Business Verified
Username: johndoe
Email: john@example.com

=== WHOLESALE ACCESS ===

You now have access to:
✓ Exclusive wholesale pricing
✓ Bulk order discounts (up to 40% off)
✓ Priority shipping options
✓ Dedicated account manager
✓ Early access to new products

Visit our wholesale section: https://yourdomain.com/wholesale

Thank you for partnering with Zanobia!

Best regards,
The Zanobia Team
company@zanobiaonline.com
```

---

## 🔧 Admin Approval Process

### **Method 1: Quick Approve (Recommended)**

1. **Go to:** WordPress Admin → Users → All Users

2. **Find pending business user:**
   - Look for role: "Pending Business"
   - Hover over user row

3. **Click "✓ Approve Business" link:**
   - Green link appears under user email
   - One-click approval
   - User role changed automatically
   - Approval email sent

4. **See success message:**
   - "Success! Business account has been approved."

---

### **Method 2: Manual Role Change**

1. **Go to:** Users → All Users

2. **Click user email** to edit

3. **Change Role:**
   - Find "Role" dropdown
   - Change from: "Pending Business"
   - Change to: "Business Verified"
   - Click "Update User"

4. **Approval email sent automatically**

---

### **Method 3: REST API** (Advanced)

```bash
POST /wp-json/zanobia/v1/approve-business/123
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

---

## 🧪 Local Testing (No SMTP)

### **Email Fallback:**

If SMTP is not configured (local development):
- Emails are logged to `wp-content/debug.log`
- Check this file to see email content
- No actual emails sent

**Enable Debug Log:**
```php
// In wp-config.php (already done by plugin)
define('WP_DEBUG_LOG', true);
```

**View Logs:**
```
/wp-content/debug.log

Example entry:
[15-Jan-2024 10:30:00] [Zanobia Business Accounts] Business registration email sent to admin for user ID: 123
[15-Jan-2024 10:30:05] Email could not be sent (SMTP not configured). Business registration details:
A new business account has been registered...
```

---

## 🎯 React Frontend Integration

### **Registration Flow:**

**File:** `src/api/auth.js` (Updated)

```javascript
// When user submits signup form
const result = await registerUser({
  email: 'john@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  mobilePhone: '1234567890',
  role: 'business', // or 'user'
  businessName: 'ABC Corporation', // only if role = 'business'
  username: 'johndoe' // optional
});

// Response:
{
  success: true,
  user: { ... },
  message: 'Business account created! Your account is pending verification...'
}
```

---

### **Checking User Role in React:**

**File:** `src/context/AuthContext.jsx`

```javascript
const { user, isAuthenticated } = useAuth();

// Check if verified business
const isVerifiedBusiness = user?.role === 'business_verified';
const canAccessWholesale = user?.canAccessWholesale === true;

// Check if pending
const isBusinessPending = user?.role === 'pending_business';

// In WholesalePage:
{isVerifiedBusiness ? (
  <ProductCarousel /> // Show products
) : (
  <LockedMessage /> // Show registration prompt
)}
```

---

## 📊 User Lifecycle

### **Registration → Approval → Access:**

```
1. User Registers as Business
   ↓
   Frontend sends: accountType = "business"
   ↓
2. WordPress Creates User
   ↓
   Role: pending_business
   Status: pending
   ↓
3. Email Sent to Admin
   ↓
   Subject: "New Business Registration Pending Approval"
   ↓
4. Admin Reviews
   ↓
   WordPress → Users → All Users
   ↓
5. Admin Clicks "✓ Approve Business"
   ↓
   Role changed: business_verified
   Status: approved
   ↓
6. Email Sent to User
   ↓
   Subject: "Your Business Account Has Been Approved"
   ↓
7. User Can Access Wholesale
   ↓
   React checks: user.role === 'business_verified'
   Shows product carousel
```

---

## 🔍 Data Storage

### **User Meta Fields:**

| Meta Key | Description | Example Value |
|----------|-------------|---------------|
| `mobile_phone` | User's mobile number | "1234567890" |
| `account_type` | Account type | "business" or "user" |
| `business_name` | Business name | "ABC Corporation" |
| `business_status` | Approval status | "pending" or "approved" |
| `registration_date` | When registered | "2024-01-15 10:30:00" |
| `approval_date` | When approved | "2024-01-16 14:00:00" |

### **Access in PHP:**
```php
$business_name = get_user_meta($user_id, 'business_name', true);
$phone = get_user_meta($user_id, 'mobile_phone', true);
```

### **Access in React:**
```javascript
// Via REST API /zanobia/v1/user-role
user.businessName
user.mobilePhone
user.businessStatus
```

---

## 🛡️ Security Features

### **Input Validation:**
- ✅ Email format validation
- ✅ Required field checks
- ✅ Sanitization of all inputs
- ✅ Unique email enforcement

### **Permission Checks:**
- ✅ Public registration endpoint
- ✅ Authenticated user role check
- ✅ Admin-only approval endpoints
- ✅ Nonce verification for admin actions

### **Password Handling:**
- ✅ WordPress native `wp_create_user()`
- ✅ Passwords hashed automatically
- ✅ Never stored in plain text

---

## 🧪 Testing Checklist

### **Test Registration (Regular User):**

1. **Open signup page:** `/signup`
2. **Fill form:**
   - Email: test@example.com
   - Password: Test123!
   - Name: Test User
   - Phone: 1234567890
   - Account Type: **User**
3. **Submit**
4. **Verify in WordPress:**
   - Go to: Users → All Users
   - Find: test@example.com
   - Role should be: **Customer**

---

### **Test Registration (Business User):**

1. **Open signup page:** `/signup`
2. **Fill form:**
   - Email: business@example.com
   - Password: Business123!
   - Name: Business Owner
   - Phone: 0987654321
   - Account Type: **Business**
   - Business Name: **My Corp**
3. **Submit**
4. **Verify in WordPress:**
   - Go to: Users → All Users
   - Find: business@example.com
   - Role should be: **Pending Business**
5. **Check admin email:**
   - Email sent to: company@zanobiaonline.com
   - Or check: wp-content/debug.log

---

### **Test Approval:**

1. **In WordPress Admin:**
   - Users → All Users
   - Find business user
   - Hover over row
   - Click: **"✓ Approve Business"** (green link)

2. **Verify:**
   - User role changed to: **Business Verified**
   - Success message appears
   - Approval email sent to user

3. **Test in React:**
   - Login as business user
   - Go to: `/wholesale`
   - Should see: Product carousel (unlocked)

---

## 📧 Email Configuration

### **For Local Testing (No SMTP):**

**Status:** ✅ Already configured

- All emails logged to `wp-content/debug.log`
- No actual emails sent
- Full email content visible in logs
- Perfect for development

---

### **For Production (SMTP Required):**

**Install SMTP Plugin:**

1. **WP Mail SMTP** (Recommended)
   ```
   WordPress → Plugins → Add New
   Search: "WP Mail SMTP"
   Install & Activate
   ```

2. **Configure SMTP:**
   ```
   Settings → WP Mail SMTP
   
   From Email: noreply@zanobiaonline.com
   From Name: Zanobia Online
   
   Mailer: Choose your provider
   - Gmail
   - SendGrid
   - Amazon SES
   - Other SMTP
   
   SMTP Settings:
   - Host: smtp.gmail.com (or your provider)
   - Port: 587 or 465
   - Username: your email
   - Password: app password
   - Encryption: TLS or SSL
   ```

3. **Test Email:**
   ```
   WP Mail SMTP → Tools → Email Test
   Send test email to verify configuration
   ```

**Alternative Plugins:**
- Easy WP SMTP
- Post SMTP Mailer
- Gmail SMTP

---

## 🔄 User Status States

### **State Diagram:**

```
Guest User
   ↓
   Registers as Business
   ↓
pending_business
(Status: pending)
   ↓
   Admin Approves
   ↓
business_verified
(Status: approved)
   ↓
   Can Access Wholesale ✓
```

---

## 🎯 React Frontend Changes

### **Updated Files:**

**1. `src/api/auth.js`**

```javascript
export const registerUser = async (userData) => {
  const registrationData = {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    mobilePhone: userData.mobilePhone,
    accountType: userData.role, // 'user' or 'business'
    businessName: userData.businessName, // if business
    username: userData.username
  };

  const response = await authAPI.post('/zanobia/v1/register', registrationData);
  return response.data;
};
```

---

### **Signup Form Payload:**

**File:** `src/components/auth/SignupForm.jsx`

When user submits, sends:
```javascript
{
  email: 'user@example.com',
  password: 'Pass123!',
  firstName: 'John',
  lastName: 'Doe',
  mobilePhone: '1234567890',
  role: 'business', // from form dropdown
  businessName: 'My Company', // if role = business
  username: 'johndoe' // auto-generated from email
}
```

---

### **Wholesale Page Access:**

**File:** `src/pages/WholesalePage.jsx`

```javascript
const { user, isAuthenticated } = useAuth();

const isVerifiedBusiness = 
  isAuthenticated && 
  user?.role === 'business_verified';

{isVerifiedBusiness ? (
  <ProductCarousel /> // Unlocked
) : (
  <LockedAccessMessage /> // Locked
)}
```

---

## 🔍 Admin Dashboard Features

### **User Management:**

**WordPress → Users → All Users**

You'll see:
- **Regular customers** (role: Customer)
- **Pending businesses** (role: Pending Business) ⚠️
- **Verified businesses** (role: Business Verified) ✅

### **Quick Actions:**

For **Pending Business** users:
- **✓ Approve Business** (green link) - One-click approval
- **Edit** - Manual role change
- **Delete** - Remove user

### **Admin Notice:**

At the top of Users page:
```
⚠️ Pending Business Accounts: 3 business registration(s) awaiting approval.
```

### **User Meta Visible:**

When editing a business user:
- Custom fields section shows:
  - Mobile Phone
  - Business Name
  - Account Type
  - Business Status
  - Registration Date

---

## 🐛 Troubleshooting

### **Issue: Plugin doesn't appear**

**Check:**
1. File uploaded to correct location
2. Folder name: `zanobia-business-accounts`
3. File name: `zanobia-business-accounts.php`
4. PHP syntax errors (check error log)

**Fix:**
```
Go to: Plugins → Installed Plugins
If not visible, check:
/wp-content/plugins/zanobia-business-accounts/
Ensure file exists and no PHP errors
```

---

### **Issue: Registration fails (404)**

**Check:**
1. Plugin is activated
2. Permalinks flushed
3. REST API enabled

**Fix:**
```
Settings → Permalinks
Click "Save Changes" (flushes rewrite rules)
Test: https://yourdomain.com/wp-json/zanobia/v1/register
Should return: {"code":"rest_no_route"} for GET
```

---

### **Issue: Email not received**

**Check:**
1. SMTP configured
2. Check spam folder
3. Check debug.log for fallback

**Fix:**
```
// For local testing:
Check: /wp-content/debug.log

// For production:
Install: WP Mail SMTP plugin
Configure SMTP settings
Test email delivery
```

---

### **Issue: Approval email not sent**

**Check:**
1. Role was actually changed
2. Changed from `pending_business` → `business_verified`
3. Check debug.log

**Fix:**
```
Look in: /wp-content/debug.log
Search for: "Admin approved business user ID"
Email content should be logged if SMTP fails
```

---

## 📚 Code Structure

### **Plugin Architecture:**

```
Zanobia_Business_Accounts Class
├── create_custom_roles()
│   └── Creates: pending_business, business_verified
│
├── register_rest_routes()
│   ├── /zanobia/v1/register
│   ├── /zanobia/v1/user-role
│   ├── /zanobia/v1/pending-businesses
│   └── /zanobia/v1/approve-business/{id}
│
├── handle_registration_request()
│   ├── Validates input
│   ├── Creates user
│   ├── Assigns role
│   └── Saves meta data
│
├── handle_new_user_registration()
│   └── Triggers email notification
│
├── handle_role_change()
│   └── Sends approval email
│
└── Admin UI Enhancements
    ├── add_approve_business_link()
    ├── show_pending_business_notice()
    └── Quick approval via URL
```

---

## 🎯 Key Features

✅ **Custom REST API** - `/zanobia/v1/register`  
✅ **Role-based system** - pending_business → business_verified  
✅ **Email notifications** - Admin & user emails  
✅ **Admin approval UI** - One-click approval  
✅ **Security** - Validation, sanitization, nonces  
✅ **Local testing** - Debug log fallback  
✅ **User meta storage** - Phone, business name  
✅ **Status tracking** - pending → approved  
✅ **WooCommerce compatible** - Works with existing setup  

---

## 🚀 Next Steps

### **1. Install Plugin:**
- Upload to `/wp-content/plugins/zanobia-business-accounts/`
- Activate in WordPress
- Verify roles created

### **2. Test Registration:**
- Register test business user
- Check admin email/debug.log
- Verify user created with pending_business role

### **3. Test Approval:**
- Approve user in WordPress
- Check user email/debug.log
- Verify role changed to business_verified

### **4. Test React:**
- Login as verified business
- Visit `/wholesale`
- Verify product carousel unlocked

### **5. Production Setup:**
- Install SMTP plugin
- Configure email settings
- Test live emails

---

## 📖 Additional Documentation

**Related Files:**
- `src/api/auth.js` - Updated registration function
- `src/pages/WholesalePage.jsx` - Access control logic
- `src/context/AuthContext.jsx` - User role management

---

## 🎉 Summary

**You now have:**

✅ **Complete WordPress plugin** - Role-based registration  
✅ **Custom REST API endpoints** - Registration & approval  
✅ **Email notifications** - Admin & user alerts  
✅ **Admin approval workflow** - One-click or manual  
✅ **React integration** - Updated API calls  
✅ **Local testing support** - Debug log fallback  
✅ **Production ready** - Security, validation, SMTP  

**Next:** Install the plugin and test the complete workflow!

---

**Business accounts system ready for deployment!** 🏢✨

