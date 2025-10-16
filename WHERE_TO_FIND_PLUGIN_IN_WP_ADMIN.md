# 📍 Where to Find Your Plugin in WordPress Admin

## ✅ **After Uploading the Plugin File**

### **Your file should be at:**
```
/public_html/wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
```

---

## 🎯 **EXACT Steps to Find Plugin:**

### **Step 1: Login to WordPress Admin**

```
URL: https://go.zanobiaonline.com/wp-admin
OR: https://go.zanobiaonline.com/wp-login.php

Enter:
- Username: your admin username
- Password: your admin password
Click: "Log In"
```

---

### **Step 2: Navigate to Plugins Page**

**Look at LEFT SIDEBAR:**

```
┌─────────────────────────┐
│ 📊 Dashboard            │
│ 📝 Posts                │
│ 📄 Pages                │
│ 💬 Comments             │
│ 🎨 Appearance           │
│ 🔌 Plugins              │ ← CLICK HERE!
│ 👥 Users                │
│ 🛠️ Tools                │
│ ⚙️ Settings             │
│ 🛒 WooCommerce          │
└─────────────────────────┘
```

**Click on:** `Plugins`

---

### **Step 3: Click "Installed Plugins"**

**After clicking "Plugins", you'll see submenu:**

```
Plugins
  ├── Installed Plugins  ← CLICK THIS!
  └── Add New
```

**Or direct URL:**
```
https://go.zanobiaonline.com/wp-admin/plugins.php
```

---

### **Step 4: What You Should See**

**On the Plugins page, you'll see a list of plugins:**

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 Search Installed Plugins: [         ]                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 📦 Akismet Anti-Spam                                     │
│    Automatic spam filtering. [ Activate ]               │
│                                                          │
│ 🛒 WooCommerce                                           │
│    Open-source eCommerce. [ Deactivate | Settings ]     │
│                                                          │
│ 🏢 Zanobia Business Accounts                             │ ← YOUR PLUGIN!
│    Custom role-based registration system...             │
│    Version 1.0.0 | By Zanobia Team                      │
│    [ Activate ]                                          │ ← Click this!
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### **Step 5: Search for Your Plugin**

**If you don't see it immediately:**

1. **Use search box at top:**
   ```
   Type: Zanobia
   Press: Enter
   ```

2. **Check tabs at top:**
   ```
   All (X) | Active (X) | Inactive (X) | Recently Active (X)
   ```
   - Make sure you're on "All" tab

3. **Scroll down:**
   - Plugins are listed alphabetically
   - Look for "Zanobia Business Accounts"

---

## ✅ **What It Should Look Like:**

### **Before Activation:**
```
┌──────────────────────────────────────────────────────────┐
│ 🏢 Zanobia Business Accounts                             │
│                                                          │
│ Custom role-based registration system for regular       │
│ users and business accounts with admin approval         │
│ workflow                                                 │
│                                                          │
│ Version 1.0.0 | By Zanobia Team                         │
│                                                          │
│ [ Activate ] Settings                                    │
└──────────────────────────────────────────────────────────┘
```

### **After Activation:**
```
┌──────────────────────────────────────────────────────────┐
│ 🏢 Zanobia Business Accounts                             │
│                                                          │
│ Custom role-based registration system...                │
│                                                          │
│ Version 1.0.0 | By Zanobia Team                         │
│                                                          │
│ [ Deactivate ] Settings                                  │
│ ↑ Now shows "Deactivate" (plugin is active!)            │
└──────────────────────────────────────────────────────────┘
```

---

## 🔍 **If You DON'T See It:**

### **Check 1: File Size**

**In cPanel File Manager:**
```
/wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php

Right-click → Properties
File size should be: ~20 KB (around 20,000 bytes)

If it's 0 KB or very small → Re-upload the file
```

---

### **Check 2: File Content**

