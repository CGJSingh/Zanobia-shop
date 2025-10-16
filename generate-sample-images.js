#!/usr/bin/env node

/**
 * Generate sample images for the e-commerce website
 * This script creates placeholder images for development
 */

const fs = require('fs');
const path = require('path');

// Sample product data with image specifications
const sampleProducts = [
  {
    name: 'headphones',
    title: 'Premium Wireless Headphones',
    color: '3b82f6',
    textColor: 'ffffff'
  },
  {
    name: 'smartwatch',
    title: 'Smart Fitness Watch',
    color: '10b981',
    textColor: 'ffffff'
  },
  {
    name: 'laptop',
    title: 'Professional Laptop',
    color: '8b5cf6',
    textColor: 'ffffff'
  },
  {
    name: 'speaker',
    title: 'Wireless Bluetooth Speaker',
    color: 'f59e0b',
    textColor: 'ffffff'
  },
  {
    name: 'keyboard',
    title: 'Gaming Mechanical Keyboard',
    color: 'ef4444',
    textColor: 'ffffff'
  },
  {
    name: 'monitor',
    title: '4K Ultra HD Monitor',
    color: '06b6d4',
    textColor: 'ffffff'
  }
];

// Create placeholder images using placeholder.com
const generateImageUrls = () => {
  const images = [];
  
  sampleProducts.forEach((product, index) => {
    // Main product image
    images.push({
      name: `${product.name}-1.jpg`,
      url: `https://via.placeholder.com/800x800/${product.color}/${product.textColor}?text=${encodeURIComponent(product.title)}`,
      path: `public/images/products/${product.name}-1.jpg`
    });
    
    // Additional product images
    for (let i = 2; i <= 3; i++) {
      images.push({
        name: `${product.name}-${i}.jpg`,
        url: `https://via.placeholder.com/800x800/${product.color}/${product.textColor}?text=${encodeURIComponent(product.title + ' ' + i)}`,
        path: `public/images/products/${product.name}-${i}.jpg`
      });
    }
  });
  
  return images;
};

// Create banner images
const generateBannerUrls = () => {
  return [
    {
      name: 'hero-banner.jpg',
      url: 'https://via.placeholder.com/1920x600/1e40af/ffffff?text=Welcome+to+Zanobia+Shop',
      path: 'public/images/banners/hero-banner.jpg'
    },
    {
      name: 'promo-banner.jpg',
      url: 'https://via.placeholder.com/1200x400/059669/ffffff?text=Special+Offers',
      path: 'public/images/banners/promo-banner.jpg'
    }
  ];
};

// Create placeholder images
const generatePlaceholderUrls = () => {
  return [
    {
      name: 'no-image.jpg',
      url: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=No+Image',
      path: 'public/images/placeholders/no-image.jpg'
    },
    {
      name: 'product-placeholder.jpg',
      url: 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image',
      path: 'public/images/placeholders/product-placeholder.jpg'
    }
  ];
};

// Download image function
const downloadImage = async (url, filePath) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, data);
    console.log(`✅ Downloaded: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Failed to download ${filePath}:`, error.message);
  }
};

// Main function
const main = async () => {
  console.log('🖼️  Generating sample images for Zanobia Shop...\n');
  
  // Create all image URLs
  const productImages = generateImageUrls();
  const bannerImages = generateBannerUrls();
  const placeholderImages = generatePlaceholderUrls();
  
  const allImages = [...productImages, ...bannerImages, ...placeholderImages];
  
  console.log(`📦 Found ${allImages.length} images to generate\n`);
  
  // Download all images
  for (const image of allImages) {
    await downloadImage(image.url, image.path);
  }
  
  console.log('\n🎉 Sample images generated successfully!');
  console.log('\n📁 Images saved to:');
  console.log('   - public/images/products/');
  console.log('   - public/images/banners/');
  console.log('   - public/images/placeholders/');
  console.log('\n💡 You can now replace these with your actual product images.');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateImageUrls, generateBannerUrls, generatePlaceholderUrls };
