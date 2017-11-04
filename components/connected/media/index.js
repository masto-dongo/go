//  <ConnectedMedia>
//  ================

//  <ConnectedMedia> presents a single media item.  It is intentionally
//  general so that it can be used both in media galleries and with the
//  media uploader in the compose area.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import ConnectedMediaGifv from './gifv';
import ConnectedMediaImage from './image';
import ConnectedMediaUnknown from './unknown';
import ConnectedMediaVideo from './video';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Media extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
  }

  //  Click handling.
  handleClick () {
    //  TK
  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      className,
      targetWidth,
      ℳ,
      '🏪': {
        autoplay,
        description,
        href,
        previewSrc,
        previewWidth,
        src,
        type,
        width,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--MEDIA', function () {
      switch (type) {
      case MEDIA_TYPE.IMAGE:
        return 'image';
      case MEDIA_TYPE.GIFV:
        return 'gifv';
      case MEDIA_TYPE.VIDEO:
        return 'video';
      default:
        return 'unknown';
      }
    }(), className);

    //  We pass the appropriate props to the necessary component
    //  depending on our `type`.
    switch (type) {
    case MEDIA_TYPE.IMAGE:
      return (
        <ConnectedMediaImage
          className={computedClass}
          description={description}
          href={href}
          onClick={handleClick}
          previewSrc={previewSrc}
          previewWidth={previewWidth}
          src={src}
          targetWidth={targetWidth}
          width={width}
          ℳ={ℳ}
        />
      );
    case MEDIA_TYPE.GIFV:
      return (
        <ConnectedMediaGifv
          autoplay={autoplay}
          className={computedClass}
          description={description}
          href={href}
          onClick={handleClick}
          previewSrc={previewSrc}
          src={src}
          ℳ={ℳ}
        />
      );
    case MEDIA_TYPE.VIDEO:
      return (
        <ConnectedMediaVideo
          autoplay={autoplay}
          className={computedClass}
          description={description}
          href={href}
          onClick={handleClick}
          previewSrc={previewSrc}
          src={src}
          ℳ={ℳ}
        />
      );
    default:
      return (
        <ConnectedMediaUnknown
          className={computedClass}
          description={description}
          href={href}
        />
      );
    }
  }

}

//  Props.
Media.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,  //  The media's id
  targetWidth: PropTypes.number,  //  A target width for the media; purely advisory
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    autoplay: PropTypes.bool,  //  Whether to autoplay moving media
    description: PropTypes.string,  //  A label for the media item
    height: PropTypes.number,  //  The height of the media
    href: PropTypes.string,  //  A link to the original version of the media
    previewSrc: PropTypes.string,  //  The URL of the preview source
    previewWidth: PropTypes.number,  //  The width of the preview image
    src: PropTypes.string,  //  The URL of the media source
    type: PropTypes.number,  //  A `MEDIA_TYPE`
    width: PropTypes.number,  //  The width of the media
  }).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedMedia = connect(

  //  Component.
  Media,

  //  Store.
  createStructuredSelector({
    autoplay: state => state.getIn(['meta', 'autoplay']),
    description: (state, { id }) => state.getIn(['attachment', id, 'description']),
    height: (state, { id }) => state.getIn(['attachment', id, 'height']),
    href: (state, { id }) => state.getIn(['attachment', id, 'href']),
    previewSrc: (state, { id }) => state.getIn([
      'attachment',
      id,
      'preview',
      'src',
    ]),
    previewWidth: (state, { id }) => state.getIn([
      'attachment',
      id,
      'preview',
      'width',
    ]),
    src: (state, { id }) => state.getIn([
      'attachment',
      id,
      'src',
      'local',
    ]),
    type: (state, { id }) => state.getIn(['attachment', id, 'type']),
    width: (state, { id }) => state.getIn(['attachment', id, 'width']),
  }),

  //  Messages.
  defineMessages({
    imageExpand: {
      defaultMessage: 'Expand image',
      description: 'Displayed as the label for an image or gifv',
      id: 'attachment.expand',
    },
    videoError: {
      defaultMessage: 'Video could not be played',
      description: 'Displayed when there is an error loading a video',
      id: 'attachment.video_error',
    },
    videoExpand: {
      defaultMessage: 'Expand video',
      description: 'Displayed as the label for a loaded video',
      id: 'attachment.videoExpand',
    },
    videoMute: {
      defaultMessage: 'Toggle sound',
      description: 'Displayed as the label for the mute button',
      id: 'attachment.videoMute',
    },
    videoOpen: {
      defaultMessage: 'Open video',
      description: 'Displayed as the label for an unloaded video',
      id: 'attachment.videoOpen',
    },
    videoPause: {
      defaultMessage: 'Pause video',
      description: 'Displayed as the label for the pause button',
      id: 'attachment.videoPause',
    },
    videoPlay: {
      defaultMessage: 'Play video',
      description: 'Displayed as the label for the play button',
      id: 'attachment.videoPlay',
    },
  })
);

//  Exporting.
export { ConnectedMedia as default };
