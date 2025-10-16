# WooCommerce API Integration Guide

## Overview

This guide explains how to use the WooCommerce REST API integration in your React application.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory (never commit this file!):

```bash
VITE_WOOCOMMERCE_URL=https://your-site.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
VITE_WORDPRESS_URL=https://your-site.com/wp-json/wp/v2
VITE_SITE_NAME=Your Shop Name
VITE_SITE_DESCRIPTION=Your shop description
```

### 2. Generate WooCommerce API Keys

1. Go to your WordPress admin panel
2. Navigate to WooCommerce → Settings → Advanced → REST API
3. Click "Add key"
4. Set description, user, and permissions (Read/Write)
5. Click "Generate API key"
6. Copy the Consumer Key and Consumer Secret to your `.env.local` file

## Available Functions

### Product Operations

#### `getProducts(params)`
Fetch all products with optional filtering.

```javascript
import { getProducts } from './api/woocommerce';

// Fetch all products
const products = await getProducts();

// Fetch with parameters
const products = await getProducts({
  per_page: 20,
  page: 1,
  search: 'shoes',
  category: 15,
  orderby: 'popularity',
  order: 'desc'
});
```

**Parameters:**
- `per_page`: Number of items per page (default: 10)
- `page`: Page number (default: 1)
- `search`: Search query
- `category`: Category ID
- `orderby`: Sort by (date, id, title, popularity, rating)
- `order`: Sort order (asc, desc)

#### `getProductById(id)`
Fetch a single product by ID.

```javascript
import { getProductById } from './api/woocommerce';

const product = await getProductById(123);
```

#### `getCategories(params)`
Fetch all product categories.

```javascript
import { getCategories } from './api/woocommerce';

const categories = await getCategories();
```

#### `getProductsByCategory(categoryId, params)`
Fetch products by category.

```javascript
import { getProductsByCategory } from './api/woocommerce';

const products = await getProductsByCategory(15, { per_page: 20 });
```

#### `searchProducts(query, params)`
Search products by query.

```javascript
import { searchProducts } from './api/woocommerce';

const results = await searchProducts('laptop');
```

#### `getProductVariations(productId)`
Fetch variations for a variable product.

```javascript
import { getProductVariations } from './api/woocommerce';

const variations = await getProductVariations(123);
```

### Order Operations

#### `createOrder(orderData)`
Create a new order.

```javascript
import { createOrder } from './api/woocommerce';

const order = await createOrder({
  payment_method: 'bacs',
  payment_method_title: 'Direct Bank Transfer',
  billing: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'US',
    email: 'john@example.com',
    phone: '555-1234'
  },
  shipping: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'US'
  },
  line_items: [
    { product_id: 123, quantity: 2 },
    { product_id: 456, quantity: 1, variation_id: 789 }
  ],
  customer_note: 'Please ring the doorbell'
});
```

#### `getOrderById(orderId)`
Fetch a single order by ID.

```javascript
import { getOrderById } from './api/woocommerce';

const order = await getOrderById(123);
```

#### `getOrders(params)`
Fetch all orders with optional filtering.

```javascript
import { getOrders } from './api/woocommerce';

const orders = await getOrders({
  customer: 15,
  status: 'completed',
  per_page: 20
});
```

#### `updateOrder(orderId, updates)`
Update an existing order.

```javascript
import { updateOrder } from './api/woocommerce';

const updatedOrder = await updateOrder(123, {
  status: 'completed'
});
```

### Customer Operations

#### `registerCustomer(customerData)`
Create a new customer account.

```javascript
import { registerCustomer } from './api/woocommerce';

const customer = await registerCustomer({
  email: 'customer@example.com',
  first_name: 'Jane',
  last_name: 'Smith',
  username: 'janesmith',
  password: 'SecurePassword123!',
  billing: {
    first_name: 'Jane',
    last_name: 'Smith',
    company: '',
    address_1: '456 Oak St',
    address_2: 'Apt 2B',
    city: 'Los Angeles',
    state: 'CA',
    postcode: '90001',
    country: 'US',
    email: 'customer@example.com',
    phone: '555-5678'
  }
});
```

#### `getCustomerById(customerId)`
Fetch customer by ID.

```javascript
import { getCustomerById } from './api/woocommerce';

const customer = await getCustomerById(15);
```

#### `updateCustomer(customerId, updates)`
Update customer information.

```javascript
import { updateCustomer } from './api/woocommerce';

const updatedCustomer = await updateCustomer(15, {
  first_name: 'Jane',
  last_name: 'Doe'
});
```

