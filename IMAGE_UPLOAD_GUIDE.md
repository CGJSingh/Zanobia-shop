# 📸 Image Upload Guide for Zanobia Shop

This guide explains how to add and manage images for your e-commerce website.

## 📁 Folder Structure

```
public/images/
├── products/          # Product images
│   ├── product-1.jpg
│   ├── product-2.jpg
│   └── ...
├── banners/           # Hero and promotional banners
│   ├── hero-banner.jpg
│   ├── promo-banner.jpg
│   └── ...
├── logos/             # Logo and branding
│   ├── logo.svg
│   ├── favicon.ico
│   └── ...
├── icons/             # Icon images
│   ├── cart-icon.svg
│   ├── user-icon.svg
│   └── ...
└── placeholders/     # Fallback images
    ├── no-image.jpg
    ├── product-placeholder.jpg
    └── ...
```

## 🖼️ Image Specifications

### Product Images
- **Size**: 800x800px minimum (square recommended)
- **Format**: WebP, JPEG, or PNG
- **Quality**: High resolution, well-lit
- **Naming**: `product-[name]-[number].jpg`
  - Example: `product-laptop-1.jpg`, `product-laptop-2.jpg`

### Banner Images
- **Hero Banners**: 1920x600px
- **Promotional Banners**: 1200x400px
- **Category Banners**: 800x300px
- **Format**: WebP or JPEG
- **Naming**: `banner-[type]-[name].jpg`

### Logo Images
- **Format**: SVG (preferred) or PNG
- **Size**: Scalable (SVG) or 200x200px (PNG)
- **Background**: Transparent

## 🚀 How to Add Images

### Method 1: Direct File Upload
1. Navigate to `public/images/` folder
2. Create appropriate subfolder if needed
3. Upload your images
4. Update image paths in components

### Method 2: Using the Website Interface
1. Go to your WordPress admin
2. Upload images to Media Library
3. Copy image URLs
4. Update product data with image URLs

### Method 3: Programmatic Upload
```javascript
// Example: Add product with local image
const product = {
  id: 1,
  name: "Sample Product",
  price: "99.99",
  localImage: "products/sample-product.jpg",
  images: [
    { src: "/images/products/sample-product-1.jpg" },
    { src: "/images/products/sample-product-2.jpg" }
  ]
};
```

## 🛠️ Image Optimization

### Before Upload
1. **Resize**: Use appropriate dimensions
2. **Compress**: Reduce file size without losing quality
3. **Format**: Use WebP for better compression
4. **Quality**: Balance between file size and quality

### Tools for Optimization
- **Online**: TinyPNG, Squoosh, ImageOptim
- **Desktop**: Photoshop, GIMP, Affinity Photo
- **Command Line**: ImageMagick, Sharp

## 📝 Adding Images to Products

### Option 1: Local Images
```javascript
// In your product data
const product = {
  id: 1,
  name: "Wireless Headphones",
  localImage: "products/headphones-1.jpg", // Local image path
  images: [
    { src: "/images/products/headphones-1.jpg" },
    { src: "/images/products/headphones-2.jpg" }
  ]
};
```

### Option 2: Remote Images
```javascript
// Using WooCommerce API images
const product = {
  id: 1,
  name: "Wireless Headphones",
  images: [
    { src: "https://your-site.com/wp-content/uploads/headphones-1.jpg" }
  ]
};
```

## 🎨 Image Guidelines

### Product Photography
- **Lighting**: Use natural light or professional lighting
- **Background**: Clean, neutral background
- **Angles**: Multiple angles (front, back, side, detail)
- **Quality**: High resolution, sharp focus
- **Consistency**: Same style across all products

### Banner Design
- **Text**: Minimal, readable text
- **Colors**: Match your brand colors
- **Layout**: Balanced composition
- **Mobile**: Ensure mobile-friendly design

## 🔧 Technical Implementation

### Image Component Usage
```jsx
import ImageWithFallback from '../components/ImageWithFallback';

<ImageWithFallback
  src={product.images?.[0]?.src || product.localImage}
  alt={product.name}
  className="w-full h-48 object-cover"
  placeholder="product"
/>
```

### Fallback Images
The website automatically uses placeholder images when:
- Image fails to load
- No image is provided
- Network issues occur

## 📱 Responsive Images

### Different Sizes
- **Mobile**: 400x400px
- **Tablet**: 600x600px
- **Desktop**: 800x800px
- **High DPI**: 1200x1200px

### Implementation
```jsx
<ImageWithFallback
  src={getOptimizedImage(product.image, 800, 800)}
  alt={product.name}
  className="w-full h-48 object-cover"
/>
```

## 🚀 Performance Tips

1. **Lazy Loading**: Images load only when needed
2. **WebP Format**: Better compression than JPEG
3. **CDN**: Use a CDN for faster delivery
4. **Caching**: Implement proper caching headers
5. **Compression**: Optimize file sizes

## 🐛 Troubleshooting

### Common Issues
1. **Image not loading**: Check file path and permissions
2. **Slow loading**: Optimize image size and format
3. **Poor quality**: Use higher resolution source
4. **Layout issues**: Check CSS dimensions

### Debug Steps
1. Check browser console for errors
2. Verify image file exists
3. Test with different image formats
4. Check network tab for failed requests

## 📋 Checklist

- [ ] Images are properly sized
- [ ] File names are descriptive
- [ ] Images are optimized for web
- [ ] Fallback images are in place
- [ ] Alt text is provided
- [ ] Mobile responsiveness is tested
- [ ] Loading performance is acceptable

---

**Need Help?** Check the main README.md or create an issue in the repository.
