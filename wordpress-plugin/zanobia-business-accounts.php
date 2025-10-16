<?php
/**
 * Plugin Name: Zanobia Business Accounts
 * Plugin URI: https://zanobiaonline.com
 * Description: Custom role-based registration system for regular users and business accounts with admin approval workflow
 * Version: 1.0.0
 * Author: Zanobia Team
 * Author URI: https://zanobiaonline.com
 * Text Domain: zanobia-business
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Main Plugin Class
 */
class Zanobia_Business_Accounts {
    
    /**
     * Admin email for notifications
     */
    const ADMIN_EMAIL = 'company@zanobiaonline.com';

    /**
     * Constructor
     */
    public function __construct() {
        // Register custom roles on plugin activation
        register_activation_hook(__FILE__, array($this, 'create_custom_roles'));
        
        // REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // User registration hooks
        add_action('user_register', array($this, 'handle_new_user_registration'), 10, 1);
        
        // Role change hooks (for approval)
        add_action('set_user_role', array($this, 'handle_role_change'), 10, 3);
        
        // Admin UI enhancements
        add_filter('user_row_actions', array($this, 'add_approve_business_link'), 10, 2);
        add_action('admin_notices', array($this, 'show_pending_business_notice'));
        
        // Enable debug logging
        add_action('init', array($this, 'enable_debug_logging'));
    }

    /**
     * Enable WordPress debug logging for local testing
     */
    public function enable_debug_logging() {
        if (!defined('WP_DEBUG_LOG')) {
            define('WP_DEBUG_LOG', true);
        }
    }

    /**
     * Create custom user roles
     */
    public function create_custom_roles() {
        // Pending Business Role (requires approval)
        add_role('pending_business', 'Pending Business', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
        ));

