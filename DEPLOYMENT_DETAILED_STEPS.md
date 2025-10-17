# 🚀 COMPLETE Deployment Guide - Every Single Step

**Follow this guide EXACTLY. Each step has substeps with screenshots descriptions.**

---

## 📋 **Before Starting**

### Required Information (Have these ready):

- [ ] Bluehost email and password
- [ ] GitHub username: `CGJSingh`
- [ ] GitHub password or access
- [ ] Notepad open for saving credentials

### Estimated Time: **20-30 minutes**

---

# PHASE 1: GET FTP CREDENTIALS (10 minutes)

## 🔐 **STEP 1.1: Login to Bluehost**

### **Substep 1.1.1: Go to Bluehost**
1. Open your web browser (Chrome/Firefox/Edge)
2. Type in address bar: `https://my.bluehost.com`
3. Press Enter

### **Substep 1.1.2: Enter Login Credentials**
1. You'll see a page with:
   - Large blue "Log In" button
   - Email/Username field
   - Password field
2. Enter your Bluehost email address
3. Enter your Bluehost password
4. Click the blue "Log In" button

### **Substep 1.1.3: Navigate to cPanel**
1. After login, you'll see the Bluehost dashboard
2. Look for a button/link that says "Advanced" or "cPanel"
   - Usually at top right or in "Advanced" tab
3. Click on "Advanced" or "cPanel"
4. You'll see a new page with lots of icons (the cPanel interface)

**✅ Checkpoint:** You should now see many icons (File Manager, FTP Accounts, etc.)

---

## 📁 **STEP 1.2: Create FTP Account**

### **Substep 1.2.1: Find FTP Accounts**
1. In cPanel, look at the top for a search box
2. Type: `FTP`
3. You'll see "FTP Accounts" appear
4. Click on "FTP Accounts"

**Alternative:**
- Scroll down in cPanel
- Find section called "FILES"
- Click "FTP Accounts" icon

### **Substep 1.2.2: Create New FTP Account**

You'll see a page titled "FTP Accounts"

**Form Fields (Fill these EXACTLY):**

1. **Log In field:**
   ```
   github-deploy
   ```
   
2. **Domain dropdown:**
   - Select: `zanobiaonline.com` (or your domain)
   
