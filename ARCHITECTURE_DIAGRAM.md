# 🏗️ Architecture Diagram - How Everything Works Together

**Visual explanation of your deployment setup**

---

## 📐 **Complete System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    YOUR LOCAL COMPUTER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  D:\Zanobia\website\my-shop\                             │  │
│  │                                                          │  │
│  │  - src/           (React source code)                   │  │
│  │  - public/        (Static assets)                       │  │
│  │  - wordpress-plugin/  (Custom plugin)                   │  │
│  │  - package.json   (Dependencies)                        │  │
│  │                                                          │  │
│  │  Commands:                                              │  │
│  │  $ npm run dev    (Test locally on port 3000)          │  │
│  │  $ npm run build  (Create production build)            │  │
│  │  $ git push       (Deploy to production)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ git push                         │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘

                               │
                               │
                               ▼

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          GITHUB                                 │
│                 github.com/CGJSingh/Zanobia-shop                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Repository Contents:                                    │  │
│  │  ✓ All source code                                       │  │
│  │  ✓ .github/workflows/deploy-bluehost.yml               │  │
│  │  ✓ Documentation files                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ Triggers                         │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GitHub Actions (CI/CD Pipeline)                         │  │
│  │                                                          │  │
│  │  Workflow Steps:                                         │  │
│  │  1️⃣  Checkout code from repository                      │  │
│  │  2️⃣  Setup Node.js environment                          │  │
│  │  3️⃣  npm install (Install dependencies)                 │  │
│  │  4️⃣  Create .env.production from secrets                │  │
│  │  5️⃣  npm run build (Build React app)                    │  │
│  │  6️⃣  Upload dist/ to Bluehost via FTP                   │  │
│  │  7️⃣  Upload WordPress plugin via FTP                    │  │
│  │  8️⃣  Notify deployment success/failure                  │  │
│  │                                                          │  │
│  │  Time: 3-5 minutes per deployment                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ FTP Upload                       │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘

                               │
                               │
                               ▼

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    BLUEHOST SERVER                              │
│                  www.zanobiaonline.com                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /public_html/                                           │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  WordPress Backend (UNTOUCHED)                     │ │  │
│  │  │  ────────────────────────────────                  │ │  │
│  │  │  • index.php                                       │ │  │
│  │  │  • wp-admin/      (Admin dashboard)               │ │  │
│  │  │  • wp-content/    (Themes, plugins, uploads)      │ │  │
│  │  │  • wp-includes/   (WordPress core)                │ │  │
│  │  │  • wp-config.php  (Configuration + CORS headers)  │ │  │
│  │  │                                                    │ │  │
│  │  │  URL: https://www.zanobiaonline.com/wp-admin/     │ │  │
│  │  │  API: https://www.zanobiaonline.com/wp-json/      │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  React Frontend (DEPLOYED HERE)                    │ │  │
│  │  │  ───────────────────────────                       │ │  │
│  │  │  /public_html/website_1b2a8b7a/                    │ │  │
│  │  │                                                    │ │  │
│  │  │  • index.html        (Entry point)                │ │  │
│  │  │  • assets/           (JS, CSS bundles)            │ │  │
│  │  │  •   ├─ index.[hash].js                           │ │  │
│  │  │  •   └─ index.[hash].css                          │ │  │
│  │  │  • images/           (Static images)              │ │  │
│  │  │  • .htaccess         (Router config)              │ │  │
│  │  │                                                    │ │  │
│  │  │  URL: https://www.zanobiaonline.com/website_.../ │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Custom WordPress Plugin                           │ │  │
│  │  │  ───────────────────────────────                  │ │  │
│  │  │  /wp-content/plugins/zanobia-business-accounts/   │ │  │
│  │  │                                                    │ │  │
│  │  │  • zanobia-business-accounts.php                  │ │  │
│  │  │  • Handles: User registration, business accounts  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                               │
                               │ Accessed by users
                               ▼

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      USERS / VISITORS                           │
│                                                                 │
│  Browser requests:                                              │
│  ────────────────────────────────────────────────────────────  │
│                                                                 │
│  🌐 https://www.zanobiaonline.com/website_1b2a8b7a/            │
│     └─> Serves React App (HTML, JS, CSS)                       │
│         └─> React makes API calls to WordPress                 │
│                                                                 │
│  🔌 API Requests:                                               │
│     └─> https://www.zanobiaonline.com/wp-json/wc/v3/products  │
│         └─> Returns product data (JSON)                        │
│                                                                 │
│  🔐 Authentication:                                             │
│     └─> https://www.zanobiaonline.com/wp-json/jwt-auth/v1/... │
│         └─> Returns JWT token                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Data Flow Diagram**

