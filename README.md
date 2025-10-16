# Zanobia Shop - Modern E-commerce Website

A modern, responsive e-commerce website built with React (Vite) and WordPress headless CMS. Features dynamic product management through WooCommerce API and blog content through WordPress REST API.

## 🚀 Features

- **Modern React Architecture**: Built with Vite for fast development and optimized builds
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dynamic Product Management**: Products fetched from WooCommerce API
- **Blog Integration**: WordPress posts integration
- **Shopping Cart**: Full cart functionality with local storage persistence
- **Product Search & Filtering**: Advanced product filtering and search capabilities
- **Performance Optimized**: Lazy loading, code splitting, and optimized images
- **SEO Ready**: Proper meta tags and structured data

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: Axios for HTTP requests
- **Backend**: WordPress (Headless) + WooCommerce
- **Deployment**: Vercel/Netlify ready

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── Loader.jsx
│   └── Error.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── ProductListing.jsx
│   ├── ProductDetail.jsx
│   └── Cart.jsx
├── api/                # API integration
│   ├── woocommerce.js
│   └── posts.js
├── context/            # Global state management
│   └── CartContext.jsx
├── styles/             # Global styles
│   └── index.css
├── App.jsx
└── main.jsx
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your API credentials:
   ```env
   VITE_WOOCOMMERCE_URL=https://your-site.com/wp-json/wc/v3
   VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
   VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
   VITE_WORDPRESS_URL=https://your-site.com/wp-json/wp/v2
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔧 Configuration

### WooCommerce API Setup

1. Go to your WordPress admin → WooCommerce → Settings → Advanced → REST API
2. Create a new API key with read permissions
3. Update the environment variables with your credentials

### WordPress REST API

The WordPress REST API should be enabled by default. Ensure your WordPress site allows REST API access.

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with call-to-action
- Featured products grid
- Latest blog posts
- Newsletter signup

### Products Page (`/products`)
- Product grid with filtering
- Search functionality
- Category filtering
- Sort options
- Pagination

### Product Detail (`/product/:id`)
- Product images carousel
- Detailed product information
- Add to cart functionality
- Related products

### Shopping Cart (`/cart`)
- Cart items management
- Quantity controls
- Price calculations
- Checkout preparation

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors, fonts, and spacing in the config
- Custom components in `src/components/`

### API Integration
- Update API endpoints in `src/api/`
- Modify data transformation as needed
- Add new API endpoints for additional features

## 🔒 Security Considerations

- API keys are stored in environment variables
- No sensitive data in client-side code
- CORS properly configured for API endpoints
- Input validation on all forms

## 📈 Performance

- Lazy loading for images
- Code splitting with React.lazy()
- Optimized bundle size
- CDN-ready static assets

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify API credentials
   - Check CORS settings
   - Ensure WordPress REST API is enabled

2. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

3. **Deployment Issues**
   - Ensure environment variables are set
   - Check build output directory
   - Verify redirect rules for SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using React, Vite, and WordPress**
