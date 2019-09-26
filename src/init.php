<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package wcct
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function wcct_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'wcct-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'wcct-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'wcct-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'wcct-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-wcct', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'wcct-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'wcct-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'wcct-block-editor-css',
		)
	);
}

// Hook: Block assets.
add_action( 'init', 'wcct_cgb_block_assets' );



function gutenberg_examples_05_dynamic_render_callback( $attributes, $content ) {
    $recent_posts = wp_get_recent_posts( array(
        'numberposts' => 1,
        'post_status' => 'publish',
    ) );
    if ( count( $recent_posts ) === 0 ) {
        return 'No posts';
    }
    $post = $recent_posts[ 0 ];
    $post_id = $post['ID'];
		$att = $attributes;
    return sprintf(
        '<a class="wp-block-my-plugin-latest-post" href="%1$s">%2$s</a>%3$s',
        esc_url( get_permalink( $post_id ) ),
				esc_html( get_the_title( $post_id ) ),
        print_r(  $att  )
    );
		//return print_r($attributes);
}

function gutenberg_examples_05_dynamic() {


    register_block_type( 'gutenberg-examples/example-05-dynamic', array(
        'editor_script' => 'gutenberg-examples-05',
        'render_callback' => 'gutenberg_examples_05_dynamic_render_callback'
    ) );

}
add_action( 'init', 'gutenberg_examples_05_dynamic' );

add_action('wp_footer' , 'wcct_frontend_scripts');

function wcct_frontend_scripts(){
	if (has_block('wcct/accordion')) {
		wp_enqueue_script('wcct-block-accordion', plugins_url( 'dist/front.js', dirname( __FILE__ ) )	);
	}
}