```
User visits site
      │
      ▼
┌─────────────────┐
│  Age Gate       │  (React Component)
│  Check age      │
└────────┬────────┘
         │ User clicks "Yes"
         ▼
┌─────────────────┐
│  Home Page      │  (React Component)
│  Load products  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  API Call: GET /wp-json/wc/v3/products  │
│  Authentication: Consumer Key/Secret    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  WordPress      │
│  WooCommerce    │  (Backend)
│  Returns JSON   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Updates  │
│  Display        │  (Frontend)
│  Products       │
└─────────────────┘
```

---

## 🗂️ **Directory Structure Comparison**

### **Before Deployment (Your Computer):**
```
D:\Zanobia\website\my-shop\
├── src/                          (Source code)
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   ├── pages/
│   └── ...
├── public/                       (Static files)
│   ├── images/
│   └── .htaccess
├── wordpress-plugin/             (Plugin source)
│   └── zanobia-business-accounts.php
├── package.json
└── vite.config.js
```

### **After Deployment (Bluehost Server):**
```
/public_html/
├── index.php                     ← WordPress (OLD SITE - UNTOUCHED)
├── wp-admin/                     ← WordPress admin
├── wp-content/
│   ├── plugins/
│   │   └── zanobia-business-accounts/  ← YOUR PLUGIN (DEPLOYED)
│   │       └── zanobia-business-accounts.php
│   ├── themes/
│   └── uploads/
├── wp-includes/
├── wp-config.php                 ← Modified (CORS headers added)
├── .htaccess                     ← Modified (JWT rules added)
│
└── website_1b2a8b7a/             ← YOUR REACT APP (DEPLOYED)
    ├── index.html
    ├── assets/
    │   ├── index-abc123.js       ← Compiled React code
    │   └── index-abc123.css      ← Compiled styles
    ├── images/
    │   ├── logos/
    │   ├── banners/
    │   └── products/
    └── .htaccess                 ← React Router rules
```

---

## 🔐 **Security & Authentication Flow**

```
┌──────────────────────────────────────────────────────────────┐
│  User Registration/Login Flow                                │
└──────────────────────────────────────────────────────────────┘

User enters credentials
         │
         ▼
┌──────────────────────────┐
│  React Login Component   │
│  Collects username/pwd   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  POST /wp-json/jwt-auth/v1/token         │
│  Body: { username, password }            │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  WordPress JWT Plugin    │
│  Validates credentials   │
│  Returns JWT token       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  React stores token      │
│  localStorage.setItem()  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Future API calls include:           │
│  Authorization: Bearer [JWT_TOKEN]   │
└──────────────────────────────────────┘
```

---

## 🚀 **Deployment Flow (What Happens When You Push)**

```
┌───────────────────────────────────────────────────────────────┐
│  Step-by-Step: What Happens When You Run 'git push'          │
└───────────────────────────────────────────────────────────────┘

Your Computer:
   $ git push origin main
         │
         ▼
┌─────────────────────────────┐
│  GitHub receives push       │  ← Instant
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  GitHub Actions triggered   │  ← 1 second
│  Reads: .github/workflows/  │
│         deploy-bluehost.yml │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Spin up Ubuntu server      │  ← 10 seconds
│  (GitHub's server)          │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Checkout your code         │  ← 5 seconds
│  git clone repo             │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Setup Node.js              │  ← 10 seconds
│  Install npm                │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  npm ci                     │  ← 30-60 seconds
│  Install dependencies       │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Create .env.production     │  ← 1 second
│  From GitHub Secrets        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  npm run build              │  ← 30-60 seconds
│  Compile React to dist/     │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Connect to Bluehost FTP    │  ← 5 seconds
│  Using FTP credentials      │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Upload dist/ files         │  ← 60-120 seconds
│  to /public_html/website... │  (depends on file size)
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Upload WordPress plugin    │  ← 10 seconds
│  to /wp-content/plugins/    │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  ✅ Deployment complete!     │  ← Total: 3-5 minutes
│  Send notification          │
└─────────────────────────────┘
          │
          ▼
┌─────────────────────────────┐
│  Your site is LIVE!         │
│  https://www.zanobia...     │
└─────────────────────────────┘
```

