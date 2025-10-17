<?php
/**
 * Plugin Name: Zanobia CORS Handler
 * Description: Handles CORS for localhost development and production
 * Version: 1.0.0
 */

// Add CORS headers
function zanobia_add_cors_headers() {
    $allowed_origins = array(
        'http://localhost:3000',
        'https://localhost:3000',
        'https://www.zanobiaonline.com',
        'https://zanobiaonline.com'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 3600");
    }
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
}

// Add CORS to all requests (early priority)
add_action('init', 'zanobia_add_cors_headers', 1);

// Add CORS to REST API specifically
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        zanobia_add_cors_headers();
        return $value;
    });
}, 15);

// Add CORS to WooCommerce API
add_filter('woocommerce_rest_pre_dispatch', function($result, $server, $request) {
    zanobia_add_cors_headers();
    return $result;
}, 10, 3);