3. **Password field:**
   - Click "Password Generator" button
   - A popup will appear
   - Click "Use Password" button
   - **IMPORTANT:** Copy this password immediately!
   - **Paste it into Notepad** (you'll need it later)
   - Or create your own strong password (min 12 characters)

4. **Directory field:**
   - **DELETE** whatever is there
   - Type EXACTLY:
   ```
   /public_html/website_1b2a8b7a
   ```
   - Make sure there's NO trailing slash
   - Make sure path is EXACTLY as shown

5. **Quota field:**
   - Select: "Unlimited"
   - Or type: `9999999` (unlimited)

### **Substep 1.2.3: Save FTP Account**
1. Double-check all fields are correct
2. Click blue "Create FTP Account" button at bottom
3. Wait for success message: "FTP account created successfully"

### **Substep 1.2.4: Copy FTP Credentials**

**Open Notepad and save these:**

```
FTP_SERVER: ftp.zanobiaonline.com
FTP_USERNAME: github-deploy@zanobiaonline.com
FTP_PASSWORD: [the password you generated]
```

**Alternative FTP Server formats (if first doesn't work):**
- `zanobiaonline.com`
- `ftp.yourdomain.com`
- Check your Bluehost email for FTP server address

**✅ Checkpoint:** You have 3 pieces of information in Notepad

---

## 🧪 **STEP 1.3: Test FTP Connection (Optional but Recommended)**

### **Substep 1.3.1: Download FileZilla**
1. Go to: https://filezilla-project.org/download.php?type=client
2. Download FileZilla Client (free)
3. Install it

### **Substep 1.3.2: Test Connection**
1. Open FileZilla
2. At the top, you'll see fields:
   - **Host:** Enter `ftp.zanobiaonline.com`
   - **Username:** Enter `github-deploy@zanobiaonline.com`
   - **Password:** Enter your FTP password
   - **Port:** Leave blank or enter `21`
3. Click "Quickconnect" button
4. If successful, you'll see files in `/public_html/website_1b2a8b7a/` folder

**If connection fails:**
- Try `zanobiaonline.com` as host instead
- Check password was copied correctly
- Contact Bluehost support

**✅ Checkpoint:** FileZilla shows "Directory listing successful"

---

# PHASE 2: CONFIGURE GITHUB SECRETS (10 minutes)

## 🔑 **STEP 2.1: Open GitHub Repository**

### **Substep 2.1.1: Login to GitHub**
1. Open new browser tab
2. Go to: `https://github.com`
3. Click "Sign in" at top right
4. Enter GitHub credentials
5. Click "Sign in"

### **Substep 2.1.2: Navigate to Your Repository**
1. After login, click your profile icon (top right)
2. Click "Your repositories"
3. Find and click: `Zanobia-shop`

**OR Direct Link:**
- Go to: `https://github.com/CGJSingh/Zanobia-shop`

**✅ Checkpoint:** You see your repository with files listed

---

## 🔐 **STEP 2.2: Open Settings**

### **Substep 2.2.1: Go to Repository Settings**
1. In your repository, look at the tabs below the repository name
2. You'll see: `Code`, `Issues`, `Pull requests`, etc.
3. Click on `Settings` tab (far right, may need to scroll tabs)

**Note:** If you don't see Settings tab:
- You're not the owner
- Or not logged in correctly

### **Substep 2.2.2: Navigate to Secrets**
1. On the Settings page, look at left sidebar
2. Find section called "Security"
3. Under Security, click: `Secrets and variables`
4. A submenu appears
5. Click: `Actions`

**✅ Checkpoint:** You see page titled "Actions secrets and variables"

---

## 🔧 **STEP 2.3: Add Secrets ONE BY ONE**

### **How to Add Each Secret:**

1. Click green "New repository secret" button
2. Enter the Name (EXACTLY as shown, case-sensitive)
3. Enter the Value (copy from your Notepad or below)
4. Click "Add secret" button
5. Repeat for each secret

---

### **SECRET #1: FTP_SERVER**

**Click "New repository secret"**

```
Name: FTP_SERVER
Value: ftp.zanobiaonline.com
```

- **Name field:** Type `FTP_SERVER` (all caps, underscore)
- **Value field:** Type `ftp.zanobiaonline.com`
- Click "Add secret"
- You'll return to secrets list
- You should see `FTP_SERVER` in the list

---

### **SECRET #2: FTP_USERNAME**

**Click "New repository secret"** again

```
Name: FTP_USERNAME
Value: github-deploy@zanobiaonline.com
```

- **Name:** `FTP_USERNAME`
- **Value:** `github-deploy@zanobiaonline.com`
- Click "Add secret"

---

### **SECRET #3: FTP_PASSWORD**

**Click "New repository secret"** again

```
Name: FTP_PASSWORD
Value: [YOUR FTP PASSWORD FROM STEP 1.2.4]
```

- **Name:** `FTP_PASSWORD`
- **Value:** Paste your FTP password from Notepad
- **IMPORTANT:** Make sure no extra spaces before/after password
- Click "Add secret"

---

### **SECRET #4: VITE_WOOCOMMERCE_URL**

**Click "New repository secret"** again

```
Name: VITE_WOOCOMMERCE_URL
Value: https://www.zanobiaonline.com/wp-json/wc/v3
```

- **Name:** `VITE_WOOCOMMERCE_URL`
- **Value:** `https://www.zanobiaonline.com/wp-json/wc/v3`
- Click "Add secret"

---

### **SECRET #5: VITE_WOOCOMMERCE_CONSUMER_KEY**

**Click "New repository secret"** again

```
Name: VITE_WOOCOMMERCE_CONSUMER_KEY
Value: ck_580fce9e40697dbadb614734d353b0a14123e67d
```

- **Name:** `VITE_WOOCOMMERCE_CONSUMER_KEY`
- **Value:** `ck_580fce9e40697dbadb614734d353b0a14123e67d`
- Click "Add secret"

---

### **SECRET #6: VITE_WOOCOMMERCE_CONSUMER_SECRET**

**Click "New repository secret"** again

```
Name: VITE_WOOCOMMERCE_CONSUMER_SECRET
Value: cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9
```

- **Name:** `VITE_WOOCOMMERCE_CONSUMER_SECRET`
- **Value:** `cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9`
- Click "Add secret"

---

### **SECRET #7: VITE_WORDPRESS_URL**

**Click "New repository secret"** again

```
Name: VITE_WORDPRESS_URL
Value: https://www.zanobiaonline.com/wp-json/wp/v2
```

- **Name:** `VITE_WORDPRESS_URL`
- **Value:** `https://www.zanobiaonline.com/wp-json/wp/v2`
- Click "Add secret"

---

### **SECRET #8: VITE_JWT_AUTH_URL**

**Click "New repository secret"** again

```
Name: VITE_JWT_AUTH_URL
Value: https://www.zanobiaonline.com/wp-json/jwt-auth/v1
```

- **Name:** `VITE_JWT_AUTH_URL`
- **Value:** `https://www.zanobiaonline.com/wp-json/jwt-auth/v1`
- Click "Add secret"

---

### **Substep 2.3.1: Verify All Secrets Added**

**Count your secrets:**

You should see exactly **8 secrets** in the list:
1. `FTP_SERVER`
2. `FTP_USERNAME`
3. `FTP_PASSWORD`
4. `VITE_WOOCOMMERCE_URL`
5. `VITE_WOOCOMMERCE_CONSUMER_KEY`
6. `VITE_WOOCOMMERCE_CONSUMER_SECRET`
7. `VITE_WORDPRESS_URL`
8. `VITE_JWT_AUTH_URL`

**✅ Checkpoint:** All 8 secrets are visible in the list

---

# PHASE 3: DEPLOY YOUR APPLICATION (5 minutes)

## 🚀 **STEP 3.1: Trigger Deployment**

### **Substep 3.1.1: Go to Actions Tab**
1. In your GitHub repository, click the "Actions" tab
2. It's near the top, between "Pull requests" and "Projects"
3. You'll see a page showing workflows

### **Substep 3.1.2: Find Your Workflow**
1. On the left sidebar, you'll see:
   - "All workflows"
   - "Deploy to Bluehost" (this is your workflow)
2. Click on "Deploy to Bluehost"

### **Substep 3.1.3: Run Workflow Manually**
1. You'll see a page with workflow runs (might be empty)
2. Above the list, look for a blue banner that says:
   - "This workflow has a workflow_dispatch event trigger"
3. On the right side of that banner, there's a button: "Run workflow"
4. Click "Run workflow" button
5. A dropdown appears:
   - Branch: `main` (should be selected)
6. Click the green "Run workflow" button in the dropdown

**✅ Checkpoint:** You see "Workflow run was successfully queued"

---

## 📊 **STEP 3.2: Monitor Deployment**

### **Substep 3.2.1: Watch the Build**
1. The page will refresh automatically
2. You'll see a new item in the list with a yellow dot 🟡
3. Status will be "In progress"
4. Click on the workflow run to see details

### **Substep 3.2.2: View Build Steps**
1. Click on "build-and-deploy" job
2. You'll see a list of steps running:
   ```
   ✓ Checkout code
   ✓ Setup Node.js
   ✓ Install dependencies
   ✓ Create .env.production
   ✓ Build React app
   ⏳ Deploy to Bluehost (this takes longest, 2-4 min)
   ```

### **Substep 3.2.3: Wait for Completion**
- **Normal duration:** 3-5 minutes
- **Yellow dot 🟡:** In progress
- **Green checkmark ✓:** Success!
- **Red X ✗:** Failed (see troubleshooting)

**✅ Checkpoint:** All steps show green checkmarks ✓

---

## 🎉 **STEP 3.3: Verify Deployment**

### **Substep 3.3.1: Check GitHub Status**
1. After workflow completes, you should see:
   - "This workflow run completed successfully"
   - Green checkmark next to "build-and-deploy"
2. Look for "Deployment Success" step
3. It will show: "✅ Deployment to Bluehost successful!"

### **Substep 3.3.2: Visit Your Live Site**
1. Open a new browser tab
2. Go to: `https://www.zanobiaonline.com/website_1b2a8b7a/`
3. Wait for page to load (might take 10-30 seconds first time)

**What you should see:**
- Age Gate screen (black/white split, rotating logo)
- Two buttons: "Yes, Enter" and "No, I'm not"

**If you see blank page:**
- Wait 1 minute and refresh
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12 → Console tab)

### **Substep 3.3.3: Test the Application**
1. Click "Yes, Enter" on Age Gate
2. You should see the home page with:
   - Header with logo and navigation
   - Hero section
   - Product listings
3. Test navigation:
   - Click "Products" in menu
   - Click on a product
   - Add item to cart
4. Check browser console (F12):
   - Should be no red errors
   - Some warnings are OK

**✅ Checkpoint:** Site loads and Age Gate works

---

# PHASE 4: CONFIGURE WORDPRESS (5 minutes)

## 🔧 **STEP 4.1: Enable WordPress Plugin**

### **Substep 4.1.1: Login to WordPress Admin**
1. Go to: `https://www.zanobiaonline.com/wp-admin/`
2. Enter WordPress username and password
3. Click "Log In"

### **Substep 4.1.2: Navigate to Plugins**
1. In WordPress dashboard, look at left sidebar
2. Hover over "Plugins"
3. Click "Installed Plugins"

### **Substep 4.1.3: Activate Plugin**
1. Find "Zanobia Business Accounts" in the list
2. If it says "Activate" - click "Activate"
3. If it says "Deactivate" - it's already active, skip this
4. If you don't see it:
   - The deployment may have failed for the plugin
   - Check GitHub Actions logs
   - Or upload plugin manually (see troubleshooting)

**✅ Checkpoint:** Plugin shows "Deactivate" (meaning it's active)

---

## 🌐 **STEP 4.2: Configure CORS (Critical for API)**

### **Substep 4.2.1: Open File Manager**
1. Go back to Bluehost cPanel (https://my.bluehost.com → cPanel)
2. Find "File Manager" icon
3. Click "File Manager"

### **Substep 4.2.2: Navigate to WordPress Root**
1. In File Manager, click "public_html" folder in left sidebar
2. You'll see all WordPress files

### **Substep 4.2.3: Edit wp-config.php**
1. Find file named `wp-config.php`
2. Right-click on `wp-config.php`
3. Click "Edit"
4. A popup appears: "Text Editor"
5. Click "Edit" button

### **Substep 4.2.4: Add CORS Headers**
1. Scroll to the bottom of the file
2. Find this line:
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```
3. **ABOVE that line**, add this code:

```php
// Enable CORS for React frontend
header("Access-Control-Allow-Origin: https://www.zanobiaonline.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

4. Click "Save Changes" button (top right)
5. Close the editor

**✅ Checkpoint:** File saved successfully

---

## 🔒 **STEP 4.3: Enable JWT Authentication**

### **Substep 4.3.1: Edit .htaccess**
1. In File Manager, find `.htaccess` file
   - **Note:** If you don't see it:
     - Click "Settings" (top right of File Manager)
     - Check "Show Hidden Files (dotfiles)"
     - Click "Save"
2. Right-click `.htaccess`
3. Click "Edit"

### **Substep 4.3.2: Add JWT Rules**
1. Scroll to the top of the file
2. Add this code at the VERY TOP:

```apache
# Enable JWT Authentication
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]

SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

3. Click "Save Changes"
4. Close editor

**✅ Checkpoint:** .htaccess updated

---

# PHASE 5: FINAL VERIFICATION (5 minutes)

## ✅ **STEP 5.1: Complete Testing**

### **Substep 5.1.1: Test All Pages**

Visit these URLs and verify they work:

1. **Home Page:**
   - URL: `https://www.zanobiaonline.com/website_1b2a8b7a/`
   - Should show: Hero section, products

2. **Products Page:**
   - URL: `https://www.zanobiaonline.com/website_1b2a8b7a/products`
   - Should show: Product grid with WooCommerce products

3. **Product Detail:**
   - Click any product
   - Should show: Product details, Add to Cart button

4. **Cart:**
   - Add item to cart
   - Click cart icon
   - Should show: Cart items

5. **Login:**
   - URL: `https://www.zanobiaonline.com/website_1b2a8b7a/login`
   - Should show: Login form

### **Substep 5.1.2: Test API Connection**
1. Open browser console (F12)
2. Go to "Network" tab
3. Refresh the home page
4. Look for requests to:
   - `wp-json/wc/v3/products` (should return 200)
   - Check Response tab: Should show product data

**If you see 401 or 403 errors:**
- CORS not configured correctly
- Check wp-config.php CORS headers
- Check WooCommerce API keys

### **Substep 5.1.3: Test on Mobile**
1. Open site on your phone
2. Test navigation
3. Test product browsing
4. Test cart functionality

**✅ Checkpoint:** Everything works!

---

# 🎯 AUTOMATIC DEPLOYMENT SETUP COMPLETE!

## 📋 **What You've Accomplished:**

✅ FTP account created for GitHub Actions  
✅ GitHub Secrets configured (8 secrets)  
✅ CI/CD pipeline active  
✅ React app deployed to Bluehost  
✅ WordPress plugin deployed  
✅ CORS configured for API access  
✅ JWT authentication enabled  
✅ Site is LIVE!  

---

## 🚀 **From Now On:**

### **To Deploy New Changes:**

```bash
# 1. Make your changes locally
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Your update message"
git push origin main

# 4. Wait 3-5 minutes
# 5. Changes are LIVE automatically!
```

**That's it!** No manual uploads, no FTP client needed!

---

## 📊 **Monitoring Deployments:**

### **Check Deployment Status:**
1. Go to: https://github.com/CGJSingh/Zanobia-shop/actions
2. See all deployments (green = success, red = failed)
3. Click any deployment to see logs

### **Get Email Notifications:**
1. GitHub → Settings → Notifications
2. Enable "Actions" notifications
3. Get email when deployment fails

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Deployment Failed**

**Step 1:** Check GitHub Actions logs
1. Go to Actions tab
2. Click failed workflow
3. Click "build-and-deploy" job
4. Find step with red X
5. Read error message

**Common Errors:**

**Error: "Login authentication failed"**
- Solution: Check FTP_USERNAME and FTP_PASSWORD secrets
- Verify FTP account still exists in cPanel

**Error: "npm run build failed"**
- Solution: Test build locally first: `npm run build`
- Fix any errors in your code
- Push fixed code

**Error: "Connection timeout"**
- Solution: Bluehost firewall blocking GitHub IPs
- Contact Bluehost support: "Please allow GitHub Actions IPs for FTP"

---

### **Problem: Blank Page After Deployment**

**Step 1:** Check browser console
- Press F12
- Go to Console tab
- Look for red errors

**Common Issues:**

**"Failed to fetch" or CORS error:**
- Solution: Check wp-config.php CORS headers
- Verify WordPress URL in secrets

**"undefined" environment variables:**
- Solution: Check all 8 GitHub Secrets are set
- Trigger new deployment: Actions → Run workflow

**404 errors on page refresh:**
- Solution: Check .htaccess exists in `/public_html/website_1b2a8b7a/`
- Verify .htaccess has correct RewriteBase

---

### **Problem: Products Not Loading**

**Step 1:** Check WooCommerce API
1. Visit: `https://www.zanobiaonline.com/wp-json/wc/v3/products`
2. You should see JSON product data

**If you get error:**
- Check WooCommerce API keys are correct
- Verify WooCommerce plugin is active
- Check permalink settings: Settings → Permalinks → "Post name"

---

### **Problem: Login Not Working**

**Step 1:** Check JWT plugin
1. WordPress admin → Plugins
2. Verify "JWT Authentication for WP REST API" is installed and active

**If not installed:**
1. Go to Plugins → Add New
2. Search: "JWT Authentication for WP REST API"
3. Install and Activate

**Step 2:** Check .htaccess has JWT rules
- Follow Step 4.3 again

---

## 📞 **Getting Help**

### **Check These Resources:**

1. **GitHub Actions Logs:**
   - https://github.com/CGJSingh/Zanobia-shop/actions
   - Most detailed error information

2. **Browser Console:**
   - Press F12 on your site
   - Check for JavaScript errors

3. **WordPress Error Log:**
   - cPanel → File Manager
   - Check `/public_html/wp-content/debug.log`

4. **Bluehost Support:**
   - Chat: https://my.bluehost.com/cgi/help
   - Phone: Call Bluehost support
   - Ask: "Need help with FTP access for GitHub Actions"

---

## ✅ **Final Checklist**

Before closing this guide, verify:

- [ ] Site loads at: https://www.zanobiaonline.com/website_1b2a8b7a/
- [ ] Age Gate appears and works
- [ ] Products load from WooCommerce
- [ ] Cart functionality works
- [ ] Login page accessible
- [ ] GitHub Actions shows green checkmark
- [ ] All 8 secrets configured in GitHub
- [ ] WordPress plugin active
- [ ] CORS headers added to wp-config.php
- [ ] JWT rules added to .htaccess

---

## 🎉 **CONGRATULATIONS!**

You've successfully set up:
- ✅ Automated CI/CD pipeline
- ✅ React frontend deployed
- ✅ WordPress backend integrated
- ✅ Automatic deployments on every push

**You're live and ready to scale!** 🚀

---

**Need more help?** Refer to `BLUEHOST_DEPLOYMENT_GUIDE.md` for additional troubleshooting.

