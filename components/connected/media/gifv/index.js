//  <ConnectedMediaGifv>
//  ====================

//  GIFVs are just videos which look like images.  If `autoplay` is set
//  to `false`, you have to hover your mouse over them in order to get
//  them to play.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedMediaGifv extends React.PureComponent {

  //  Constructor
  constructor (props) {
    super(props);

    //  Function binding.
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = Object.getPrototypeOf(this);
    this.handleMouseEnter = handleMouseEnter.bind(this);
    this.handleMouseLeave = handleMouseLeave.bind(this);
  }

  //  This starts playing the GIFV on hover.
  handleMouseEnter ({ target }) {
    const { autoplay } = this.props;
    if (!autoplay) target.play();
  }

  //  When we stop playing, we also reset the time to the beginning.
  handleMouseLeave ({ target }) {
    const { autoplay } = this.props;
    if (!autoplay) {
      target.pause();
      target.currentTime = 0;
    }
  }

  //  Rendering.
  render () {
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    const {
      autoplay,
      className,
      description,
      href,
      onClick,
      previewSrc,
      src,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--MEDIA--GIFV', className);

    //  We render the gifv inside of a linky button, which provides
    //  provides the original. (We can only do this with a video
    //  because we don't show the controls.)
    return (
      <CommonButton
        className={computedClass}
        href={href || src}
        onClick={onClick}
        title={ℳ.expand}
      >
        <video
          autoPlay={autoplay}
          loop
          muted
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          poster={previewSrc}
          src={src}
          title={description}
        />
      </CommonButton>
    );
  }

}

//  Props.
ConnectedAttachmentGifv.propTypes = {
  autoplay: PropTypes.bool,  //  Whether to autoplay the GIFV
  className: PropTypes.string,
  description: PropTypes.string,  //  The label for the GIFV
  href: PropTypes.string,  //  The original GIFV file
  onClick: PropTypes.func,  //  A function to call when clicking the GIFV
  previewSrc: PropTypes.string,  //  The source of the (static) GIFV preview
  src: PropTypes.string,  //  The source of the GIFV
  ℳ: PropTypes.func,
};
