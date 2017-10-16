/*********************************************************************\
|                                                                     |
|   <Attachment>                                                      |
|   ============                                                      |
|                                                                     |
|   <Attachment> presents a single media item.  It is intentionally   |
|   general so that it can be used both in media galleries and with   |
|   the media uploader in the compose area.  It needs two things to   |
|   function: the `id` of the attachment and the `targetWidth` that   |
|   describes its most likely rendered size.                          |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import AttachmentGifv from './gifv';
import AttachmentImage from './image';
import AttachmentVideo from './video';

//  Stylesheet imports.
import './style';

//  Other imports.
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Notification extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    targetWidth: PropTypes.number,
    '🛄': PropTypes.shape({}),
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      autoplay: PropTypes.bool,
      description: PropTypes.string,
      height: PropTypes.number,
      href: PropTypes.string,
      preview: ImmutablePropTypes.map,
      src: PropTypes.string,
      type: PropTypes.number.isRequired,
      width: PropTypes.number,
    }).isRequired,
  };

  //  Click handling.
  handleClick = e => {

  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      className,
      id,
      targetWidth,
      '🛄': context,
      '💪': handler,
      '🏪': {
        autoplay,
        description,
        href,
        preview,
        src,
        type,
        width,
      },
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--ATTACHMENT', className);

    //  We pass the appropriate props to `<AttachmentImage>`,
    //  `<AttachmentGifv>`, or `<AttachmentVideo>` depending on our
    //  `type`.
    switch (type) {
    case MEDIA_TYPE.IMAGE:
      return (
        <AttachmentImage
          className={computedClass}
          description={description}
          href={href}
          intl={intl}
          preview={preview}
          src={src}
          targetWidth={targetWidth}
          width={width}
        />
      );
    case MEDIA_TYPE.GIFV:
      return (
        <AttachmentGifv
          autoplay={autoplay}
          className={computedClass}
          description={description}
          href={href}
          intl={intl}
          preview={preview}
          src={src}
        />
      );
    case MEDIA_TYPE.VIDEO:
      return (
        <AttachmentVideo
          autoplay={autoplay}
          className={computedClass}
          description={description}
          href={href}
          intl={intl}
          preview={preview}
          src={src}
        />
      );
    default:
      return null;
    }
  }

}
