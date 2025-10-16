import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website' 
}) => {
  const siteName = import.meta.env.VITE_SITE_NAME || 'Zanobia Shop';
  const siteDescription = import.meta.env.VITE_SITE_DESCRIPTION || 'Your trusted online destination for quality products';
  
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || siteDescription;
  const fullImage = image || '/og-image.jpg';
  const fullUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0ea5e9" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;
