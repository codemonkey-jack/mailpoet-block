<?php
/**
 * Plugin Name: MailPoet Forms Block
 * Plugin URI: #
 * Description: Adds a MailPoet form block to Gutenberg
 * Author: Jack Kitterhing
 * Author URI: #
 * Version: 0.1
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
