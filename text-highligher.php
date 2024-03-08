<?php
/**
 * Text Highlight
 *
 * @package           Text Highlight
 * @author            Matthew Szklarz
 * @copyright         2019 Mendix
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Text Highlight
 * Plugin URI: www.mendix.com
 * Description: Shim for browsers that don‘t highlight text using "Copy Link to Highlight" URL
 * Version: 1.0
 * Author: Matthew Szklarz
 * Author URI: www.mendix.com
 * License: MIT
 * License URI: www.mit.com
 */


/**
 * Apparently this can also be automated with out a hook by using a naming convention activate_PLUGINNAME,
 * ex: if sample.php the name of this file, hook will be ‘activate_sample.php’.
 */
function txthi_on_activate() {
	// Clear the permalinks to remove our post type's rules from the database.
	flush_rewrite_rules();
}

// note __FILE__ is a php 'magic constant' that will list the current file
// path with symlinks resolved
register_activation_hook( __FILE__, 'txthi_on_activate' );

/**
 *
 */
function txthi_on_deactivate() {
	// Clear the permalinks to remove our post type's rules from the database.
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'txthi_on_deactivate' );

/**
 * Undocumented function
 *
 * @return void
 */
function txthi_enqueue_scripts() {

	if ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
		$agent = wp_unslash( $_SERVER['HTTP_USER_AGENT'] );

		if ( str_contains( strtolower( $agent ), 'firefox' ) ) {
			wp_enqueue_script( 'text-highlight', plugins_url( '/js/main.js', __FILE__ ) );
		}
	}
}

if ( ! is_admin() ) {
	add_action( 'wp_enqueue_scripts', 'txthi_enqueue_scripts' );
}
