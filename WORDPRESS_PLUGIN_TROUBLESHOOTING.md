# 🔧 WordPress Plugin Not Showing - Troubleshooting Guide

## 🚨 Issue: Plugin Not Visible in WordPress Admin

If "Zanobia Business Accounts" doesn't appear in Plugins → Installed Plugins, follow these steps:

---

## ✅ Step 1: Verify Folder Structure

### **CORRECT Structure:**
```
/wp-content/plugins/
  └── zanobia-business-accounts/          ← Folder (required!)
      └── zanobia-business-accounts.php   ← File inside folder
```

### **INCORRECT (Won't Work):**
```
❌ /wp-content/plugins/zanobia-business-accounts.php  (file directly in plugins)
❌ /wp-content/zanobia-business-accounts/...  (wrong location)
❌ /wp-content/plugins/zanobia/...  (wrong folder name)
```

---

## 🔍 Step 2: Check Via File Manager

### **Using cPanel:**

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to:**
   ```
   public_html/wp-content/plugins/
   ```
4. **You should see folders like:**
   ```
   📁 akismet/
   📁 woocommerce/
   📁 zanobia-business-accounts/  ← Your plugin folder
   ```

5. **Click on `zanobia-business-accounts` folder**
6. **Inside, you should see:**
   ```
   📄 zanobia-business-accounts.php  ← The plugin file
   ```

---

## 🔧 Step 3: Check File Permissions

### **Correct Permissions:**
```
Folder: 755
File: 644
```

### **Fix Permissions:**

**In cPanel File Manager:**
1. Right-click folder → Permissions
2. Set to: `755` (drwxr-xr-x)
3. Right-click file → Permissions
4. Set to: `644` (-rw-r--r--)

**In FTP Client:**
1. Right-click folder → File Permissions
2. Owner: Read, Write, Execute
3. Group: Read, Execute
4. Public: Read, Execute

---

## 🧪 Step 4: Check for PHP Errors

### **Enable WordPress Debug:**

1. **Edit `wp-config.php`:**
   ```
   Find line: define('WP_DEBUG', false);
   Change to: define('WP_DEBUG', true);
   
   Add below it:
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

2. **Check error log:**
   ```
   /wp-content/debug.log
   ```

3. **Look for:**
   ```
   PHP Parse error in zanobia-business-accounts.php
   ```

---

## 🔄 Step 5: Re-Upload Plugin

### **Clean Install:**

1. **Delete existing folder** (if any):
   ```
   /wp-content/plugins/zanobia-business-accounts/
   ```

2. **Create fresh folder:**
   - Name: `zanobia-business-accounts` (exactly!)
   - Location: `/wp-content/plugins/`

3. **Upload file inside folder:**
   - File: `zanobia-business-accounts.php`
   - Location: `/wp-content/plugins/zanobia-business-accounts/`

4. **Verify path:**
   ```
   /wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
   ```

5. **Refresh WordPress Admin:**
   - Go to: Plugins → Installed Plugins
   - Press: F5 to refresh page

---

## 📋 Step 6: Manual Plugin Header Check

### **Open the PHP file and verify first lines:**

```php
<?php
/**
 * Plugin Name: Zanobia Business Accounts
 * Plugin URI: https://zanobiaonline.com
 * Description: Custom role-based registration system...
 * Version: 1.0.0
 * Author: Zanobia Team
 */
```

**Requirements:**
- Must start with `<?php`
- Must have `Plugin Name:` header
- No spaces before `<?php`
- No BOM (byte order mark)

---

## 🎯 Step 7: Alternative Plugin Activation

### **Via WP-CLI (if available):**

```bash
# SSH into your server
wp plugin list
wp plugin activate zanobia-business-accounts
```

### **Via Database:**

```sql
# In phpMyAdmin
SELECT * FROM wp_options WHERE option_name = 'active_plugins';
# Manually add: zanobia-business-accounts/zanobia-business-accounts.php
```

---

## 🔍 Step 8: Check PHP Version

### **Required:** PHP 7.4 or higher

**Check in cPanel:**
```
cPanel → Select PHP Version
Ensure: 7.4 or 8.0+
```

**Or add to site root:**
```php
<?php phpinfo(); ?>
```

---

## 🚨 Common Issues & Fixes

### **Issue 1: Plugin folder wrong**

**Symptom:** No plugin appears

**Fix:**
```
Move from: /wp-content/plugins/zanobia-business-accounts.php
To: /wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
                                                   ↑ folder   ↑ file
