# ⚡ Quick Start: Deploy to Bluehost in 5 Minutes

**Fast setup guide for impatient developers!** 🚀

---

## ✅ **Pre-Flight Checklist** (Do this first!)

```bash
# 1. Verify your build works locally
npm install
npm run build
npm run preview  # Visit http://localhost:4173

# 2. Check your code is committed
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🔐 **Step 1: Get FTP Credentials** (2 minutes)

### Quick Method:

1. **Login:** https://my.bluehost.com → cPanel
2. **Search:** Type "FTP" in search bar
3. **Click:** "FTP Accounts"
4. **Create Account:**
   - Username: `github-deploy`
   - Password: (Generate strong password - SAVE IT!)
   - Directory: `/public_html/website_1b2a8b7a`
   - Quota: Unlimited
5. **Save Credentials:**
   ```
   FTP Server: ftp.zanobiaonline.com
   Username: github-deploy@zanobiaonline.com
   Password: [the password you just created]
   ```

---

## 🔑 **Step 2: Add GitHub Secrets** (3 minutes)

Go to: https://github.com/CGJSingh/Zanobia-shop/settings/secrets/actions

Click **"New repository secret"** and add these **8 secrets**:

### FTP Secrets:
```
Name: FTP_SERVER
Value: ftp.zanobiaonline.com

Name: FTP_USERNAME  
Value: github-deploy@zanobiaonline.com

Name: FTP_PASSWORD
Value: [your FTP password from Step 1]
```

### API Secrets:
```
Name: VITE_WOOCOMMERCE_URL
Value: https://www.zanobiaonline.com/wp-json/wc/v3

Name: VITE_WOOCOMMERCE_CONSUMER_KEY
Value: ck_580fce9e40697dbadb614734d353b0a14123e67d

Name: VITE_WOOCOMMERCE_CONSUMER_SECRET
Value: cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9

Name: VITE_WORDPRESS_URL
Value: https://www.zanobiaonline.com/wp-json/wp/v2

Name: VITE_JWT_AUTH_URL
Value: https://www.zanobiaonline.com/wp-json/jwt-auth/v1
```

**💡 Tip:** Copy-paste carefully! No extra spaces or quotes!

---

## 🚀 **Step 3: Deploy!** (30 seconds)

```bash
# Push to trigger deployment
git push origin main
```

**Watch deployment:** https://github.com/CGJSingh/Zanobia-shop/actions

Wait 2-5 minutes ⏳

**✅ Done!** Visit: https://www.zanobiaonline.com/website_1b2a8b7a/

---

## 🔥 **One-Line Deployment** (After initial setup)

```bash
git add . && git commit -m "Update" && git push
```

That's it! Every push automatically deploys! 🎉

---

## ⚠️ **If Something Goes Wrong**

### Deployment Failed?

1. **Check GitHub Actions:**
   - https://github.com/CGJSingh/Zanobia-shop/actions
   - Click on the failed run
   - Look for red error messages

2. **Common Fixes:**
   ```bash
   # FTP connection failed?
   → Double-check FTP_SERVER, FTP_USERNAME, FTP_PASSWORD in GitHub Secrets
   
   # Build failed?
   → Test locally: npm run build
   
   # Blank page after deployment?
   → Check browser console (F12)
   → Verify environment variables in GitHub Secrets
   ```

### Manual Deployment (Emergency):

```bash
# Build locally
npm run build

# Upload dist/ folder to Bluehost via FileZilla:
# Host: ftp.zanobiaonline.com
# Upload to: /public_html/website_1b2a8b7a/
```

---

## 📊 **Monitoring**

- **Deployment Status:** https://github.com/CGJSingh/Zanobia-shop/actions
- **Live Site:** https://www.zanobiaonline.com/website_1b2a8b7a/
- **WordPress Admin:** https://www.zanobiaonline.com/wp-admin

---

## 🎯 **Next Push = Auto Deploy**

From now on, just:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# ✨ Automatically builds and deploys to Bluehost!
```

---

## 💡 **Pro Tips**

1. **Test before pushing:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Use branches for features:**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create PR → Merge to main → Auto deploys
   ```

3. **Monitor build logs:**
   - Always check Actions tab after pushing
   - Green checkmark = success ✅
   - Red X = failed ❌

---

## 📞 **Need Full Guide?**

Read: [`BLUEHOST_DEPLOYMENT_GUIDE.md`](./BLUEHOST_DEPLOYMENT_GUIDE.md)

---

**That's it! You're live! 🎉**

