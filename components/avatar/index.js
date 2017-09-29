//  <Avatar>
//  ========

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

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default class Avatar extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    animate: PropTypes.bool,
    account: PropTypes.string.isRequired,
    accountAt: PropTypes.string.isRequired,
    accountSrc: ImmutablePropTypes.map.isRequired,
    circular: PropTypes.bool,
    comrade: PropTypes.string.isRequired,
    comradeAt: PropTypes.string.isRequired,
    comradeSrc: ImmutablePropTypes.map.isRequired,
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
      accountAt,
      accountSrc,
      circular,
      comrade,
      comradeAt,
      comradeSrc,
      ...rest
    } = this.props;
    const { hovering } = this.state;
    const computedClass = classNames('MASTODON_GO--AVATAR', {
      circular: circular,
    }, className);

    //  Avatars are a straightforward div with image(s) inside.
    return comrade ? (
      <div
        className={computedClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <img
          className='main'
          src={animate || hovering && animate !== false ? accountSrc.get('original') : accountSrc.get('static')}
          alt={accountAt}
        />
        <img
          className='comrade'
          src={animate || hovering && animate !== false ? comradeSrc.get('original') : comradeSrc.get('static')}
          alt={comradeAt}
        />
      </div>
    ) : (
      <div
        className={computedClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <img
          className='solo'
          src={animate || hovering && animate !== false ? accountSrc.get('original') : accountSrc.get('static')}
          alt={accountAt}
        />
      </div>
    );
  }

}
