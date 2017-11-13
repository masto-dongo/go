//  <CommonImage>
//  =============

//  This is a simple component for rendering images, especially those
//  which might have animated forms.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CommonImage extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = { hovering: false };

    //  Function binding.
    const { handleMouse } = Object.getPrototypeOf(this);
    this.handleMouseEnter = handleMouse.bind(this, true);
    this.handleMouseLeave = handleMouse.bind(this, false);
  }

  //  Starts or stops animation on hover. We don't do this if we're
  //  `autoplay`ing to prevent needless re-renders.
  handleMouse (state) {
    const {
      animatedSrc,
      autoplay,
    } = this.props;
    if (autoplay || !animatedSrc) {
      return;
    }
    this.setState({ hovering: state });
  }

  //  Rendering.
  render () {
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    const {
      animatedSrc,
      autoplay,
      className,
      description,
      staticSrc,
      title,
      ...rest
    } = this.props;
    const { hovering } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--IMAGE', className);

    //  If we don't have any image sources, we fallback to just the
    //  description text.
    if (!staticSrc && !animatedSrc) {
      return (
        <span
          className={computedClass}
          title={title || description}
          {...rest}
        >{description}</span>
      );
    }

    //  Otherwise, we render the appropriate image.
    return (
      <img
        alt={description}
        className={computedClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        src={autoplay || hovering ? animatedSrc || staticSrc : staticSrc}
        title={title || description}
        {...rest}
      />
    );
  }

}

//  Props.
CommonImage.propTypes = {
  animatedSrc: PropTypes.string,  //  The animated image source, if one exists
  autoplay: PropTypes.bool,  //  Whether to autoplay the image, if animated
  className: PropTypes.string,
  description: PropTypes.string,  //  Image alt-text
  staticSrc: PropTypes.string,  //  The static image source.
  title: PropTypes.string,  //  A title/label for the image, if different from its `description`
};
