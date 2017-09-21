//  <CommonAvatar>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/common/avatar

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default class CommonAvatar extends ImmutablePureComponent {

  //  Props and state.
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    animate: PropTypes.bool,
    circular: PropTypes.bool,
    className: PropTypes.string,
    comrade: ImmutablePropTypes.map,
  }
  state = {
    hovering: false,
  }

  //  Starts or stops animation on hover.
  handleMouseEnter = () => {
    if (this.props.animate) return;
    this.setState({ hovering: true });
  }
  handleMouseLeave = () => {
    if (this.props.animate) return;
    this.setState({ hovering: false });
  }

  //  Renders the component.
  render () {
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    const {
      account,
      animate,
      circular,
      className,
      comrade,
      ...others
    } = this.props;
    const { hovering } = this.state;
    const computedClass = classNames('glitch', 'glitch__common__avatar', {
      _circular: circular,
    }, className);

    //  We store the image srcs here for later.
    const acct = account.get('acct');
    const src = account.get('avatar');
    const staticSrc = account.get('avatar_static');
    const comradeAcct = comrade ? comrade.get('acct') : '';
    const comradeSrc = comrade ? comrade.get('avatar') : 'about:blank';
    const comradeStaticSrc = comrade ? comrade.get('avatar_static') : 'about:blank';

    //  Avatars are a straightforward div with image(s) inside.
    return comrade ? (
      <div
        className={computedClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...others}
      >
        <img
          className='avatar\main'
          src={hovering || animate ? src : staticSrc}
          alt={acct}
        />
        <img
          className='avatar\comrade'
          src={hovering || animate ? comradeSrc : comradeStaticSrc}
          alt={comradeAcct}
        />
      </div>
    ) : (
      <div
        className={computedClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...others}
      >
        <img
          className='avatar\solo'
          src={hovering || animate ? src : staticSrc}
          alt={acct}
        />
      </div>
    );
  }

}