        // Verified Business Role (approved)
        add_role('business_verified', 'Business Verified', array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
            'access_wholesale' => true, // Custom capability
        ));

        // Log role creation
        $this->log_message('Custom roles created: pending_business, business_verified');
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        // Custom registration endpoint
        register_rest_route('zanobia/v1', '/register', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_registration_request'),
            'permission_callback' => '__return_true', // Public endpoint
        ));

        // Check user role endpoint
        register_rest_route('zanobia/v1', '/user-role', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_role'),
            'permission_callback' => array($this, 'check_authentication'),
        ));

        // Get pending business users (admin only)
        register_rest_route('zanobia/v1', '/pending-businesses', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_pending_businesses'),
            'permission_callback' => array($this, 'check_admin'),
        ));

        // Approve business user (admin only)
        register_rest_route('zanobia/v1', '/approve-business/(?P<user_id>\d+)', array(
            'methods' => 'POST',
            'callback' => array($this, 'approve_business_user'),
            'permission_callback' => array($this, 'check_admin'),
        ));

        // Update user profile
        register_rest_route('zanobia/v1', '/update-profile', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_user_profile'),
            'permission_callback' => array($this, 'check_authentication'),
        ));

        // Get user addresses
        register_rest_route('zanobia/v1', '/user-addresses', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_addresses'),
            'permission_callback' => array($this, 'check_authentication'),
        ));

        // Update user addresses
        register_rest_route('zanobia/v1', '/update-addresses', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_user_addresses'),
            'permission_callback' => array($this, 'check_authentication'),
        ));
    }

    /**
     * Handle registration request from React
     * 
     * Expected payload:
     * {
     *   "email": "user@example.com",
     *   "password": "SecurePass123!",
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "mobilePhone": "1234567890",
     *   "accountType": "business", // or "user"
     *   "businessName": "ABC Corp" // optional, required if accountType = "business"
     * }
     */
    public function handle_registration_request($request) {
        $params = $request->get_json_params();

        // Validate required fields
        $required_fields = array('email', 'password', 'firstName', 'lastName', 'mobilePhone', 'accountType');
        foreach ($required_fields as $field) {
            if (empty($params[$field])) {
                return new WP_Error(
                    'missing_field',
                    sprintf('Missing required field: %s', $field),
                    array('status' => 400)
                );
            }
        }

        // Validate email format
        if (!is_email($params['email'])) {
            return new WP_Error(
                'invalid_email',
                'Invalid email address',
                array('status' => 400)
            );
        }

        // Check if email already exists
        if (email_exists($params['email'])) {
            return new WP_Error(
                'email_exists',
                'This email is already registered',
                array('status' => 400)
            );
        }

        // Validate business name for business accounts
        if ($params['accountType'] === 'business' && empty($params['businessName'])) {
            return new WP_Error(
                'missing_business_name',
                'Business name is required for business accounts',
                array('status' => 400)
            );
        }

        // Create username from email if not provided
        $username = isset($params['username']) ? $params['username'] : sanitize_user(current(explode('@', $params['email'])));
        
        // Ensure unique username
        if (username_exists($username)) {
            $username = $username . '_' . rand(1000, 9999);
        }

        // Determine user role
        $role = ($params['accountType'] === 'business') ? 'pending_business' : 'customer';

        // Create user
        $user_id = wp_create_user(
            $username,
            $params['password'],
            $params['email']
        );

        if (is_wp_error($user_id)) {
            return new WP_Error(
                'registration_failed',
                $user_id->get_error_message(),
                array('status' => 500)
            );
        }

        // Update user data
        wp_update_user(array(
            'ID' => $user_id,
            'first_name' => sanitize_text_field($params['firstName']),
            'last_name' => sanitize_text_field($params['lastName']),
            'role' => $role,
            'display_name' => sanitize_text_field($params['firstName'] . ' ' . $params['lastName']),
        ));

        // Save additional meta data
        update_user_meta($user_id, 'mobile_phone', sanitize_text_field($params['mobilePhone']));
        update_user_meta($user_id, 'account_type', sanitize_text_field($params['accountType']));
        
        if ($params['accountType'] === 'business') {
            update_user_meta($user_id, 'business_name', sanitize_text_field($params['businessName']));
            update_user_meta($user_id, 'business_status', 'pending');
            update_user_meta($user_id, 'registration_date', current_time('mysql'));
        }

        // Log successful registration
        $this->log_message(sprintf(
            'New user registered: %s (%s) - Role: %s',
            $params['email'],
            $username,
            $role
        ));

        // Return success response
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Registration successful',
            'user' => array(
                'id' => $user_id,
                'username' => $username,
                'email' => $params['email'],
                'firstName' => $params['firstName'],
                'lastName' => $params['lastName'],
                'role' => $role,
                'status' => ($params['accountType'] === 'business') ? 'pending' : 'active',
            )
        ));
    }

    /**
     * Handle new user registration
     * Triggered after user is created
     */
    public function handle_new_user_registration($user_id) {
        $user = get_userdata($user_id);
        
        if (!$user) {
            return;
        }

        // Check if this is a business registration
        if (in_array('pending_business', $user->roles)) {
            $this->send_business_registration_notification($user_id);
        }
    }

    /**
     * Send email notification to admin about new business registration
     */
    public function send_business_registration_notification($user_id) {
        $user = get_userdata($user_id);
        $business_name = get_user_meta($user_id, 'business_name', true);
        $mobile_phone = get_user_meta($user_id, 'mobile_phone', true);
        
        $to = self::ADMIN_EMAIL;
        $subject = 'New Business Registration Pending Approval - Zanobia';
        
        $message = "A new business account has been registered and requires your approval.\n\n";
        $message .= "=== BUSINESS DETAILS ===\n\n";
        $message .= "Business Name: " . $business_name . "\n";
        $message .= "Contact Person: " . $user->first_name . " " . $user->last_name . "\n";
        $message .= "Email: " . $user->user_email . "\n";
        $message .= "Phone: " . $mobile_phone . "\n";
        $message .= "Username: " . $user->user_login . "\n";
        $message .= "Registration Date: " . date('Y-m-d H:i:s') . "\n\n";
        $message .= "=== NEXT STEPS ===\n\n";
        $message .= "1. Review the business details\n";
        $message .= "2. Log into WordPress Admin\n";
        $message .= "3. Go to Users → All Users\n";
        $message .= "4. Find: " . $user->user_email . "\n";
        $message .= "5. Change role from 'Pending Business' to 'Business Verified'\n\n";
        $message .= "Admin Panel: " . admin_url('users.php') . "\n\n";
        $message .= "Thank you,\nZanobia System";

        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: Zanobia Online <noreply@zanobiaonline.com>'
        );

        // Try to send email
        $sent = wp_mail($to, $subject, $message, $headers);

        if ($sent) {
            $this->log_message("Business registration email sent to admin for user ID: {$user_id}");
        } else {
            // Fallback: Log to debug.log if email fails (local testing)
            $this->log_message("Email could not be sent (SMTP not configured). Business registration details:");
            $this->log_message($message);
        }
    }

    /**
     * Handle role change
     * Send approval email when business is verified
     */
    public function handle_role_change($user_id, $role, $old_roles) {
        // Check if user was approved (pending_business → business_verified)
        if ($role === 'business_verified' && in_array('pending_business', $old_roles)) {
            $this->send_approval_email($user_id);
            update_user_meta($user_id, 'business_status', 'approved');
            update_user_meta($user_id, 'approval_date', current_time('mysql'));
            
            $this->log_message("Business account approved for user ID: {$user_id}");
        }
    }

    /**
     * Send approval email to business user
     */
    public function send_approval_email($user_id) {
        $user = get_userdata($user_id);
        $business_name = get_user_meta($user_id, 'business_name', true);
        
        $to = $user->user_email;
        $subject = 'Your Business Account Has Been Approved - Zanobia';
        
        $message = "Dear " . $user->first_name . ",\n\n";
        $message .= "Congratulations! Your business account has been approved.\n\n";
        $message .= "=== ACCOUNT DETAILS ===\n\n";
        $message .= "Business Name: " . $business_name . "\n";
        $message .= "Account Type: Business Verified\n";
        $message .= "Username: " . $user->user_login . "\n";
        $message .= "Email: " . $user->user_email . "\n\n";
        $message .= "=== WHOLESALE ACCESS ===\n\n";
        $message .= "You now have access to:\n";
        $message .= "✓ Exclusive wholesale pricing\n";
        $message .= "✓ Bulk order discounts (up to 40% off)\n";
        $message .= "✓ Priority shipping options\n";
        $message .= "✓ Dedicated account manager\n";
        $message .= "✓ Early access to new products\n\n";
        $message .= "Visit our wholesale section: " . home_url('/wholesale') . "\n\n";
        $message .= "Thank you for partnering with Zanobia!\n\n";
        $message .= "Best regards,\n";
        $message .= "The Zanobia Team\n";
        $message .= "company@zanobiaonline.com";

        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: Zanobia Online <noreply@zanobiaonline.com>'
        );

        $sent = wp_mail($to, $subject, $message, $headers);

        if ($sent) {
            $this->log_message("Approval email sent to user ID: {$user_id}");
        } else {
            $this->log_message("Approval email could not be sent. Details:");
            $this->log_message($message);
        }
    }

    /**
     * Get user role via REST API
     */
    public function get_user_role($request) {
        $current_user = wp_get_current_user();
        
        if (!$current_user->ID) {
            return new WP_Error(
                'not_authenticated',
                'User not authenticated',
                array('status' => 401)
            );
        }

        // Get profile picture/avatar
        $avatar_url = get_user_meta($current_user->ID, 'profile_picture', true);
        if (empty($avatar_url)) {
            // Fallback to WordPress Gravatar
            $avatar_url = get_avatar_url($current_user->ID, array('size' => 200));
        }

        $user_meta = array(
            'id' => $current_user->ID,
            'username' => $current_user->user_login,
            'email' => $current_user->user_email,
            'firstName' => $current_user->first_name,
            'lastName' => $current_user->last_name,
            'role' => $current_user->roles[0] ?? 'customer',
            'mobilePhone' => get_user_meta($current_user->ID, 'mobile_phone', true),
            'businessName' => get_user_meta($current_user->ID, 'business_name', true),
            'businessStatus' => get_user_meta($current_user->ID, 'business_status', true),
            'verified' => in_array('business_verified', $current_user->roles),
            'canAccessWholesale' => in_array('business_verified', $current_user->roles),
            'avatar' => $avatar_url, // Profile picture URL
        );

        return rest_ensure_response($user_meta);
    }

    /**
     * Get pending business users (admin only)
     */
    public function get_pending_businesses($request) {
        $args = array(
            'role' => 'pending_business',
            'orderby' => 'registered',
            'order' => 'DESC',
        );

        $users = get_users($args);
        $pending_list = array();

        foreach ($users as $user) {
            $pending_list[] = array(
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'businessName' => get_user_meta($user->ID, 'business_name', true),
                'mobilePhone' => get_user_meta($user->ID, 'mobile_phone', true),
                'registrationDate' => get_user_meta($user->ID, 'registration_date', true),
            );
        }

        return rest_ensure_response($pending_list);
    }

    /**
     * Approve business user (admin only)
     */
    public function approve_business_user($request) {
        $user_id = $request->get_param('user_id');
        $user = get_userdata($user_id);

        if (!$user) {
            return new WP_Error(
                'user_not_found',
                'User not found',
                array('status' => 404)
            );
        }

        // Change role to business_verified
        $user->set_role('business_verified');

        $this->log_message("Admin approved business user ID: {$user_id}");

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Business account approved successfully',
            'user' => array(
                'id' => $user_id,
                'email' => $user->user_email,
                'role' => 'business_verified',
            )
        ));
    }

    /**
     * Add "Approve Business" or "Unverify Business" link to user row actions in admin
     */
    public function add_approve_business_link($actions, $user) {
        // Add "Approve" link for pending business users
        if (in_array('pending_business', $user->roles)) {
            $approve_url = add_query_arg(array(
                'action' => 'approve_business',
                'user_id' => $user->ID,
                '_wpnonce' => wp_create_nonce('approve_business_' . $user->ID),
            ), admin_url('users.php'));

            $actions['approve_business'] = sprintf(
                '<a href="%s" style="color: green; font-weight: bold;">✓ Approve Business</a>',
                $approve_url
            );
        }
        
        // Add "Unverify" link for verified business users
        if (in_array('business_verified', $user->roles)) {
            $unverify_url = add_query_arg(array(
                'action' => 'unverify_business',
                'user_id' => $user->ID,
                '_wpnonce' => wp_create_nonce('unverify_business_' . $user->ID),
            ), admin_url('users.php'));

            $actions['unverify_business'] = sprintf(
                '<a href="%s" style="color: orange; font-weight: bold;">↩ Unverify Business</a>',
                $unverify_url
            );
        }

        return $actions;
    }

    /**
     * Show admin notice for pending business accounts
     */
    public function show_pending_business_notice() {
        $screen = get_current_screen();
        
        if ($screen->id !== 'users') {
            return;
        }

        $pending_count = count(get_users(array('role' => 'pending_business')));

        if ($pending_count > 0) {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p><strong>Pending Business Accounts:</strong> ';
            echo sprintf('%d business registration(s) awaiting approval.', $pending_count);
            echo '</p></div>';
        }
    }

    /**
     * Update user profile
     */
    public function update_user_profile($request) {
        $params = $request->get_json_params();
        $current_user = wp_get_current_user();

        if (!$current_user->ID) {
            return new WP_Error('not_authenticated', 'User not authenticated', array('status' => 401));
        }

        // Update basic user data
        $user_data = array('ID' => $current_user->ID);
        
        if (isset($params['firstName'])) {
            $user_data['first_name'] = sanitize_text_field($params['firstName']);
        }
        if (isset($params['lastName'])) {
            $user_data['last_name'] = sanitize_text_field($params['lastName']);
        }

        wp_update_user($user_data);

        // Update user meta
        if (isset($params['phone'])) {
            update_user_meta($current_user->ID, 'mobile_phone', sanitize_text_field($params['phone']));
            update_user_meta($current_user->ID, 'billing_phone', sanitize_text_field($params['phone']));
        }
        
        // Support both old and new field names for current/billing address
        if (isset($params['currentAddress'])) {
            update_user_meta($current_user->ID, 'billing_address_1', sanitize_text_field($params['currentAddress']));
        } elseif (isset($params['address'])) {
            update_user_meta($current_user->ID, 'billing_address_1', sanitize_text_field($params['address']));
        }
        if (isset($params['currentCity'])) {
            update_user_meta($current_user->ID, 'billing_city', sanitize_text_field($params['currentCity']));
        } elseif (isset($params['city'])) {
            update_user_meta($current_user->ID, 'billing_city', sanitize_text_field($params['city']));
        }
        if (isset($params['currentProvince'])) {
            update_user_meta($current_user->ID, 'billing_state', sanitize_text_field($params['currentProvince']));
        } elseif (isset($params['province'])) {
            update_user_meta($current_user->ID, 'billing_state', sanitize_text_field($params['province']));
        }
        if (isset($params['currentPostalCode'])) {
            update_user_meta($current_user->ID, 'billing_postcode', sanitize_text_field($params['currentPostalCode']));
        } elseif (isset($params['postalCode'])) {
            update_user_meta($current_user->ID, 'billing_postcode', sanitize_text_field($params['postalCode']));
        }
        if (isset($params['currentCountry'])) {
            update_user_meta($current_user->ID, 'billing_country', sanitize_text_field($params['currentCountry']));
        }

        // Update shipping address
        if (isset($params['shippingAddress'])) {
            update_user_meta($current_user->ID, 'shipping_address_1', sanitize_text_field($params['shippingAddress']));
        }
        if (isset($params['shippingCity'])) {
            update_user_meta($current_user->ID, 'shipping_city', sanitize_text_field($params['shippingCity']));
        }
        if (isset($params['shippingProvince'])) {
            update_user_meta($current_user->ID, 'shipping_state', sanitize_text_field($params['shippingProvince']));
        }
        if (isset($params['shippingPostalCode'])) {
            update_user_meta($current_user->ID, 'shipping_postcode', sanitize_text_field($params['shippingPostalCode']));
        }
        if (isset($params['shippingCountry'])) {
            update_user_meta($current_user->ID, 'shipping_country', sanitize_text_field($params['shippingCountry']));
        }

        // Business fields
        if (isset($params['companyName'])) {
            update_user_meta($current_user->ID, 'business_name', sanitize_text_field($params['companyName']));
            update_user_meta($current_user->ID, 'billing_company', sanitize_text_field($params['companyName']));
        }
        if (isset($params['taxId'])) {
            update_user_meta($current_user->ID, 'tax_id', sanitize_text_field($params['taxId']));
        }
        if (isset($params['businessAddress'])) {
            update_user_meta($current_user->ID, 'business_address', sanitize_text_field($params['businessAddress']));
        }

        // Profile picture/avatar
        if (isset($params['avatar']) && !empty($params['avatar'])) {
            // Sanitize the URL to ensure it's valid
            $avatar_url = esc_url_raw($params['avatar']);
            
            // Verify it's from our WordPress media library or a trusted source
            $site_url = get_site_url();
            if (strpos($avatar_url, $site_url) === 0 || filter_var($avatar_url, FILTER_VALIDATE_URL)) {
                update_user_meta($current_user->ID, 'profile_picture', $avatar_url);
                $this->log_message("Profile picture updated for user ID: {$current_user->ID}");
            } else {
                $this->log_message("Invalid avatar URL rejected for user ID: {$current_user->ID}");
            }
        }

        $this->log_message("Profile updated for user ID: {$current_user->ID}");

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Profile updated successfully'
        ));
    }

    /**
     * Get user addresses (billing & shipping)
     */
    public function get_user_addresses($request) {
        $current_user = wp_get_current_user();

        if (!$current_user->ID) {
            return new WP_Error('not_authenticated', 'User not authenticated', array('status' => 401));
        }

        $addresses = array(
            'billing' => array(
                'firstName' => get_user_meta($current_user->ID, 'billing_first_name', true) ?: $current_user->first_name,
                'lastName' => get_user_meta($current_user->ID, 'billing_last_name', true) ?: $current_user->last_name,
                'company' => get_user_meta($current_user->ID, 'billing_company', true),
                'address1' => get_user_meta($current_user->ID, 'billing_address_1', true),
                'address2' => get_user_meta($current_user->ID, 'billing_address_2', true),
                'city' => get_user_meta($current_user->ID, 'billing_city', true),
                'state' => get_user_meta($current_user->ID, 'billing_state', true),
                'postcode' => get_user_meta($current_user->ID, 'billing_postcode', true),
                'country' => get_user_meta($current_user->ID, 'billing_country', true) ?: 'CA',
                'phone' => get_user_meta($current_user->ID, 'billing_phone', true) ?: get_user_meta($current_user->ID, 'mobile_phone', true),
                'email' => $current_user->user_email,
            ),
            'shipping' => array(
                'firstName' => get_user_meta($current_user->ID, 'shipping_first_name', true) ?: $current_user->first_name,
                'lastName' => get_user_meta($current_user->ID, 'shipping_last_name', true) ?: $current_user->last_name,
                'company' => get_user_meta($current_user->ID, 'shipping_company', true),
                'address1' => get_user_meta($current_user->ID, 'shipping_address_1', true),
                'address2' => get_user_meta($current_user->ID, 'shipping_address_2', true),
                'city' => get_user_meta($current_user->ID, 'shipping_city', true),
                'state' => get_user_meta($current_user->ID, 'shipping_state', true),
                'postcode' => get_user_meta($current_user->ID, 'shipping_postcode', true),
                'country' => get_user_meta($current_user->ID, 'shipping_country', true) ?: 'CA',
            ),
        );

        return rest_ensure_response($addresses);
    }

    /**
     * Update user addresses
     */
    public function update_user_addresses($request) {
        $params = $request->get_json_params();
        $current_user = wp_get_current_user();

        if (!$current_user->ID) {
            return new WP_Error('not_authenticated', 'User not authenticated', array('status' => 401));
        }

        // Update billing address
        if (isset($params['billing'])) {
            $billing = $params['billing'];
            if (isset($billing['firstName'])) update_user_meta($current_user->ID, 'billing_first_name', sanitize_text_field($billing['firstName']));
            if (isset($billing['lastName'])) update_user_meta($current_user->ID, 'billing_last_name', sanitize_text_field($billing['lastName']));
            if (isset($billing['company'])) update_user_meta($current_user->ID, 'billing_company', sanitize_text_field($billing['company']));
            if (isset($billing['address1'])) update_user_meta($current_user->ID, 'billing_address_1', sanitize_text_field($billing['address1']));
            if (isset($billing['address2'])) update_user_meta($current_user->ID, 'billing_address_2', sanitize_text_field($billing['address2']));
            if (isset($billing['city'])) update_user_meta($current_user->ID, 'billing_city', sanitize_text_field($billing['city']));
            if (isset($billing['state'])) update_user_meta($current_user->ID, 'billing_state', sanitize_text_field($billing['state']));
            if (isset($billing['postcode'])) update_user_meta($current_user->ID, 'billing_postcode', sanitize_text_field($billing['postcode']));
            if (isset($billing['country'])) update_user_meta($current_user->ID, 'billing_country', sanitize_text_field($billing['country']));
            if (isset($billing['phone'])) update_user_meta($current_user->ID, 'billing_phone', sanitize_text_field($billing['phone']));
        }

        // Update shipping address
        if (isset($params['shipping'])) {
            $shipping = $params['shipping'];
            if (isset($shipping['firstName'])) update_user_meta($current_user->ID, 'shipping_first_name', sanitize_text_field($shipping['firstName']));
            if (isset($shipping['lastName'])) update_user_meta($current_user->ID, 'shipping_last_name', sanitize_text_field($shipping['lastName']));
            if (isset($shipping['company'])) update_user_meta($current_user->ID, 'shipping_company', sanitize_text_field($shipping['company']));
            if (isset($shipping['address1'])) update_user_meta($current_user->ID, 'shipping_address_1', sanitize_text_field($shipping['address1']));
            if (isset($shipping['address2'])) update_user_meta($current_user->ID, 'shipping_address_2', sanitize_text_field($shipping['address2']));
            if (isset($shipping['city'])) update_user_meta($current_user->ID, 'shipping_city', sanitize_text_field($shipping['city']));
            if (isset($shipping['state'])) update_user_meta($current_user->ID, 'shipping_state', sanitize_text_field($shipping['state']));
            if (isset($shipping['postcode'])) update_user_meta($current_user->ID, 'shipping_postcode', sanitize_text_field($shipping['postcode']));
            if (isset($shipping['country'])) update_user_meta($current_user->ID, 'shipping_country', sanitize_text_field($shipping['country']));
        }

        $this->log_message("Addresses updated for user ID: {$current_user->ID}");

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Addresses updated successfully'
        ));
    }

    /**
     * Check if user is authenticated
     */
    public function check_authentication($request) {
        return is_user_logged_in();
    }

    /**
     * Check if user is admin
     */
    public function check_admin($request) {
        return current_user_can('manage_options');
    }

    /**
     * Log message to debug.log
     */
    private function log_message($message) {
        if (WP_DEBUG_LOG) {
            error_log('[Zanobia Business Accounts] ' . $message);
        }
    }
}

