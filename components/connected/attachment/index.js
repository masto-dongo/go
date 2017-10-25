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
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import AttachmentGifv from './gifv';
import AttachmentImage from './image';
import AttachmentVideo from './video';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Attachment extends React.PureComponent {

  constructor (props) {
    super(props);

    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
  }

  //  Click handling.
  handleClick (e) {

  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      className,
      id,
      targetWidth,
      ℳ,
      '🏪': {
        autoplay,
        description,
        href,
        preview,
        src,
        type,
        width,
      },
      '💪': handler,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--ATTACHMENT', className);

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
          preview={preview}
          src={src}
          targetWidth={targetWidth}
          width={width}
          ℳ={ℳ}
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
          ℳ={ℳ}
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
          ℳ={ℳ}
        />
      );
    default:
      return null;
    }
  }

}

//  Props.
Attachment.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  targetWidth: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
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
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedAttachment = connect(

  //  Component.
  Attachment,

  //  Store.
  createStructuredSelector({
    autoplay: state => state.getIn(['meta', 'autoplay']),
    description: (state, { id }) => state.getIn(['attachment', id, 'description']),
    height: (state, { id }) => state.getIn(['attachment', id, 'height']),
    href: (state, { id }) => state.getIn([
      'attachment', id, 'src', 'remote',
    ]),
    preview: (state, { id }) => state.getIn(['attachment', id, 'preview']),
    src: (state, { id }) => state.getIn([
      'attachment', id, 'src', 'local',
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

export { ConnectedAttachment as default };
