//  <AttachmentImage>
//  =================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

//  Our imports.
import CommonButton from 'themes/mastodon_go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  expand: {
    defaultMessage: 'Expand image',
    id: 'attachment.expand',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class AttachmentImage extends Immutable.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    href: PropTypes.string,
    preview: ImmutablePropTypes.map,
    src: PropTypes.string,
    targetWidth: PropTypes.number,
    width: PropTypes.number,
  };

  //  Item rendering.
  render () {
    const {
      className,
      description,
      href,
      preview,
      src,
      targetWidth,
      width,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--ATTACHMENT--IMAGE', className);

    const previewWidth = preview.get('width');
    let srcSet;
    let sizes;

    //  This lets the browser conditionally select the preview or
    //  original image depending on what the rendered size ends up
    //  being. (Note: Upstream Mastodon used media queries here, but
    //  because our page layout is user-configurable, we don't bother.)
    if (width && targetWidth) {
      srcSet = `${src} ${width}w, ${preview.get('src')} ${preview.get('width')}w`;
      sizes = `${targetWidth}px`;
    }

    //  Rendering. We render the item inside of a button+link, which
    //  provides the original.
    return (
      <CommonButton
        className={computedClass}
        href={href || src}
        title={intl.formatMessage(messages.expand)}
        {...rest}
      >
        <img
          alt={description}
          className='item\image'
          sizes={sizes}
          src={previewUrl}
          srcSet={srcSet}
          title={description}
        />
      </CommonButton>
    );
  }

}