// Initialize plugin
new Zanobia_Business_Accounts();

/**
 * Handle admin approval and unverify actions via URL click
 */
add_action('admin_init', function() {
    // ===== APPROVE BUSINESS ACTION =====
    if (isset($_GET['action']) && $_GET['action'] === 'approve_business' && isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'approve_business_' . $user_id)) {
            wp_die('Invalid security token');
        }

        // Check admin permission
        if (!current_user_can('edit_users')) {
            wp_die('Insufficient permissions');
        }

        // Approve user
        $user = get_userdata($user_id);
        if ($user && in_array('pending_business', $user->roles)) {
            $user->set_role('business_verified');
            
            // Redirect back with success message
            wp_redirect(add_query_arg(array(
                'approved' => 'success',
                'user' => $user_id,
            ), admin_url('users.php')));
            exit;
        }
    }
    
    // ===== UNVERIFY BUSINESS ACTION =====
    if (isset($_GET['action']) && $_GET['action'] === 'unverify_business' && isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'unverify_business_' . $user_id)) {
            wp_die('Invalid security token');
        }

        // Check admin permission
        if (!current_user_can('edit_users')) {
            wp_die('Insufficient permissions');
        }

        // Unverify user (move back to pending)
        $user = get_userdata($user_id);
        if ($user && in_array('business_verified', $user->roles)) {
            $user->set_role('pending_business');
            
            // Update business status meta
            update_user_meta($user_id, 'business_status', 'pending');
            
            // Log action
            if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
                error_log('[Zanobia] Business unverified for user ID: ' . $user_id);
            }
            
            // Redirect back with success message
            wp_redirect(add_query_arg(array(
                'unverified' => 'success',
                'user' => $user_id,
            ), admin_url('users.php')));
            exit;
        }
    }

    // ===== SHOW SUCCESS MESSAGES =====
    
    // Show approval success message
    if (isset($_GET['approved']) && $_GET['approved'] === 'success') {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p><strong>Success!</strong> Business account has been approved.</p>';
            echo '</div>';
        });
    }
    
    // Show unverify success message
    if (isset($_GET['unverified']) && $_GET['unverified'] === 'success') {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p><strong>Notice:</strong> Business account has been unverified and moved back to pending status.</p>';
            echo '</div>';
        });
    }
});

