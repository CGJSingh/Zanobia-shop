// API Configuration
// TODO: For production, move these to .env.local file for better security
// Create a .env.local file in the root directory with:
// VITE_WOOCOMMERCE_URL=https://www.zanobiaonline.com/wp-json/wc/v3
// VITE_WOOCOMMERCE_CONSUMER_KEY=ck_580fce9e40697dbadb614734d353b0a14123e67d
// VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9

export const API_CONFIG = {
  WOOCOMMERCE: {
    BASE_URL: import.meta.env.VITE_WOOCOMMERCE_URL || "https://www.zanobiaonline.com/wp-json/wc/v3",
    CONSUMER_KEY: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || "ck_580fce9e40697dbadb614734d353b0a14123e67d",
    CONSUMER_SECRET: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || "cs_c7edcdd426e4e84ce833174e3d5e387de7c2a1b9"
  },
  WORDPRESS: {
    BASE_URL: import.meta.env.VITE_WORDPRESS_URL || "https://www.zanobiaonline.com/wp-json/wp/v2"
  },
  SITE: {
    NAME: import.meta.env.VITE_SITE_NAME || "Zanobia Shop",
    DESCRIPTION: import.meta.env.VITE_SITE_DESCRIPTION || "Your trusted online destination for quality products"
  }
};

// Log configuration status
console.log('WooCommerce API Configuration:', {
  baseURL: API_CONFIG.WOOCOMMERCE.BASE_URL,
  hasKey: !!API_CONFIG.WOOCOMMERCE.CONSUMER_KEY,
  hasSecret: !!API_CONFIG.WOOCOMMERCE.CONSUMER_SECRET,
  usingEnvFile: !!import.meta.env.VITE_WOOCOMMERCE_URL
});
