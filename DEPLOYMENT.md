# Deployment Guide

This guide covers deploying the Zanobia Shop e-commerce website to various platforms.

## 🚀 Quick Deploy Options

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Import your repository

2. **Configure Environment Variables**
   ```
   VITE_WOOCOMMERCE_URL=https://go.zanobiaonline.com/wp-json/wc/v3
   VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
   VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
   VITE_WORDPRESS_URL=https://go.zanobiaonline.com/wp-json/wp/v2
   VITE_SITE_NAME=Zanobia Shop
   VITE_SITE_DESCRIPTION=Your trusted online destination for quality products
   ```

3. **Deploy**
   - Vercel will automatically detect Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Deploy!

### Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Sign in and connect your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all the variables from the Vercel section above

4. **Deploy**
   - Netlify will automatically build and deploy

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/my-shop"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in your project root:

```env
# WooCommerce API Configuration
VITE_WOOCOMMERCE_URL=https://your-site.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret

# WordPress API Configuration
VITE_WORDPRESS_URL=https://your-site.com/wp-json/wp/v2

# Site Configuration
VITE_SITE_NAME=Your Shop Name
VITE_SITE_DESCRIPTION=Your shop description
```

### WooCommerce API Setup

1. **Generate API Keys**
   - Go to WordPress Admin → WooCommerce → Settings → Advanced → REST API
   - Click "Add Key"
   - Description: "React App"
   - User: Select an admin user
   - Permissions: Read
   - Generate API Key

2. **Test API Access**
   ```bash
   curl -u "consumer_key:consumer_secret" \
   "https://your-site.com/wp-json/wc/v3/products"
   ```

## 🏗️ Build Process

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔒 Security Considerations

### API Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement rate limiting on your WordPress site
- Use HTTPS for all API calls

### CORS Configuration
Add to your WordPress `wp-config.php`:
```php
// Allow CORS for your domain
header('Access-Control-Allow-Origin: https://your-domain.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

## 📊 Performance Optimization

### Build Optimizations
- Vite automatically optimizes the build
- Images are lazy-loaded
- Code splitting is implemented
- Bundle analysis available with `npm run build -- --analyze`

### CDN Setup
- Use a CDN for static assets
- Optimize images before upload
- Enable gzip compression

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall
   - Verify all environment variables

2. **API Connection Issues**
   - Verify API credentials
   - Check CORS settings
   - Test API endpoints directly

3. **Deployment Issues**
   - Ensure environment variables are set
   - Check build output directory
   - Verify redirect rules for SPA

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

## 📈 Monitoring

### Analytics
- Add Google Analytics
- Monitor Core Web Vitals
- Track conversion rates

### Error Tracking
- Consider Sentry for error tracking
- Monitor API response times
- Set up uptime monitoring

## 🔄 Updates & Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Test after WordPress/WooCommerce updates

### Backup Strategy
- Regular database backups
- Version control for code
- Document configuration changes

---

**Need Help?** Check the main README.md or create an issue in the repository.