// ============================================================================
// ADMIN USER TABLE CUSTOMIZATION
// Adds Business Name and Business Status columns to Users → All Users table
// ============================================================================

/**
 * Add custom columns to the Users table in WordPress admin
 * 
 * Adds two new columns after the "Email" column:
 * 1. Business Name - from user meta 'business_name'
 * 2. Business Status - from user meta 'business_status'
 * 
 * Columns are hidden when viewing only "Customer" role to keep the table clean
 */
add_filter('manage_users_columns', 'zanobia_add_business_columns');
function zanobia_add_business_columns($columns) {
    // Check if we're filtering by customer role only
    $current_role = isset($_GET['role']) ? sanitize_text_field($_GET['role']) : '';
    
    // Hide business columns when viewing only customers
    if ($current_role === 'customer') {
        return $columns; // Return original columns without adding business columns
    }
    
    // Insert new columns after 'email'
    $new_columns = array();
    
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        
        // Add our custom columns right after the email column
        if ($key === 'email') {
            $new_columns['business_name'] = __('Business Name', 'zanobia-business');
            $new_columns['business_status'] = __('Business Status', 'zanobia-business');
        }
    }
    
    return $new_columns;
}

/**
 * Populate custom column values for each user row
 * 
 * Displays:
 * - Business Name: The company name from user meta
 * - Business Status: Color-coded status (Approved, Pending, N/A)
 */
