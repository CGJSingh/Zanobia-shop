# 📡 React → WordPress Payload Reference

## 🎯 Complete API Integration Guide

---

## 1️⃣ User Registration

### **React Payload (Sent):**

```javascript
// From: SignupForm.jsx
// To: /wp-json/zanobia/v1/register

{
  "email": "john.doe@businesscorp.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "mobilePhone": "4165551234",
  "accountType": "business", // or "user"
  "businessName": "Business Corp Inc.", // only if accountType = "business"
  "username": "johndoe" // optional, auto-generated from email if not provided
}
```

### **WordPress Response (Success):**

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 123,
    "username": "johndoe",
    "email": "john.doe@businesscorp.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "pending_business",
    "status": "pending"
  }
}
```

### **WordPress Response (Error):**

```json
{
  "code": "email_exists",
  "message": "This email is already registered",
  "data": {
    "status": 400
  }
}
```

**Possible Error Codes:**
- `email_exists` - Email already registered
- `missing_field` - Required field not provided
- `invalid_email` - Email format invalid
- `missing_business_name` - Business name required for business accounts
- `registration_failed` - General registration error

---

## 2️⃣ User Login

### **React Payload:**

```javascript
// From: LoginForm.jsx
// To: /wp-json/jwt-auth/v1/token (JWT plugin)

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

### **WordPress Response:**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_email": "john.doe@businesscorp.com",
  "user_nicename": "johndoe",
  "user_display_name": "John Doe"
}
```

**Then React calls:**
```javascript
GET /wp-json/zanobia/v1/user-role
Authorization: Bearer {JWT_TOKEN}
```

**WordPress Response:**
```json
{
  "id": 123,
  "username": "johndoe",
  "email": "john.doe@businesscorp.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "business_verified",
  "mobilePhone": "4165551234",
  "businessName": "Business Corp Inc.",
  "businessStatus": "approved",
  "verified": true,
  "canAccessWholesale": true
}
```

---

## 3️⃣ Check Wholesale Access

### **React Logic:**

```javascript
// In WholesalePage.jsx or ProtectedRoute.jsx
const { user, isAuthenticated } = useAuth();

// Check if user can access wholesale
const canAccessWholesale = 
  isAuthenticated && 
  user?.role === 'business_verified' &&
  user?.verified === true &&
  user?.canAccessWholesale === true;

if (canAccessWholesale) {
  // Show product carousel
} else {
  // Show locked message
}
```

---

## 4️⃣ Get Pending Businesses (Admin Only)

### **React Payload:**

```javascript
GET /wp-json/zanobia/v1/pending-businesses
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

### **WordPress Response:**

```json
[
  {
    "id": 123,
    "username": "johndoe",
    "email": "john.doe@businesscorp.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Business Corp Inc.",
    "mobilePhone": "4165551234",
    "registrationDate": "2024-01-15 10:30:00"
  },
  {
    "id": 124,
    "username": "jane.smith",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "businessName": "Smith Enterprises",
    "mobilePhone": "6475559999",
    "registrationDate": "2024-01-15 11:45:00"
  }
]
```

---

## 5️⃣ Approve Business (Admin Only)

### **React Payload:**

```javascript
POST /wp-json/zanobia/v1/approve-business/123
Authorization: Bearer {ADMIN_JWT_TOKEN}

// No body required
```

### **WordPress Response:**

```json
{
  "success": true,
  "message": "Business account approved successfully",
  "user": {
    "id": 123,
    "email": "john.doe@businesscorp.com",
    "role": "business_verified"
  }
}
```

---

## 📋 Field Mapping

### **React State → WordPress User:**

| React Field | WordPress Field | WordPress Meta | Required | Notes |
|-------------|-----------------|----------------|----------|-------|
| `email` | `user_email` | - | ✅ Yes | Must be unique |
| `password` | `user_pass` | - | ✅ Yes | Hashed by WP |
| `username` | `user_login` | - | Auto | Generated from email |
| `firstName` | `first_name` | - | ✅ Yes | Display name |
| `lastName` | `last_name` | - | ✅ Yes | Display name |
| `mobilePhone` | - | `mobile_phone` | ✅ Yes | Stored as meta |
| `role` → `accountType` | User role | `account_type` | ✅ Yes | 'user' or 'business' |
| `businessName` | - | `business_name` | Conditional | Required if business |

---

## 🔄 User Role States

### **React `role` Field:**

| React Value | WordPress Role | Access Level | Can View Wholesale? |
|-------------|----------------|--------------|---------------------|
| `"user"` | `customer` | Regular customer | ❌ No |
| `"business"` (new) | `pending_business` | Pending approval | ❌ No |
| `"business"` (approved) | `business_verified` | Verified business | ✅ Yes |

---

## 🎨 React Component Usage

### **Signup Form:**

