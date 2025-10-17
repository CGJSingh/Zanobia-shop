# 📋 Complete Setup Checklist - Bluehost CI/CD Deployment

**Read this BEFORE starting deployment!**

---

## 🎯 **What This Setup Does**

### ✅ **WILL HAPPEN:**
- React app deploys to: `/public_html/website_1b2a8b7a/`
- WordPress stays at: `/public_html/` (untouched)
- React app accessible at: `https://www.zanobiaonline.com/website_1b2a8b7a/`
- WordPress admin stays at: `https://www.zanobiaonline.com/wp-admin/`

### ❌ **WILL NOT HAPPEN:**
- Old WordPress site will NOT be replaced
- Root directory (`/public_html/`) stays untouched
- Existing files outside `website_1b2a8b7a/` folder remain unchanged
- No conflicts with WordPress

---

## 🔍 **Pre-Deployment Checklist**

### Before you start, verify:

- [ ] You have Bluehost cPanel login credentials
- [ ] WordPress is installed at `https://www.zanobiaonline.com/`
- [ ] You have FTP access to your hosting
- [ ] You can access: `https://www.zanobiaonline.com/wp-admin/`
- [ ] Your local build works: Run `npm run build` successfully
- [ ] You have GitHub account access
- [ ] Your code is pushed to GitHub: https://github.com/CGJSingh/Zanobia-shop

---

## 🎬 **Deployment Phases**

This setup has 3 main phases:

### **Phase 1: Get FTP Credentials** (5 minutes)
Get login details for automated deployment

### **Phase 2: Configure GitHub Secrets** (10 minutes)
Add credentials and API keys to GitHub

### **Phase 3: Deploy** (2 minutes)
Push code and watch automatic deployment

Total Time: **~17 minutes**

---

## 📦 **What Gets Deployed Where**

### Deployment Map:

```
GitHub Repository (CGJSingh/Zanobia-shop)
    ↓
    ├─ dist/ folder → /public_html/website_1b2a8b7a/ (React App)
    └─ wordpress-plugin/ → /wp-content/plugins/zanobia-business-accounts/ (Plugin)
```

### Files That Get Deployed:

#### To `/public_html/website_1b2a8b7a/`:
```
index.html              (React entry point)
assets/
  ├── index-[hash].js   (Your compiled React code)
  ├── index-[hash].css  (Your styles)
  └── ...
images/
  ├── logos/
  ├── banners/
  └── products/
.htaccess               (URL rewrite rules)
```

#### To `/wp-content/plugins/zanobia-business-accounts/`:
```
zanobia-business-accounts.php  (Main plugin file)
```

---

## 🛡️ **Safety Measures**

### Built-in Protections:

1. **Separate Directory**: React app is in its own folder
2. **No Clean Slate**: We DON'T delete existing files first
3. **Selective Upload**: Only uploads changed files
4. **WordPress Untouched**: Root directory stays intact
5. **Backup First**: You can backup before deployment

---

## ⚠️ **Important Notes**

### If You Want React App at ROOT:

If you want `https://www.zanobiaonline.com/` (root) to show React instead of WordPress:

**Option A: Keep Both (Recommended)**
- WordPress Admin: `https://www.zanobiaonline.com/wp-admin/`
- React Frontend: `https://www.zanobiaonline.com/`
- Requires: Moving WordPress to subfolder OR updating .htaccess

**Option B: WordPress Backend Only**
- Hide WordPress frontend
- Show React app at root
- WordPress only used as API/Admin

**Let me know if you want Option A or B and I'll provide instructions!**

### Current Setup:
- WordPress: Root (`/public_html/`)
- React: Subfolder (`/public_html/website_1b2a8b7a/`)

---

## 🎯 **Quick Decision Guide**

### Choose Your Setup:

#### **Setup 1: Keep Both Separate** (Current, Recommended)
- URL: `https://www.zanobiaonline.com/website_1b2a8b7a/`
- Pros: No conflicts, easy setup, both sites work
- Cons: React site has subfolder in URL

#### **Setup 2: React at Root, WordPress as Backend Only**
- URL: `https://www.zanobiaonline.com/`
- Pros: Clean URL for React site
- Cons: Requires .htaccess changes, slightly complex

**Which setup do you want?**
- If Setup 1: Continue with instructions below
- If Setup 2: Let me know, I'll create different deployment config

---

## ✅ **Proceed to Detailed Instructions**

Ready to start? Go to: **DEPLOYMENT_DETAILED_STEPS.md**

---

## 🆘 **Need Help?**

### Common Questions:

**Q: Will this break my WordPress site?**  
A: No! React app goes to separate folder. WordPress stays untouched.

**Q: Can I undo this?**  
A: Yes! Just delete the `website_1b2a8b7a` folder via cPanel File Manager.

**Q: What if deployment fails?**  
A: GitHub Actions will show error. Nothing changes on your server if it fails.

**Q: Do I need to stop WordPress?**  
A: No! Both can run simultaneously.

---

**Ready?** Let's go to the detailed step-by-step guide!

