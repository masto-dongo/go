/*********************************************************************\
|                                                                     |
|   <AttachmentVideo>                                                 |
|   =================                                                 |
|                                                                     |
|   A lot of the complexity here is just making sure that the video   |
|   loaded properly.  Why do we do that here but not for GIFVs??  I   |
|   don't know lol I'm just copying upstream with this one.           |
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

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedAttachmentVideo extends React.PureComponent {

  constructor (props) {
    super(props);

    //  State.
    this.state = {
      hasAudio: true,
      muted: true,
      previewVisible: !!this.props.autoplay,
      videoError: false,
    };

    //  Function binding.
    const {
      handleClick,
      handleLoadedData,
      handleMute,
      handlePlayPause,
      handleRef,
      handleVideoError,
    } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
    this.handleLoadedData = handleLoadedData.bind(this);
    this.handleMute = handleMute.bind(this);
    this.handlePlayPause = handlePlayPause.bind(this);
    this.handleRef = handleRef.bind(this);
    this.handleVideoError = handleVideoError.bind(this);

    //  Variables.
    this.video = null;
  }


  //  Basic video controls.
  handleMute () {
    this.setState({ muted: !this.state.muted });
  }
  handlePlayPause () {
    const { video } = this;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  //  When clicking we either open (de-preview) the video or we
  //  expand it, depending. Note that when we de-preview the video will
  //  also begin playing due to its `autoplay` attribute.
  handleClick () {
    const { setState, video } = this;
    const { onClick } = this.props;
    const { previewVisible } = this.state;
    if (previewVisible) setState({ previewVisible: false });
    else {
      video.pause();
      onClick(video.currentTime);
    }
  }

  //  Loading and errors. We have to do some hacks in order to check if
  //  the video has audio imo. There's probably a better way to do this
  //  but that's how upstream has it.
  handleLoadedData () {
    const { video } = this;
    if (('WebkitAppearance' in document.documentElement.style && video.audioTracks.length === 0) || video.mozHasAudio === false) {
      this.setState({ hasAudio: false });
    }
  }
  handleVideoError () {
    this.setState({ videoError: true });
  }

  //  On mounting or update, we ensure our video has the needed event
  //  listeners. We can't necessarily do this right away because there
  //  might be a preview up.
  componentDidMount () {
    this.componentDidUpdate();
  }
  componentDidUpdate () {
    const { handleLoadedData, handleVideoError, video } = this;
    if (!video) return;
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleVideoError);
  }

  //  On unmounting, we remove the listeners from the video element.
  componentWillUnmount () {
    const { handleLoadedData, handleVideoError, video } = this;
    if (!video) return;
    video.removeEventListener('loadeddata', handleLoadedData);
    video.removeEventListener('error', handleVideoError);
  }

  //  Getting a reference to our video.
  handleRef (node) {
    this.video = node;
  }

  //  Rendering.
  render () {
    const {
      handleClick,
      handleMute,
      handlePlayPause,
      handleRef,
      video: { paused },
    } = this;
    const {
      autoplay,
      className,
      description,
      href,
      preview,
      src,
      ℳ,
      ...rest
    } = this.props;
    const {
      hasAudio,
      muted,
      previewVisible,
      videoError,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--ATTACHMENT--VIDEO', className);

    //  This gets our content: either a preview image, an error
    //  message, or the video.
    const content = function () {
      switch (true) {
      case previewVisible:
        return (
          <img
            alt={description}
            src={preview.get('src')}
            title={description}
          />
        );
      case videoError:
        return ℳ.videoError;  //  Just a string, no need for React here
      default:
        return (
          <video
            autoPlay={autoplay}
            loop
            muted={muted}
            poster={preview.get('src')}
            ref={handleRef}
            src={src}
            title={description}
          />
        );
      }
    }();

    //  Everything goes inside of a button because everything is a
    //  button. This is okay wrt the video element because it doesn't
    //  have controls.
    return (
      <div
        className={computedClass}
        {...rest}
      >
        <CommonButton
          href={href || src}
          key='box'
          onClick={handleClick}
          title={previewVisible ? ℳ.videoOpen : ℳ.videoExpand}
        >{content}</CommonButton>
        {!previewVisible ? (
          <CommonButton
            active={!paused}
            className='play_pause'
            icon={paused ? 'play' : 'pause'}
            key='play'
            onClick={handlePlayPause}
            title={ℳ.videoPlay}
          />
        ) : null}
        {!previewVisible && hasAudio ? (
          <CommonButton
            active={!muted}
            className='mute'
            icon={muted ? 'volume-off' : 'volume-up'}
            key='mute'
            onClick={handleMute}
            title={ℳ.videoMute}
          />
        ) : null}
      </div>
    );
  }

}

ConnectedAttachmentVideo.propTypes = {
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  description: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  preview: ImmutablePropTypes.map,
  src: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
};
