# 🚀 Bluehost CI/CD Deployment Guide

Complete guide to deploy your React + WordPress project automatically to Bluehost using GitHub Actions.

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Setup GitHub Secrets](#setup-github-secrets)
3. [Configure Environment Variables](#configure-environment-variables)
4. [Deploy](#deploy)
5. [Troubleshooting](#troubleshooting)
6. [Manual Deployment Alternative](#manual-deployment-alternative)

---

## 🔧 **Prerequisites**

Before starting, ensure you have:

- ✅ GitHub repository set up (already done: `CGJSingh/Zanobia-shop`)
- ✅ Bluehost account with cPanel access
- ✅ FTP credentials from Bluehost
- ✅ WordPress installed at `https://www.zanobiaonline.com`
- ✅ Node.js 18+ installed locally

---

## 🔐 **Step 1: Get Your Bluehost FTP Credentials**

### A. Find Your FTP Details in cPanel:

1. **Login to Bluehost cPanel:**
   - Go to: https://my.bluehost.com
   - Click "Advanced" → "cPanel"

2. **Get FTP Server Address:**
   - Usually: `ftp.yourdomain.com` or `yourdomain.com`
   - For you: `ftp.zanobiaonline.com` or `zanobiaonline.com`

3. **Create FTP Account (Recommended):**
   - In cPanel, go to **"FTP Accounts"**
   - Click **"Create FTP Account"**
   - Fill in:
     - **Log in:** `github-deploy@zanobiaonline.com`
     - **Password:** (Generate strong password)
     - **Directory:** `/public_html/website_1b2a8b7a`
     - **Quota:** Unlimited
   - Click **"Create FTP Account"**
   - **Save these credentials securely!**

### B. Test FTP Connection:

Use FileZilla or command line to test:

```bash
# Test FTP connection
ftp ftp.zanobiaonline.com
# Enter username: github-deploy@zanobiaonline.com
# Enter password: [your-password]
```

If successful, you'll see the remote directory. Type `quit` to exit.

---

## 🔑 **Step 2: Setup GitHub Secrets**

GitHub Secrets store sensitive data securely. Never commit these to your repository!

### A. Add Secrets to GitHub:

1. **Go to your GitHub repository:**
   - https://github.com/CGJSingh/Zanobia-shop

2. **Navigate to Settings:**
   - Click **"Settings"** tab
   - Click **"Secrets and variables"** → **"Actions"**
   - Click **"New repository secret"**

3. **Add these secrets one by one:**

#### **FTP Credentials:**

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_SERVER` | Your FTP server | `ftp.zanobiaonline.com` |
| `FTP_USERNAME` | FTP username | `github-deploy@zanobiaonline.com` |
| `FTP_PASSWORD` | FTP password | `YourSecurePassword123!` |

#### **WooCommerce API Credentials:**

| Secret Name | Value |
|-------------|-------|
| `VITE_WOOCOMMERCE_URL` | `https://www.zanobiaonline.com/wp-json/wc/v3` |
| `VITE_WOOCOMMERCE_CONSUMER_KEY` | `ck_580fce9e40697dbadb614734d353b0a14123e67d` |
| `VITE_WOOCOMMERCE_CONSUMER_SECRET` | `cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9` |

#### **WordPress API Credentials:**

| Secret Name | Value |
|-------------|-------|
| `VITE_WORDPRESS_URL` | `https://www.zanobiaonline.com/wp-json/wp/v2` |
| `VITE_JWT_AUTH_URL` | `https://www.zanobiaonline.com/wp-json/jwt-auth/v1` |

#### **Stripe API Credentials (if using):**

| Secret Name | Value |
|-------------|-------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (your Stripe key) |

**⚠️ IMPORTANT:** Click "Add secret" after entering each one!

---

## 🌍 **Step 3: Configure Environment Variables**

### A. Local Development (.env.local):

Create `.env.local` in your project root for local development:

```env
# WooCommerce API
VITE_WOOCOMMERCE_URL=https://www.zanobiaonline.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_580fce9e40697dbadb614734d353b0a14123e67d
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9

# WordPress API
VITE_WORDPRESS_URL=https://www.zanobiaonline.com/wp-json/wp/v2
VITE_JWT_AUTH_URL=https://www.zanobiaonline.com/wp-json/jwt-auth/v1

# Stripe (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Site Info
VITE_SITE_NAME=Zanobia Shop
VITE_SITE_DESCRIPTION=Your trusted online destination for quality products
```

### B. Production (.env.production):

The GitHub Action automatically creates this from secrets during build.

### C. Update .gitignore:

Ensure these are in your `.gitignore`:

```gitignore
.env
.env.local
.env.production
.env.development
node_modules/
dist/
```

---

## 🚀 **Step 4: Deploy Your App**

### **Automatic Deployment (Recommended):**

Once you've set up GitHub Secrets, deployment is automatic!

```bash
# 1. Make sure all secrets are configured in GitHub

# 2. Commit and push your changes
git add .
git commit -m "Setup CI/CD deployment to Bluehost"
git push origin main

# 3. Watch the deployment
# Go to: https://github.com/CGJSingh/Zanobia-shop/actions
```

### **Manual Trigger Deployment:**

You can also trigger deployment manually:

1. Go to: https://github.com/CGJSingh/Zanobia-shop/actions
2. Click **"Deploy to Bluehost"** workflow
3. Click **"Run workflow"** button
4. Select **"main"** branch
5. Click **"Run workflow"**

### **What Happens During Deployment:**

```
1. ✅ Checkout your code from GitHub
2. ✅ Install Node.js and dependencies
3. ✅ Create .env.production with secrets
4. ✅ Build React app (npm run build)
5. ✅ Upload dist/ folder to Bluehost /public_html/website_1b2a8b7a/
6. ✅ Upload WordPress plugin to wp-content/plugins/
7. ✅ Notify success/failure
```

**Time:** Usually 2-5 minutes per deployment

---

## 🛠️ **Step 5: Verify Deployment**

After deployment completes:

### A. Check GitHub Actions:

1. Go to: https://github.com/CGJSingh/Zanobia-shop/actions
2. Look for green checkmark ✅ (success) or red X ❌ (failed)
3. Click on the workflow run to see detailed logs

### B. Check Your Live Site:

1. Visit: https://www.zanobiaonline.com/website_1b2a8b7a/
2. Check if Age Gate appears
3. Test navigation, products, cart, checkout
4. Check browser console (F12) for errors

### C. Verify WordPress Plugin:

1. Login to WordPress admin: https://www.zanobiaonline.com/wp-admin
2. Go to **Plugins** → **Installed Plugins**
3. Check if **"Zanobia Business Accounts"** is active
4. Test authentication features

---

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: Deployment Fails - FTP Connection Error**

**Error:** `Failed to connect to FTP server`

**Solution:**
- Verify FTP credentials in GitHub Secrets
- Check if FTP server is correct: `ftp.zanobiaonline.com`
- Test FTP connection manually using FileZilla
- Ensure Bluehost firewall allows GitHub Actions IPs
- Try using your domain as FTP server: `zanobiaonline.com`

### **Issue 2: Blank Page After Deployment**

**Error:** Website shows blank white page

**Solution:**
1. Check browser console (F12) for JavaScript errors
2. Verify environment variables are set in GitHub Secrets
3. Check if files were uploaded correctly via cPanel File Manager
4. Ensure `index.html` exists in `/public_html/website_1b2a8b7a/`
5. Check `.htaccess` configuration (see below)

### **Issue 3: 404 Errors on React Routes**

**Error:** Refreshing page shows 404

**Solution:**
Create `.htaccess` in `/public_html/website_1b2a8b7a/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /website_1b2a8b7a/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /website_1b2a8b7a/index.html [L]
</IfModule>
```

### **Issue 4: API Calls Failing (CORS)**

**Error:** `Access-Control-Allow-Origin` blocked

**Solution:**
Add to WordPress `wp-config.php` (before "That's all, stop editing!"):

```php
// Allow CORS for React frontend
header("Access-Control-Allow-Origin: https://www.zanobiaonline.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

Or install **"WP CORS"** plugin and whitelist your domain.

### **Issue 5: Environment Variables Not Working**

**Error:** `undefined` when accessing `import.meta.env.VITE_*`

**Solution:**
1. Ensure secrets are named exactly: `VITE_WOOCOMMERCE_URL` (case-sensitive)
2. Rebuild the app after adding secrets
3. Check GitHub Actions logs to see if .env.production was created
4. Verify secrets don't have extra spaces or quotes

### **Issue 6: Build Fails - Out of Memory**

**Error:** `JavaScript heap out of memory`

**Solution:**
Add to workflow before build step:

```yaml
- name: Increase Node memory
  run: export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 📁 **Directory Structure on Bluehost**

After deployment, your Bluehost server should look like this:

```
/public_html/
├── website_1b2a8b7a/           # Your React app (DEPLOYED HERE)
│   ├── index.html              # Main HTML file
│   ├── assets/                 # JS, CSS bundles
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   ├── images/                 # Static images
│   └── .htaccess              # URL rewrite rules
│
├── wp-admin/                   # WordPress admin
├── wp-content/
│   ├── plugins/
│   │   └── zanobia-business-accounts/  # Your custom plugin (DEPLOYED HERE)
│   └── themes/
├── wp-includes/
└── wp-config.php              # WordPress configuration
```

---

## 🔄 **Alternative: Manual Deployment (Backup Method)**

If GitHub Actions doesn't work, deploy manually:

### **Option A: Build Locally + Upload via FTP**

```bash
# 1. Build locally
npm run build

# 2. Upload dist/ folder to Bluehost
# Use FileZilla or cPanel File Manager
# Upload to: /public_html/website_1b2a8b7a/
```

### **Option B: Build Locally + cPanel File Manager**

1. Build locally: `npm run build`
2. Compress `dist` folder to `dist.zip`
3. Login to cPanel → File Manager
4. Navigate to `/public_html/website_1b2a8b7a/`
5. Upload `dist.zip`
6. Extract zip file
7. Move contents of `dist/` to parent directory
8. Delete `dist/` folder and `dist.zip`

---

## 📊 **Monitoring & Maintenance**

### **Monitor Deployments:**
- GitHub Actions tab: https://github.com/CGJSingh/Zanobia-shop/actions
- Get email notifications for failed deployments

### **Best Practices:**

1. **Test Locally First:**
   ```bash
   npm run dev  # Test development
   npm run build && npm run preview  # Test production build
   ```

2. **Use Branches:**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create Pull Request
   # Merge to main → Auto deploys
   ```

3. **Monitor Logs:**
   - Check GitHub Actions logs after each deployment
   - Monitor WordPress error logs in cPanel

4. **Backup Regularly:**
   - Use Bluehost's automatic backups
   - Keep local copies of your database

---

## 🎯 **Why GitHub Actions + FTP is Best for Bluehost**

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **GitHub Actions + FTP** ✅ | Free, Automated, Version controlled, Logs | Requires FTP setup | **RECOMMENDED** |
| Manual FTP Upload | Simple, Direct | Manual, Error-prone, No CI/CD | Emergency fixes |
| cPanel File Manager | No FTP needed | Very manual, Slow | One-time uploads |
| Git on Bluehost | Native Git | Requires SSH (not on shared hosting) | VPS/Dedicated only |

---

## 📞 **Need Help?**

1. **Check GitHub Actions logs** for detailed error messages
2. **Check browser console** (F12) for frontend errors
3. **Check WordPress debug log** (enable in wp-config.php)
4. **Contact Bluehost support** for server-side issues

---

## ✅ **Quick Checklist**

Before deploying, ensure:

- [ ] GitHub Secrets configured (8 secrets total)
- [ ] FTP credentials tested and working
- [ ] Local build succeeds: `npm run build`
- [ ] `.htaccess` configured for React Router
- [ ] WordPress CORS configured
- [ ] Environment variables set correctly
- [ ] Workflow file committed to GitHub
- [ ] Pushed to `main` branch

---

## 🎉 **You're All Set!**

Once configured, every push to `main` branch automatically:
1. Builds your React app
2. Deploys to Bluehost
3. Updates WordPress plugin
4. Goes live in 2-5 minutes

**Your live site:** https://www.zanobiaonline.com/website_1b2a8b7a/

---

**Questions?** Check the troubleshooting section or review the GitHub Actions logs for detailed error messages.

