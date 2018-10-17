<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function mailpoetblock_cgb_block_assets() {
	// Styles.
	wp_enqueue_style(
		'mailpoetblock-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
	// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function mailpoetblock_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'mailpoetblock_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function mailpoetblock_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'mailpoetblock-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'mailpoetblock-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
	// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function mailpoetblock_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'mailpoetblock_cgb_editor_assets' );

add_action( 'wp_loaded', 'mailpoetblock_subscribe' );

function mailpoetblock_subscribe() {
	if ( isset( $_POST['jmailpoetaction'] ) && $_POST['jmailpoetaction'] == 'subscribe' ) {
		$email  = trim( $_POST['email'] );
		$list   = esc_attr( trim( $_POST['jmailpoetlist'] ) );
		$errors = array();
		$data   = array();
		if ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
			$errors[] = 'Email required';
		} else {
			$data['email'] = $email;
		}
		if ( isset( $_POST['requireFname'] ) ) {
			$firstname = esc_attr( trim( $_POST['firstname'] ) );
			if ( strlen( $firstname ) == 0 ) {
				$errors[] = 'Firstname required';
			} else {
				$data['first_name'] = $firstname;
			}
		}
		if ( isset( $_POST['requireLname'] ) ) {
			$lastname = esc_attr( trim( $_POST['lastname'] ) );
			if ( strlen( $lastname ) == 0 ) {
				$errors[] = 'Lastname required';
			} else {
				$data['last_name'] = $lastname;
			}
		}
		if ( count( $errors ) ) {
			update_option( 'jackblock_mailpoet_tmp', implode( '<br/>', $errors ) );
			add_action( 'wp_head', function () {
				$message = get_option( 'jackblock_mailpoet_tmp' );
				?>
                <script type="text/javascript">
                    jQuery(function ($) {
                        $('.jbmailpoet-error').html('<?php echo $message ?>')
                    })
                </script>
				<?php
			} );

			return;
		}
		$subscriber = \MailPoet\Models\Subscriber::subscribe( $data, array( $list ) );
		$errors     = $subscriber->getErrors();
		if ( $errors !== false ) {
			var_dump( $errors );
			die;
		} else {
			add_action( 'wp_head', function () {
				?>
                <script type="text/javascript">
                    jQuery(function ($) {
                        $('.jbmailpoet-success').html('Check your inbox or spam folder to confirm your subscription.')
                    })
                </script>
				<?php
			} );

			return;
		}
	}
}

add_action( 'admin_head', function () {
	if ( ! is_admin() ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$lists = \MailPoet\Models\Segment::getSegmentsForImport();
	$ids   = array();
	foreach ( $lists as $list ) {
		if ( $list['id'] == 1 ) {
			continue;
		}

		$ids[] = $list;
	}
	?>
    <script type="text/javascript">
        window.jbmailpoet =<?php echo json_encode( $ids ) ?>
    </script>
	<?php
} );