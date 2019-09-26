/**
 * BLOCK: animated svg background
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
    RichText,
    ColorPalette,
    PanelColorSettings,
    getFontSize,
    getFontSizeClass,
    getColorClassName,
    getColorObjectByColorValue,
} = wp.blockEditor;
const { Fragment} = wp.element;
const { Button, PanelBody, IconButton , Toolbar, FontSizePicker,
withFontSizes, } = wp.components;

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
  styles: [
    // Mark style as default.
      {
          name: 'default',
          label: __( 'Squared' ),
          isDefault: true
      },
      {
          name: 'rounded',
          label: __( 'Rounded' )
      },
      {
          name: 'circle',
          label: __( 'Circle' )
      },
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
    backgroundColor: {
      type: 'string',
    },
    textColor: {
      type: 'string',
    },
    customBackgroundColor: {
      type: 'string',
    },
    customTextColor: {
      type: 'string',
    },
    textSize: {
      type: 'string'
    },
    customTextSize: {
      type: 'number',
    }
  },
  supports:{
    align: [ 'left', 'center', 'right' ]
  },
 edit: ( props ) => {
   const {
     attributes:
     {
       content,
       mediaUrl,
       mediaId,
       align,
       customTextSize,
       textSize,
       textColor,
       customTextColor,
       backgroundColor,
       customBackgroundColor
     }, setAttributes, className } = props;

  const settings = select( 'core/editor' ).getEditorSettings();

  //console.info(settings);

   const onChangeContent = ( newContent ) => {
       props.setAttributes( { content: newContent } );

   };

   const onChangeMediaId = ( x ) => {
       props.setAttributes( { mediaId: x } );
   };

   const onSelectMedia = ( media ) => {
     //console.info(media);
			if ( ! media || ! media.url ) {
				setAttributes( { mediaUrl: undefined, mediaId: undefined } );
				return;
			}
			setAttributes( {
				mediaUrl: media.url,
				mediaId: media.id

      		} );
    };

    const fontSizeClass = getFontSizeClass( textSize );

    const setFontSize =  ( newFontSize ) => {
        props.setAttributes( { customTextSize: newFontSize } );
        props.setAttributes( { textSize: false } );
        for(var i= 0, l = settings.fontSizes.length; i< l; i++){
          if(settings.fontSizes[i]['size'] === newFontSize){
            props.setAttributes( { textSize: settings.fontSizes[i]['name']} );
            break;
          }
        }
    };

    const setBackgroundColor =  ( newBackgroundColor ) => {
      const textBackgroundColorObj = getColorObjectByColorValue( settings.colors, newBackgroundColor );
      if (textBackgroundColorObj) {
        const classBackN = getColorClassName( 'background-color', textBackgroundColorObj.slug );
        props.setAttributes( { backgroundColor: classBackN } );
      }else {
        props.setAttributes( { backgroundColor: undefined } );
      }
      props.setAttributes( { customBackgroundColor: newBackgroundColor } );
    };

    const setTextColor =  ( newTextColor ) => {
      const textColorObj = getColorObjectByColorValue( settings.colors, newTextColor );
      if (textColorObj) {
        const classN = getColorClassName( 'color', textColorObj.slug );
        props.setAttributes( { textColor: classN } );
      }else {
        props.setAttributes( { textColor: undefined } );
      }
      props.setAttributes( { customTextColor: newTextColor } );
    };

		return (
      <Fragment>
      {
        <InspectorControls>
              <PanelBody title={ __( 'Text Settings' ) } className="blocks-font-size" initialOpen={ false } >
                <FontSizePicker
                  fontSizes={ settings.fontSizes }
                  value={ customTextSize }
                  onChange={ setFontSize }
                />
              </PanelBody>
              <PanelColorSettings
                title={ __( 'Color Settings' ) }
                initialOpen={ false }
                colorSettings={ [
                  {
                    value: customBackgroundColor,
                    onChange: setBackgroundColor,
                    label: __( 'Background Color' ),
                  },
                  {
                    value: customTextColor,
                    onChange: setTextColor,
                    label: __( 'Text Color' ),
                  },
                ] }
              >
              </PanelColorSettings>
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
          <div className={ classnames( align, className, {
                    'has-text-color': textColor,
                    'has-background': backgroundColor,
                    [ backgroundColor ]: backgroundColor,
                    [ textColor ]: textColor,
                    [ fontSizeClass ]: textSize,
          } ) }
          style={{
                  fontSize: customTextSize+"px",
                  textAlign: align,
                  color: customTextColor,
                  backgroundColor: customBackgroundColor
          }} >
            <div className={ "inner-wrap" }>
              <img className={ 'icon' } src={ mediaUrl } />
              <RichText
                  className={ 'wp-block-paragraph' }
                  style={{
                          fontSize: customTextSize+"px",
                          textAlign: align,
                          color: customTextColor,
                          backgroundColor: customBackgroundColor
                  }}
                  placeholder={ __( 'Enter your text here' ) }
                  tagName={ 'div' }
                  value={ content }
                  onChange={ ( x ) => { props.setAttributes( { content: x } ) } }
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
    const { content,
            mediaUrl,
            mediaId,
            align,
            customTextSize,
            textSize,
            textColor,
            customTextColor,
            backgroundColor,
            customBackgroundColor
    } = props.attributes;

    const settings = select( 'core/editor' ).getEditorSettings();

    const fontSizeClass = getFontSizeClass( textSize );

    const classNames = classnames( { className,
      'has-text-color': textColor || customTextColor,
      'has-background': backgroundColor || customBackgroundColor,
      [ fontSizeClass ]: fontSizeClass,
      [ textColor ]: textColor,
      [ backgroundColor ]: backgroundColor,
    } );



    const styles = {
      backgroundColor: backgroundColor ? undefined : customBackgroundColor,
      color: textColor ? undefined : customTextColor,
      fontSize: fontSizeClass ? undefined : customTextSize,
      textAlign: align,
    };

		return (

      <div
        style={ styles ? styles : undefined }
        className={ classNames ? classNames : undefined }
      >

      <div className={ 'inner-wrap' }>
        <img className={ 'icon'  } src={ mediaUrl } />
        <RichText.Content
          tagName={ 'div' }
          style={ '' }
          className={ 'wp-block-paragraph'  }
          value={ content }
        />
        </div>
      </div>

		);
	},
  deprecated: [
      {
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
        save( props, className ) {
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
      }
  ]
} );
