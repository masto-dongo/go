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

  //  Props and state.
  static propTypes = {
    animatedSrc: PropTypes.string,
    autoplay: PropTypes.bool,
    className: PropTypes.string,
    description: PropTypes.string,
    staticSrc: PropTypes.string,
    title: PropTypes.string,
  }
  state = {
    hovering: false,
  }

  //  Starts or stops animation on hover. We don't do this if we're
  //  `autoplay`ing to prevent needless re-renders.
  handleMouseEnter = () => {
    const {
      animatedSrc,
      autoplay,
    } = this.props;
    if (autoplay || !animatedSrc) return;
    this.setState({ hovering: true });
  }
  handleMouseLeave = () => {
    const {
      animatedSrc,
      autoplay,
    } = this.props;
    if (autoplay || !animatedSrc) return;
    this.setState({ hovering: false });
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
    if (!staticSrc && !animatedSrc) {
      return (
        <span
          className={computedClass}
          title={title || description}
          {...rest}
        >{description}</span>
      );
    }
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