add_filter('manage_users_custom_column', 'zanobia_show_business_column_content', 10, 3);
function zanobia_show_business_column_content($value, $column_name, $user_id) {
    switch ($column_name) {
        case 'business_name':
            // Get business name from user meta
            $business_name = get_user_meta($user_id, 'business_name', true);
            
            if (!empty($business_name)) {
                return '<strong>' . esc_html($business_name) . '</strong>';
            } else {
                return '<span style="color: #999; font-style: italic;">—</span>';
            }
            break;
            
        case 'business_status':
            // Get business status from user meta
            $business_status = get_user_meta($user_id, 'business_status', true);
            
            if (empty($business_status)) {
                // Check user role as fallback
                $user = get_userdata($user_id);
                if (in_array('business_verified', $user->roles)) {
                    $business_status = 'approved';
                } elseif (in_array('pending_business', $user->roles)) {
                    $business_status = 'pending';
                } else {
                    $business_status = 'n/a';
                }
            }
            
            // Display status with color coding
            switch (strtolower($business_status)) {
                case 'approved':
                    return '<strong style="color: #46a049; font-weight: bold;">✓ Approved</strong>';
                    break;
                    
                case 'pending':
                    return '<strong style="color: #ff9800; font-weight: bold;">⏳ Pending</strong>';
                    break;
                    
                default:
                    return '<span style="color: #999;">N/A</span>';
            }
            break;
    }
    
    return $value;
}

