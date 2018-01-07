//  <ConnectedMediaVideo>
//  =====================
//
//  A lot of the complexity here is just making sure that the video
//  loaded properly.  Why do we do that here but not for GIFVs?? I
//  don't know lol I'm just copying upstream with this one.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import {
  CommonButton,
  CommonIconButton,
} from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedMediaVideo extends React.PureComponent {

  //  Constructor
  constructor (props) {
    super(props);
    const { autoplay } = this.props;

    //  State.
    this.state = {
      hasAudio: true,
      muted: true,
      previewVisible: !!autoplay,
      videoError: false,
    };

    //  Variables.
    this.node = null;

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
  }


  //  Basic video controls.
  handleMute () {
    this.setState({ muted: !this.state.muted });
  }
  handlePlayPause () {
    const { node } = this;
    if (!node) {
      return;
    }
    if (node.paused) {
      node.play();
    } else {
      node.pause();
    }
  }

  //  When clicking we either open (de-preview) the video or we
  //  expand it, depending. Note that when we de-preview the video will
  //  also begin playing due to its `autoplay` attribute.
  handleClick () {
    const { node } = this;
    const { onClick } = this.props;
    const { previewVisible } = this.state;
    if (previewVisible) {
      this.setState({ previewVisible: false });
    } else {
      node.pause();
      onClick(node.currentTime);
    }
  }

  //  Loading and errors. We have to do some hacks in order to check if
  //  the video has audio imo. There's probably a better way to do this
  //  but that's how upstream has it.
  handleLoadedData () {
    const { node } = this;
    if (('WebkitAppearance' in document.documentElement.style && node.audioTracks.length === 0) || node.mozHasAudio === false) {
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
    const { componentDidUpdate } = this;
    componentDidUpdate();
  }
  componentDidUpdate () {
    const {
      handleLoadedData,
      handleVideoError,
      node,
    } = this;
    if (!node) {
      return;
    }
    node.addEventListener('loadeddata', handleLoadedData);
    node.addEventListener('error', handleVideoError);
  }

  //  On unmounting, we remove the listeners from the video element.
  componentWillUnmount () {
    const {
      handleLoadedData,
      handleVideoError,
      node,
    } = this;
    if (!node) {
      return;
    }
    node.removeEventListener('loadeddata', handleLoadedData);
    node.removeEventListener('error', handleVideoError);
  }

  //  Getting a reference to our video.
  handleRef (node) {
    this.node = node;
  }

  //  Rendering.
  render () {
    const {
      handleClick,
      handleMute,
      handlePlayPause,
      handleRef,
      node,
    } = this;
    const {
      autoplay,
      className,
      description,
      href,
      previewSrc,
      src,
      ℳ,
    } = this.props;
    const {
      hasAudio,
      muted,
      previewVisible,
      videoError,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--MEDIA--VIDEO', className);
    const paused = node ? node.paused : true;

    //  This gets our content: either a preview image, an error
    //  message, or the video.
    const content = function () {
      switch (true) {
      case previewVisible:
        return (
          <img
            alt={description}
            src={previewSrc}
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
            poster={previewSrc}
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
      <div className={computedClass}>
        <CommonButton
          href={href || src}
          key='box'
          onClick={handleClick}
          title={previewVisible ? ℳ.videoOpen : ℳ.videoExpand}
        >{content}</CommonButton>
        {!previewVisible ? (
          <CommonIconButton
            active={!paused}
            className='play_pause'
            icon={paused ? 'play' : 'pause'}
            key='play'
            onClick={handlePlayPause}
            title={ℳ.videoPlay}
          />
        ) : null}
        {!previewVisible && hasAudio ? (
          <CommonIconButton
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

//  Props.
ConnectedMediaVideo.propTypes = {
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  description: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  previewSrc: ImmutablePropTypes.map,
  src: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
};