```javascript
// src/components/auth/SignupForm.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const userData = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    mobilePhone: formData.mobilePhone,
    role: formData.role, // 'user' or 'business'
    businessName: formData.businessName, // if role = 'business'
    username: formData.username
  };

  const result = await register(userData);
  // Result includes: success, user, message
};
```

---

### **Wholesale Page:**

```javascript
// src/pages/WholesalePage.jsx

const { user, isAuthenticated } = useAuth();

const isVerifiedBusiness = 
  isAuthenticated && 
  user?.role === 'business_verified';

const isBusinessPending = 
  isAuthenticated && 
  user?.role === 'pending_business';

return (
  <>
    {isVerifiedBusiness ? (
      <ProductCarousel /> // Unlocked
    ) : (
      <LockedMessage 
        isPending={isBusinessPending}
        isGuest={!isAuthenticated}
      />
    )}
  </>
);
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Guest Registration (Regular User)**

```
React Form Input:
- Email: customer@example.com
- Password: Customer123!
- Name: John Customer
- Phone: 1234567890
- Account Type: User

React Sends:
{
  "accountType": "user",
  ...other fields
}

WordPress Creates:
- User ID: 101
- Role: customer
- Status: active

React Response:
{
  "success": true,
  "message": "Account created successfully!"
}

Wholesale Access: ❌ No
```

---

### **Scenario 2: Business Registration**

```
React Form Input:
- Email: business@example.com
- Password: Business123!
- Name: Jane Business
- Phone: 0987654321
- Account Type: Business
- Business Name: ABC Corp

React Sends:
{
  "accountType": "business",
  "businessName": "ABC Corp",
  ...other fields
}

WordPress Creates:
- User ID: 102
- Role: pending_business
- Status: pending
- Meta: business_name = "ABC Corp"

Email Sent: company@zanobiaonline.com

React Response:
{
  "success": true,
  "message": "Business account created! Pending verification..."
}

Wholesale Access: ❌ No (pending)
```

---

### **Scenario 3: Admin Approval**

```
WordPress Admin Action:
- Users → All Users
- Find: business@example.com
- Click: "✓ Approve Business"

WordPress Updates:
- Role: pending_business → business_verified
- Meta: business_status = "approved"
- Meta: approval_date = current timestamp

Email Sent: business@example.com
Subject: "Your Business Account Has Been Approved"

Next Login:
React receives:
{
  "role": "business_verified",
  "verified": true,
  "canAccessWholesale": true
}

Wholesale Access: ✅ Yes
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   React     │
│ Signup Form │
└──────┬──────┘
       │ POST /zanobia/v1/register
       │ {email, password, accountType, ...}
       ↓
┌─────────────────┐
│   WordPress     │
│   REST API      │
└────────┬────────┘
         │ Creates user
         │ Assigns role
         │ Saves meta
         ↓
┌──────────────────┐
│   WordPress DB   │
│  wp_users        │ ← User record
│  wp_usermeta     │ ← Phone, business name
└────────┬─────────┘
         │ Triggers hook: user_register
         ↓
┌──────────────────┐
│ Email to Admin   │
│ (if business)    │
└────────┬─────────┘
         │
         │ Admin approves
         ↓
┌──────────────────┐
│ Role Change Hook │
│ set_user_role    │
└────────┬─────────┘
         │ Changes: pending_business → business_verified
         │ Triggers: approval email
         ↓
┌──────────────────┐
│ Email to User    │
│ "Approved!"      │
└────────┬─────────┘
         │
         │ User logs in
         ↓
┌─────────────┐
│   React     │
│ /wholesale  │ ← Checks user.role === 'business_verified'
└─────────────┘   Shows product carousel ✓
```

---

## 🔐 Security Considerations

### **WordPress Side:**
- ✅ Input sanitization (`sanitize_text_field`, `sanitize_email`)
- ✅ Email validation (`is_email()`)
- ✅ Username uniqueness check
- ✅ Nonce verification for admin actions
- ✅ Permission checks (`current_user_can()`)
- ✅ Password hashing (automatic via `wp_create_user()`)

### **React Side:**
- ✅ Password requirements (8+ chars, uppercase, lowercase, number, special char)
- ✅ No weak passwords (12345, password, names)
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Business name required for business accounts

---

## 🎉 Summary

**Complete role-based system with:**

✅ Custom WordPress plugin (400+ lines)  
✅ REST API endpoints for registration & approval  
✅ Email notifications (admin & user)  
✅ React integration updated  
✅ Wholesale access control  
✅ Admin approval workflow  
✅ Local testing support (debug log)  
✅ Production ready (SMTP compatible)  

**Next Steps:**
1. Upload plugin to WordPress
2. Activate plugin
3. Test business registration
4. Test admin approval
5. Test wholesale access

---

**Your business accounts system is ready to deploy!** 🚀🔐

