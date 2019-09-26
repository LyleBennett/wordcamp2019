/**
 * BLOCK: 
 *
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import classnames from 'classnames';
import icons from './components/icons';

const { select } = wp.data;
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
    BlockControls,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    MediaPlaceholder,
    RichText
} = wp.blockEditor;
const { Fragment} = wp.element;
const { TextControl, TextareaControl, Button, PanelBody, IconButton , Toolbar } = wp.components;

/**
 * Register: the Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

const blockIcon = {};


registerBlockType( 'wccpt/iconblock', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Cape Icon Block' ), // Block title.
  description: __( 'Block with icon and text below' ),
	icon: icons.blockMenu, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wordcamp' ),
		__( 'icon' ),
		__( 'cape' ),
	],

  attributes: {
    content: {
      type: 'string',
    },
    mediaId: {
      type: 'string',
    },
    mediaUrl: {
      type: 'string',
    },
    align:{
      type: 'string',
      default: 'center'
    },
  },
  supports:{
    align: [ 'full' , 'wide', 'left', 'center', 'right' ]
  },
 edit: ( props ) => {
   const {
     attributes:
     {
       content,
       mediaUrl,
       mediaId,
       align
     }, setAttributes, className } = props;

   const onChangeContent = ( newContent ) => {
       props.setAttributes( { content: newContent } );

   };

   const onChangeMediaId = ( x ) => {
       props.setAttributes( { mediaId: x } );
   };

   const onSelectMedia = ( media ) => {
     console.info(media);
			if ( ! media || ! media.url ) {
				setAttributes( { mediaUrl: undefined, mediaId: undefined } );
				return;
			}
			setAttributes( {
				mediaUrl: media.url,
				mediaId: media.id

      		} );
    };

		return (
      <Fragment>
      {
        <InspectorControls>

                <div>
                  Image Link: { mediaUrl }
                </div>
          </InspectorControls>
      }
      <BlockControls>
					{ mediaUrl && (

							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ [ 'image' ] }
										value={ mediaId }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Change Icon' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</Toolbar>
							</MediaUploadCheck>

					) }
        </BlockControls>
        { ! mediaUrl && (
        <MediaPlaceholder
						icon={'upload'}
						className={ className }
						labels={ {
							title: 'Choose Icon',
							instructions: __( 'Upload an icon, or pick one from your media library.' ),
						} }
            value={ mediaId }
						onSelect={ onSelectMedia }
						accept="image"
						allowedTypes={ [ 'image' ] }
        />
        ) }
        { !! mediaUrl && (
          <div className={ classnames(className, align)  }>
            <div className={ "inner-wrap" }>
              <img className={ 'icon' } src={ mediaUrl } />
              <RichText
                  className={ 'wp-block-paragraph' }
                  style={{

                  }}
                  placeholder={ __( 'Enter your text here' ) }
                  tagName={ 'p' }
                  value={ content }
                  onChange={ onChangeContent }
              />
            </div>
          </div>

        )}
      </Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props, className ) {
    const { mediaId,
            mediaUrl,
            content
    } = props.attributes;

		return (

      <div className={ className }>
        <div className={ 'inner-wrap' }>
        <img className={ 'icon'  } src={ mediaUrl } />
        <RichText.Content
          tagName={ 'p' }
          style={ '' }
          className={ 'wp-block-paragraph'  }
          value={ content }
        />
        </div>
      </div>

		);
	},
} );