/**
 * Make the Business Name column sortable
 * 
 * Allows admins to sort users by their business name
 */
add_filter('manage_users_sortable_columns', 'zanobia_make_business_name_sortable');
function zanobia_make_business_name_sortable($columns) {
    $columns['business_name'] = 'business_name';
    return $columns;
}

/**
 * Handle the sorting logic for Business Name column
 * 
 * Modifies the user query to order by business_name meta value
 */
add_action('pre_get_users', 'zanobia_sort_users_by_business_name', 5);
function zanobia_sort_users_by_business_name($query) {
    global $pagenow;
    
    // Only run in admin area on users.php
    if (!is_admin() || $pagenow !== 'users.php') {
        return;
    }
    
    // Check if we're sorting by business_name
    $orderby = $query->get('orderby');
    
    if ('business_name' === $orderby) {
        $query->set('meta_key', 'business_name');
        $query->set('orderby', 'meta_value');
    }
}

// ============================================================================
// END: ADMIN USER TABLE CUSTOMIZATION
// ============================================================================

// ============================================================================
// ADMIN USER LIST FILTERS - ENHANCED ROLE LINKS
// Adds custom role filter links to WordPress native role filter system
// ============================================================================

/**
 * Add custom role filter links to the WordPress Users page
 * 
 * Integrates with the existing "All | Administrator | Customer" links
 * Adds new links for:
 * - All Business (both pending + verified)
 * - Pending Business (only pending)
 * - Business Verified (only verified)
 */