**In cPanel File Manager:**
```
Right-click file → View (or Edit)

First lines should look EXACTLY like this:

<?php
/**
 * Plugin Name: Zanobia Business Accounts
 * Plugin URI: https://zanobiaonline.com
 * Description: Custom role-based registration system for regular users and business accounts with admin approval workflow
 * Version: 1.0.0
 * Author: Zanobia Team
 * Author URI: https://zanobiaonline.com
 * Text Domain: zanobia-business
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */
```

**If it looks different or has weird characters → Re-upload**

---

### **Check 3: Upload Test Plugin**

**To verify WordPress can read plugins:**

1. **Upload:** `test-plugin.php`
2. **Location:** `/wp-content/plugins/test-plugin.php` (directly, no folder)
3. **Check WordPress:** Plugins → Installed Plugins
4. **If "Zanobia Test Plugin" appears:**
   - ✅ WordPress works
   - ✅ Main plugin has an issue
5. **If test plugin DOESN'T appear:**
   - ❌ WordPress has plugin reading issue
   - → Check file permissions

---

## 📋 **Quick Verification Steps:**

### **In cPanel File Manager:**

```
Step 1: Go to /wp-content/plugins/
Step 2: See folder: zanobia-business-accounts
Step 3: Click folder to enter
Step 4: See file: zanobia-business-accounts.php
Step 5: Check file size: ~20 KB
Step 6: Right-click → View → First line is: <?php
```

### **In WordPress Admin:**

```
Step 1: Login to wp-admin
Step 2: Click: Plugins (left sidebar)
Step 3: Click: Installed Plugins
Step 4: Look for: "Zanobia Business Accounts"
Step 5: If found → Click "Activate"
Step 6: Success message appears
```

---

## 🎯 **After Activation - How to Verify It Works:**

### **Check 1: New User Roles**

```
WordPress Admin → Users → Add New

Scroll down to "Role" dropdown

You should see NEW roles:
- Subscriber
- Customer
- Pending Business        ← NEW!
- Business Verified       ← NEW!
- Shop Manager
- Administrator
```

---

### **Check 2: REST API Endpoint**

**Open in browser:**
```
https://go.zanobiaonline.com/wp-json/zanobia/v1/
```

**Should see:**
```json
{
  "namespace": "zanobia/v1",
  "routes": {
    "/zanobia/v1/register": {...},
    "/zanobia/v1/user-role": {...},
    ...
  }
}
```

**If you see this → Plugin is working!** ✅

---

### **Check 3: Debug Log**

**After activation, check:**
```
/wp-content/debug.log

Should contain:
[timestamp] [Zanobia Business Accounts] Custom roles created: pending_business, business_verified
```

---

## 🚨 **Still Not Showing?**

### **Share These 4 Things:**

1. **File Manager Path:**
   ```
   Screenshot showing:
   /wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
   With file size visible
   ```

2. **First 3 Lines of PHP File:**
   ```
   Right-click file → View
   Copy first 3 lines
   Share with me
   ```

3. **WordPress Version:**
   ```
   Dashboard → Updates
   "WordPress Version X.X.X"
   ```

4. **Other Plugins Visible?:**
   ```
   Can you see WooCommerce in the plugin list?
   Can you see any other plugins?
   ```

---

## 💡 **Summary - Where to Look:**

| Step | Where | What to Do |
|------|-------|------------|
| 1 | WordPress Admin | Login |
| 2 | Left Sidebar | Click "Plugins" |
| 3 | Submenu | Click "Installed Plugins" |
| 4 | Plugin List | Look for "Zanobia Business Accounts" |
| 5 | Plugin Row | Click "Activate" |
| 6 | Users → Add New | Verify new roles in dropdown |

---

**Direct URL to check:**
```
https://go.zanobiaonline.com/wp-admin/plugins.php
```

**Look for text:**
```
"Zanobia Business Accounts"
```

**If you see it → Click "Activate"!** ✅

---

**Try navigating to the plugins page now and tell me:**
1. Do you see other plugins (like WooCommerce)?
2. What's the file size showing in File Manager?
3. Does the first line say `<?php`?