---

## 🔌 **API Endpoints Reference**

### **Your React App Makes These Calls:**

```
┌────────────────────────────────────────────────────────────┐
│  WooCommerce REST API (Product Data)                      │
└────────────────────────────────────────────────────────────┘

GET /wp-json/wc/v3/products
  → List all products
  → Auth: Consumer Key + Secret

GET /wp-json/wc/v3/products/{id}
  → Get single product
  → Auth: Consumer Key + Secret

GET /wp-json/wc/v3/products/categories
  → Get product categories
  → Auth: Consumer Key + Secret

POST /wp-json/wc/v3/orders
  → Create new order
  → Auth: Consumer Key + Secret


┌────────────────────────────────────────────────────────────┐
│  WordPress REST API (General)                              │
└────────────────────────────────────────────────────────────┘

GET /wp-json/wp/v2/posts
  → Get blog posts

GET /wp-json/wp/v2/users/me
  → Get current user data
  → Auth: JWT Bearer token


┌────────────────────────────────────────────────────────────┐
│  JWT Authentication API (Login/Auth)                       │
└────────────────────────────────────────────────────────────┘

POST /wp-json/jwt-auth/v1/token
  → Login, get JWT token
  → Body: { username, password }

POST /wp-json/jwt-auth/v1/token/validate
  → Validate JWT token
  → Header: Authorization: Bearer {token}


┌────────────────────────────────────────────────────────────┐
│  Custom Zanobia API (Your Plugin)                          │
└────────────────────────────────────────────────────────────┘

POST /wp-json/zanobia/v1/register
  → Register new user/business account
  → Body: { email, password, firstName, ... }
```

---

## 🎯 **Environment Variables Flow**

```
Local Development:
   .env.local (your computer)
        │
        └─> VITE_WOOCOMMERCE_URL=...
            VITE_WOOCOMMERCE_CONSUMER_KEY=...
            etc.
        │
        ▼
   import.meta.env.VITE_WOOCOMMERCE_URL
   (accessible in React code)


Production Deployment:
   GitHub Secrets (secure storage)
        │
        └─> VITE_WOOCOMMERCE_URL
            VITE_WOOCOMMERCE_CONSUMER_KEY
            etc.
        │
        ▼
   GitHub Actions Workflow
   (creates .env.production during build)
        │
        ▼
   Vite Build Process
   (bundles variables into compiled JS)
        │
        ▼
   Deployed files on Bluehost
   (variables are embedded in JS bundle)
```

**⚠️ Security Note:**  
- Secrets are NOT visible in source code
- They're injected during build process
- Final JS bundle contains the values
- Public API keys (like WooCommerce) are safe to expose

---

## 📊 **Performance & Caching**

```
User Request:
   https://www.zanobiaonline.com/website_1b2a8b7a/
         │
         ▼
   Bluehost Server
   Serves: index.html (instant)
         │
         ▼
   Browser downloads:
   - index-[hash].js  (cached for 1 year)
   - index-[hash].css (cached for 1 year)
   - images/*         (cached for 1 year)
         │
         ▼
   React app starts
   Makes API calls to:
   /wp-json/wc/v3/products
         │
         ▼
   WordPress/WooCommerce
   Returns JSON data
         │
         ▼
   React renders page
   Shows products
```

**Cache Strategy:**
- HTML: No cache (always fresh)
- JS/CSS: 1 year cache (hash changes on updates)
- Images: 1 year cache
- API responses: React handles caching

---

## 🎨 **Complete Tech Stack**

```
Frontend (React App):
├── React 18             (UI library)
├── React Router DOM     (Routing)
├── Vite                 (Build tool)
├── TailwindCSS          (Styling)
├── Axios                (HTTP requests)
├── Framer Motion        (Animations)
└── Stripe.js            (Payments)

Backend (WordPress):
├── WordPress 6.x        (CMS)
├── WooCommerce          (E-commerce)
├── JWT Authentication   (Auth plugin)
└── Custom Plugin        (Business accounts)

Infrastructure:
├── Bluehost             (Web hosting)
├── GitHub               (Version control)
├── GitHub Actions       (CI/CD)
└── FTP                  (Deployment method)

APIs:
├── WooCommerce REST API (Products, orders)
├── WordPress REST API   (Posts, users)
└── JWT Auth API         (Authentication)
```

---

This diagram shows **exactly** how your entire system works together! 🎉