```

---

### **Issue 2: File encoding problem**

**Symptom:** PHP error "unexpected character"

**Fix:**
- Re-save file as UTF-8 (no BOM)
- Use Notepad++, VS Code, or similar
- Encoding: UTF-8
- Line endings: Unix (LF)

---

### **Issue 3: File uploaded as .txt**

**Symptom:** File shows as `.php.txt`

**Fix:**
```
Rename file to: zanobia-business-accounts.php
Remove: .txt extension
Ensure: .php extension only
```

---

### **Issue 4: Cached plugin list**

**Symptom:** Plugin still not visible after upload

**Fix:**
```
WordPress Admin → Plugins
Press: Ctrl + F5 (hard refresh)
Or: Clear browser cache
Or: Try different browser
```

---

## 📂 Step 9: Verify File Contents

### **Check file size:**
```
Should be: ~20 KB (around 400 lines of PHP)
If 0 KB or very small: Re-upload
```

### **Check first line:**
```
Must start with: <?php
Not: < ?php (no space)
Not: <? (missing php)
```

### **Check last line:**
```
No closing ?> needed (it's optional and recommended to omit)
```

---

## 🔄 Step 10: Try ZIP Upload

### **Create ZIP:**

1. **On your computer:**
   ```
   Create folder: zanobia-business-accounts
   Put file inside: zanobia-business-accounts.php
   Right-click folder → Send to → Compressed (zipped) folder
   Result: zanobia-business-accounts.zip
   ```

2. **Upload via WordPress:**
   ```
   WordPress Admin → Plugins → Add New
   Click: "Upload Plugin"
   Choose: zanobia-business-accounts.zip
   Click: "Install Now"
   ```

---

## 📊 Checklist

### **Before Plugin Shows Up:**

- [ ] Folder created: `zanobia-business-accounts`
- [ ] Folder location: `/wp-content/plugins/`
- [ ] File inside folder: `zanobia-business-accounts.php`
- [ ] File permissions: 644
- [ ] Folder permissions: 755
- [ ] File starts with `<?php`
- [ ] Plugin header present
- [ ] No PHP syntax errors
- [ ] WordPress admin refreshed
- [ ] PHP version 7.4+

---

## 🎯 Quick Fix (Most Common Issue)

### **Problem: File uploaded to wrong location**

**Fix this:**
```
Current (wrong):
/wp-content/plugins/zanobia-business-accounts.php

Should be (correct):
/wp-content/plugins/zanobia-business-accounts/zanobia-business-accounts.php
                    ↑ create this folder first!
```

### **Steps:**

1. **In File Manager:**
   ```
   Go to: /wp-content/plugins/
   Click: "New Folder"
   Name: zanobia-business-accounts
   Enter folder
   Upload: zanobia-business-accounts.php
   ```

2. **Refresh WordPress Admin:**
   ```
   Plugins → Installed Plugins
   Press F5
   Plugin should appear!
   ```

---

## 📧 Still Not Working?

### **Share with me:**

1. **File Manager screenshot showing:**
   ```
   /wp-content/plugins/zanobia-business-accounts/
   ```

2. **First 10 lines of the PHP file:**
   ```
   Via cPanel → File Manager → Edit file
   Copy first 10 lines
   ```

3. **Any PHP errors:**
   ```
   Check: /wp-content/debug.log
   Or: cPanel → Errors
   ```

---

## ✅ Success Indicators

**When plugin is properly installed:**

✅ **In File Manager:**
```
/wp-content/plugins/
  └── zanobia-business-accounts/
      └── zanobia-business-accounts.php (20 KB)
```

✅ **In WordPress Admin:**
```
Plugins → Installed Plugins
Shows: "Zanobia Business Accounts"
Version: 1.0.0
Author: Zanobia Team
```

✅ **After Activation:**
```
Users → Add New → Role dropdown shows:
- Pending Business
- Business Verified
```

---

**Most likely fix: Create the `zanobia-business-accounts` FOLDER first, then upload the .php file INSIDE it!** 📁

