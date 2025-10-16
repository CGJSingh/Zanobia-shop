# 🔧 Plugin Not Showing - Complete Fix Guide

## ✅ Your Folder Structure is CORRECT!

You did it right:
```
public_html/
  └── wp-content/
      └── plugins/
          └── zanobia-business-accounts/     ← ✅ Your folder
              └── zanobia-business-accounts.php  ← ✅ Your file
```

---

## 🧪 Let's Diagnose the Issue

### **Test 1: Upload Simple Test Plugin**

I've created a minimal test plugin for you.

**File:** `wordpress-plugin/test-plugin.php`

**Steps:**

1. **Find file on your computer:**
   ```
   d:\Zanobia\website\my-shop\wordpress-plugin\test-plugin.php
   ```

2. **Upload to WordPress:**
   ```
   Location: /wp-content/plugins/test-plugin.php
   
   Note: This one goes DIRECTLY in plugins folder (no subfolder)
   ```

3. **Check WordPress Admin:**
   ```
   Plugins → Installed Plugins
   ```

4. **Result:**
   - ✅ If "Zanobia Test Plugin" appears → Your WordPress CAN read plugins
   - ❌ If it doesn't appear → WordPress has a deeper issue

---

## 🔍 Test 2: Check File Encoding

### **Problem:** File might have wrong encoding or BOM

**Fix in cPanel:**

1. **File Manager → Navigate to:**
   ```
   /wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
   ```

2. **Right-click file → Edit**

3. **Check first line:**
   ```
   Should be: <?php
   Should NOT be: ï»¿<?php (BOM characters)
   ```

4. **If you see weird characters before `<?php`:**
   - Delete them
   - Ensure first line is exactly: `<?php`
   - Save file

---

## 🔄 Test 3: Re-upload Clean Version

### **Option A: Copy Raw Text**

1. **Open this file in Notepad:**
   ```
   d:\Zanobia\website\my-shop\wordpress-plugin\zanobia-business-accounts.php
   ```

2. **Select ALL text (Ctrl+A)**

3. **Copy (Ctrl+C)**

4. **In cPanel File Manager:**
   - Navigate to: `/wp-content/plugins/zanobia-business-accounts/`
   - Delete: `zanobia-business-accounts.php` (if exists)
   - Click: "New File"
   - Name: `zanobia-business-accounts.php`
   - Right-click → Edit
   - Paste the copied text (Ctrl+V)
   - Save

5. **Refresh WordPress Admin:**
   - Plugins → Installed Plugins
   - Press F5

---

### **Option B: Upload as ZIP**

Let me create a properly structured ZIP file for you:

1. **On your computer:**
   - Create a new folder on Desktop: `zanobia-business-accounts`
   - Copy file into it: `zanobia-business-accounts.php`
   - Right-click folder → Send to → Compressed (zipped) folder
   - Result: `zanobia-business-accounts.zip`

2. **In WordPress Admin:**
   ```
   Plugins → Add New
   Click: "Upload Plugin"
   Choose: zanobia-business-accounts.zip
   Click: "Install Now"
   Click: "Activate"
   ```

---

## 📊 Test 4: Check WordPress Plugin Page

### **Things to verify in WordPress:**

1. **Are you on the right page?**
   ```
   URL should be: https://go.zanobiaonline.com/wp-admin/plugins.php
   ```

2. **Check tabs:**
   - All (X) ← Check this
   - Active
   - Inactive
   - Must-Use
   - Drop-ins

3. **Search:**
   - Use search box at top right
   - Type: "Zanobia"
   - See if it appears

---

## 🚨 Test 5: Check for PHP Errors

### **Method 1: View error log**

```
File Manager → Navigate to:
/wp-content/debug.log

Look for lines containing:
"zanobia-business-accounts"
"Parse error"
"syntax error"
```

### **Method 2: Check PHP error logs**

```
cPanel → Errors (if available)
Or
cPanel → Metrics → Errors
```

### **Method 3: Enable WP_DEBUG**

