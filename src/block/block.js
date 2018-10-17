/**
 * BLOCK: mailpoetblock
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks
const {InspectorControls} = wp.editor;
const {PanelBody, SelectControl, ToggleControl, TextControl} = wp.components;
/**
 * Register: aa Gutenberg Block.
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
registerBlockType('jack/mailpoet', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __('Subscriber - Mailpoet'), // Block title.
    icon: 'email', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __('Mailpoet')
    ],
    attributes: {
        list: {
            type: 'string'
        },
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        label_inline: {
            type: 'string'
        },
        subscribe: {
            type: 'string'
        },
    },

    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    edit: function (props) {
        // Creates a <p class='wp-block-cgb-block-mailpoetblock'></p>.
        var list = props.attributes.list;
        var fname = props.attributes.first_name;
        var lname = props.attributes.last_name;
        var label_inline = props.attributes.label_inline;
        var subscribe = props.attributes.subscribe;

        var lists = window.jbmailpoet;
        var options = [];
        for (var i = 0; i < lists.length; i++) {
            options.push({
                label: lists[i].name,
                value: lists[i].id
            })
        }
        var fNameBlock = '';
        var lNameBlock = '';
        if (fname) {
            fNameBlock =
                (<div>
                        <label>{__('Firstname')}</label>
                        <input type={'text'} name={'firstname'}/>
                    </div>
                )
        }
        if (lname) {
            lNameBlock =
                (<div>
                        <label>{__('Lastname')}</label>
                        <input type={'text'} name={'lastname'}/>
                    </div>
                )
        }
        if (subscribe === undefined) {
            subscribe = __('Subscribe')
        }
        return (
            <div>
                <InspectorControls>
                    <PanelBody title={__('Pick a list', '')}>
                        <SelectControl label={__('List')}
                                       value={list}
                                       onChange={(value) => props.setAttributes({
                                           list: value
                                       })}
                                       options={options}
                        />
                        <ToggleControl label={__('Show first name')}
                                       checked={!!fname}
                                       onChange={(fname) => props.setAttributes({
                                           first_name: fname
                                       })}
                        />
                        <ToggleControl label={__('Show lastname name')}
                                       checked={!!lname}
                                       onChange={(lname) => props.setAttributes({
                                           last_name: lname
                                       })}
                        />
                        <ToggleControl label={__('Label inside input')}
                                       checked={!!label_inline}
                                       onChange={(label_inline) => props.setAttributes({
                                           label_inline: label_inline
                                       })}
                        />
                        <TextControl label={__("Subscribe button text")}
                                     value={subscribe}
                                     onChange={(subscribe) => props.setAttributes({
                                         subscribe: subscribe
                                     })}
                        />


                    </PanelBody>
                </InspectorControls>
                <form method={"post"}>
                    {fNameBlock}
                    {lNameBlock}
                    <div>
                        <label>{__('Email')}</label>
                        <input type={'text'} name={'email'}/>
                    </div>
                    <input type={'hidden'} name={'jmailpoetaction'} value={'subscribe'}/>
                    <div>
                        <button type={'submit'}>{subscribe}</button>
                    </div>
                </form>
            </div>
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
    save: function (props) {
        var list = props.attributes.list;
        var fname = props.attributes.first_name;
        var lname = props.attributes.last_name;
        var label_inline = props.attributes.label_inline;
        var subscribe = props.attributes.subscribe;
        var fNameBlock = '';
        var lNameBlock = '';
        if (fname) {
            if (label_inline) {
                fNameBlock =
                    (<div className={'jbmailpoet-input'}>
                            <input placeholder={__('Firstname')} type={'text'} name={'firstname'}/>
                            <input type={'hidden'} name={'requireFname'} value={1}/>
                        </div>
                    )
            } else {
                fNameBlock =
                    (<div className={'jbmailpoet-input'}>
                            <label>{__('Firstname')}</label>
                            <input type={'text'} name={'firstname'}/>
                            <input type={'hidden'} name={'requireFname'} value={1}/>
                        </div>
                    )
            }
        }
        if (lname) {
            if (label_inline) {
                lNameBlock =
                    (<div className={'jbmailpoet-input'}>
                            <input placeholder={__('Lastname')} type={'text'} name={'lastname'}/>
                            <input type={'hidden'} name={'requireLname'} value={1}/>
                        </div>
                    )
            } else {
                lNameBlock =
                    (<div className={'jbmailpoet-input'}>
                            <label>{__('Lastname')}</label>
                            <input type={'text'} name={'lastname'}/>
                            <input type={'hidden'} name={'requireLname'} value={1}/>
                        </div>
                    )
            }
        }
        var emailBlock = '';
        if (label_inline) {
            emailBlock = (<div className={'jbmailpoet-input'}>
                <input placeholder={__('Email')} type={'text'} name={'email'}/>
            </div>)
        } else {
            emailBlock = (<div className={'jbmailpoet-input'}>
                <label>{__('Email')}</label>
                <input type={'text'} name={'email'}/>
            </div>)
        }
        if (subscribe === undefined) {
            subscribe = __('Subscribe')
        }
        return (
            <form className={'jbmailpoet'} method={"post"}>
                <div className={'jbmailpoet-success'}></div>
                <div className={'jbmailpoet-error'}></div>
                {fNameBlock}
                {lNameBlock}
                {emailBlock}
                <input type={'hidden'} name={'jmailpoetaction'} value={'subscribe'}/>
                <input type={'hidden'} name={'jmailpoetlist'} value={list}/>
                <div className={'jbmailpoet-input'}>
                    <button type={'submit'}>{subscribe}</button>
                </div>
            </form>
        );
    },
});
