//  Package imports  //
import classNames from 'class-names';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AttachmentGifv from './gifv';
import AttachmentImage from './image';
import AttachmentVideo from './video';

import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

export default class Notification extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    observer: PropTypes.object,
    targetWidth: PropTypes.number,
    '🛄': PropTypes.shape({ intl: PropTypes.object }),
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

  render () {
    const {
      className,
      id,
      observer,
      targetWidth,
      '🛄': { intl },
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

    switch (type) {
    case MEDIA_TYPE.IMAGE:
      return (
        <AttachmentImage
          className={computedClass}
          description={description}
          href={href}
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
          preview={preview}
          src={src}
        />
      );
    default:
      return null;
    }
  }

}
