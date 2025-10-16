<?php
/**
 * Plugin Name: Zanobia Test Plugin
 * Description: Simple test plugin to verify WordPress can read plugins
 * Version: 1.0.0
 * Author: Test
 */

// This is a minimal test plugin
// If this appears in WordPress Admin, your plugin system works

add_action('admin_notices', function() {
    echo '<div class="notice notice-success">';
    echo '<p><strong>Zanobia Test Plugin is Active!</strong> Your plugin system works correctly.</p>';
    echo '</div>';
});