#### `getCustomers(params)`
Fetch all customers (requires admin privileges).

```javascript
import { getCustomers } from './api/woocommerce';

const customers = await getCustomers({ per_page: 50 });
```

#### `getCustomerOrders(customerId, params)`
Fetch orders for a specific customer.

```javascript
import { getCustomerOrders } from './api/woocommerce';

const orders = await getCustomerOrders(15, { status: 'completed' });
```

### Utility Functions

#### `isConfigured()`
Check if WooCommerce API is configured correctly.

```javascript
import { isConfigured } from './api/woocommerce';

if (!isConfigured()) {
  console.error('WooCommerce API is not configured!');
}
```

#### `testConnection()`
Test connection to WooCommerce API.

```javascript
import { testConnection } from './api/woocommerce';

const connected = await testConnection();
if (connected) {
  console.log('Successfully connected to WooCommerce API');
}
```

## Error Handling

All functions use consistent error handling. Errors include:

- **User-friendly message**: Clear description of what went wrong
- **Status code**: HTTP status code from the API
- **Original error**: Full error object for debugging

Example error handling:

```javascript
import { getProducts } from './api/woocommerce';

try {
  const products = await getProducts();
  setProducts(products);
} catch (error) {
  console.error('Error message:', error.message);
  console.error('Status code:', error.statusCode);
  
  if (error.statusCode === 404) {
    // Handle not found
  } else if (error.statusCode === 401) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

## Best Practices

### 1. Always Use Try-Catch

```javascript
const fetchData = async () => {
  try {
    const products = await getProducts();
    setProducts(products);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. Loading States

```javascript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ per_page: 20 });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);
```

### 3. Pagination

```javascript
const [page, setPage] = useState(1);
const perPage = 20;

const loadMore = async () => {
  try {
    const newProducts = await getProducts({ page: page + 1, per_page: perPage });
    setProducts([...products, ...newProducts]);
    setPage(page + 1);
  } catch (error) {
    console.error(error);
  }
};
```

### 4. Debounce Search

```javascript
import { useState, useEffect } from 'react';
import { searchProducts } from './api/woocommerce';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const products = await searchProducts(query);
        setResults(products);
      } catch (error) {
        console.error(error);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
};
```

## Authentication Notes

The current implementation uses WooCommerce REST API Basic Authentication with consumer keys. This is suitable for:

- Fetching public product data
- Creating orders
- Managing customers (admin)

For user login/authentication, you need additional setup:

1. **JWT Authentication Plugin** (Recommended)
   - Install: JWT Authentication for WP REST API
   - Enable: JWT tokens for user authentication
   
2. **WooCommerce Session Handler**
   - Use cookies for guest cart sessions
   
3. **OAuth** (Advanced)
   - For third-party integrations

The `loginCustomer` and `validateToken` functions are placeholders. Implement them based on your chosen authentication method.

## Security Checklist

- [x] ✅ Environment variables used for credentials
- [x] ✅ `.env.local` added to `.gitignore`
- [x] ✅ No hardcoded credentials in source code
- [x] ✅ HTTPS used for API calls
- [x] ✅ Error messages don't expose sensitive data
- [ ] ⚠️ Implement rate limiting on API calls
- [ ] ⚠️ Add request validation
- [ ] ⚠️ Implement proper authentication for user operations

## Troubleshooting

### "Missing environment variables" error
- Make sure `.env.local` file exists
- Check that all required variables are set
- Restart dev server after changing .env files

### 401 Unauthorized
- Verify consumer key and secret are correct
- Check user permissions in WooCommerce settings
- Ensure API keys have proper read/write permissions

### CORS errors
- Enable CORS in your WooCommerce settings
- Add proper CORS headers on your server
- Consider using a proxy in development

### SSL errors
- Ensure your WooCommerce site uses HTTPS
- Update certificate if expired
- For development, you may need to disable SSL verification (not recommended for production)

## Additional Resources

- [WooCommerce REST API Documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WooCommerce API Authentication](https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication)
- [Axios Documentation](https://axios-http.com/docs/intro)

## Migration from Old Functions

If you're using the old function names, they're still available for backward compatibility:

- `fetchProducts` → Use `getProducts` (both work)
- `fetchProduct` → Use `getProductById` (both work)
- `fetchCategories` → Use `getCategories` (both work)
- `fetchProductsByCategory` → Use `getProductsByCategory` (both work)
- `fetchProductVariations` → Use `getProductVariations` (both work)

Update your imports gradually to use the new naming convention.

