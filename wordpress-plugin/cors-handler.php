<?php
/**
 * Plugin Name: Zanobia CORS Handler
 * Description: Handles CORS for localhost development and production
 * Version: 1.0.1
 */

// Remove all default WordPress CORS headers to avoid conflicts
remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

// Add CORS headers ONLY ONCE
function zanobia_add_cors_headers() {
    // Remove any existing CORS headers to prevent duplicates
    header_remove('Access-Control-Allow-Origin');
    header_remove('Access-Control-Allow-Methods');
    header_remove('Access-Control-Allow-Headers');
    header_remove('Access-Control-Allow-Credentials');
    header_remove('Access-Control-Max-Age');
    
    $allowed_origins = array(
        'http://localhost:3000',
        'https://localhost:3000',
        'https://www.zanobiaonline.com',
        'https://zanobiaonline.com'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: {$origin}", true);
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH", true);
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce", true);
        header("Access-Control-Allow-Credentials: true", true);
        header("Access-Control-Max-Age: 3600", true);
    }
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
}

// Apply CORS headers very early in the WordPress lifecycle
add_action('init', 'zanobia_add_cors_headers', 1);

// Override REST API CORS
add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        if (!$served) {
            zanobia_add_cors_headers();
        }
        return $served;
    }, 999);
}, 1);

// Add CORS to WooCommerce API
add_filter('woocommerce_rest_pre_dispatch', function($result, $server, $request) {
    zanobia_add_cors_headers();
    return $result;
}, 999, 3);