1. **Edit `wp-config.php`:**
   ```
   Find: define('WP_DEBUG', false);
   Change to: define('WP_DEBUG', true);
   
   Add these lines:
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

2. **Visit WordPress admin**

3. **Check:**
   ```
   /wp-content/debug.log
   ```

---

## 📋 Checklist (Go Through Each)

### **File Location:**
- [ ] Folder exists: `/wp-content/plugins/zanobia-business-accounts/`
- [ ] File inside folder: `zanobia-business-accounts.php`
- [ ] Folder name is exact: `zanobia-business-accounts` (no typos)
- [ ] File name is exact: `zanobia-business-accounts.php` (no .txt, no typos)

### **File Permissions:**
- [ ] Folder: 755 (drwxr-xr-x)
- [ ] File: 644 (-rw-r--r--)

### **File Content:**
- [ ] First line is: `<?php` (no spaces, no BOM)
- [ ] Has "Plugin Name:" header
- [ ] File size: ~20 KB (not 0 bytes)
- [ ] No extra .txt extension

### **WordPress:**
- [ ] Logged in as Administrator
- [ ] Checked: Plugins → All
- [ ] Searched for: "Zanobia"
- [ ] Refreshed page (F5)
- [ ] WP_DEBUG enabled

---

## 🎯 **QUICK FIX TO TRY RIGHT NOW:**

### **In cPanel File Manager:**

1. **Navigate to:**
   ```
   /wp-content/plugins/zanobia-business-accounts/
   ```

2. **Check file size:**
   ```
   zanobia-business-accounts.php should be around 20 KB
   If it's 0 KB or 1 KB → File didn't upload properly
   ```

3. **If file size is wrong:**
   - Delete it
   - Re-upload from: `d:\Zanobia\website\my-shop\wordpress-plugin\zanobia-business-accounts.php`

4. **After upload, verify:**
   - Right-click file → Edit
   - First line should be: `<?php`
   - Second line should be: `/**`
   - Third line should have: `* Plugin Name: Zanobia Business Accounts`

5. **Go to WordPress:**
   ```
   Plugins → Installed Plugins
   Press: Ctrl + F5 (hard refresh)
   ```

---

## 🎬 **Alternative: Manual Activation**

### **If plugin STILL doesn't show:**

**Try activating via database:**

1. **phpMyAdmin:**
   ```
   cPanel → phpMyAdmin
   Select your WordPress database
   ```

2. **Run query:**
   ```sql
   SELECT * FROM wp_options WHERE option_name = 'active_plugins';
   ```

3. **Look for result:**
   ```
   Should see serialized array of active plugins
   ```

4. **Check if it's there:**
   ```
   Look for: zanobia-business-accounts/zanobia-business-accounts.php
   ```

---

## 📸 **Send Me This Info:**

To help you further, can you share:

### **1. File Manager Screenshot:**
```
Show me: /wp-content/plugins/zanobia-business-accounts/
With file size visible
```

### **2. First 5 Lines of the PHP File:**
```
In cPanel File Manager:
Right-click file → View
Copy first 5 lines
Paste here
```

### **3. WordPress Version:**
```
WordPress → Dashboard → Updates
What version shows?
```

### **4. PHP Version:**
```
cPanel → Select PHP Version
Or cPanel → PHP Version Manager
What version?
```

---

## ⚡ **Quick Test (Do This Now):**

### **Upload the test plugin I created:**

1. **Find file:**
   ```
   d:\Zanobia\website\my-shop\wordpress-plugin\test-plugin.php
   ```

2. **Upload to:**
   ```
   /wp-content/plugins/test-plugin.php
   (Directly in plugins folder, no subfolder)
   ```

3. **Check WordPress:**
   ```
   Plugins → Installed Plugins
   ```

4. **If "Zanobia Test Plugin" appears:**
   - ✅ WordPress plugin system works!
   - ✅ Issue is with main plugin file
   - → We'll fix the main file

5. **If test plugin DOESN'T appear:**
   - ❌ WordPress has plugin reading issue
   - → Need to check file permissions or WordPress config

---

**Try uploading `test-plugin.php` first and let me know if that one shows up!** 

This will tell us if the issue is:
- The specific plugin file content
- OR WordPress not reading plugins at all