add_filter('views_users', 'zanobia_add_business_role_filter_links');
function zanobia_add_business_role_filter_links($views) {
    // Get user counts for each business role
    $pending_users = count_users();
    $pending_count = isset($pending_users['avail_roles']['pending_business']) ? $pending_users['avail_roles']['pending_business'] : 0;
    $verified_count = isset($pending_users['avail_roles']['business_verified']) ? $pending_users['avail_roles']['business_verified'] : 0;
    $all_business_count = $pending_count + $verified_count;
    
    // Get current page URL
    $current_role = isset($_GET['role']) ? $_GET['role'] : '';
    
    // Build base URL for filters
    $base_url = admin_url('users.php');
    
    // Add "All Business" link (combines pending + verified)
    if ($all_business_count > 0) {
        $class = ($current_role === 'all_business') ? 'current' : '';
        $views['all_business'] = sprintf(
            '<a href="%s" class="%s">🏢 All Business <span class="count">(%s)</span></a>',
            add_query_arg('role', 'all_business', $base_url),
            $class,
            number_format_i18n($all_business_count)
        );
    }
    
    // Add "Pending Business" link
    if ($pending_count > 0) {
        $class = ($current_role === 'pending_business') ? 'current' : '';
        $views['pending_business'] = sprintf(
            '<a href="%s" class="%s">⏳ Pending Business <span class="count">(%s)</span></a>',
            add_query_arg('role', 'pending_business', $base_url),
            $class,
            number_format_i18n($pending_count)
        );
    }
    
    // Add "Business Verified" link
    if ($verified_count > 0) {
        $class = ($current_role === 'business_verified') ? 'current' : '';
        $views['business_verified'] = sprintf(
            '<a href="%s" class="%s">✓ Business Verified <span class="count">(%s)</span></a>',
            add_query_arg('role', 'business_verified', $base_url),
            $class,
            number_format_i18n($verified_count)
        );
    }
    
    return $views;
}

/**
 * Handle the "All Business" custom role filter
 * 
 * WordPress doesn't have a native "all_business" role, so we need to
 * intercept this and show both pending_business and business_verified users
 */
add_filter('pre_get_users', 'zanobia_handle_all_business_filter', 10, 1);
function zanobia_handle_all_business_filter($query) {
    global $pagenow;
    
    // Only run on users.php page in admin
    if (!is_admin() || $pagenow !== 'users.php') {
        return $query;
    }
    
    // Check if filtering by "all_business"
    $current_role = isset($_GET['role']) ? sanitize_text_field($_GET['role']) : '';
    
    if ($current_role === 'all_business') {
        // Remove any existing role filter
        $query->query_vars['role'] = '';
        
        // Show both pending and verified business users
        $query->set('role__in', array('pending_business', 'business_verified'));
        
        // Debug log
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            error_log('[Zanobia Filter] Showing all business users (pending + verified)');
            error_log('[Zanobia Filter] Query roles: ' . print_r($query->query_vars['role__in'], true));
        }
    }
    
    return $query;
}

// ============================================================================
// END: ADMIN USER LIST FILTERS
// ============================================================================

