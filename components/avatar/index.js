/*********************************************************************\
|                                                                     |
|   <Avatar>                                                          |
|   ========                                                          |
|                                                                     |
|   `account` gives our main account, while `comrade` gives another   |
|   (eg, the account of a reblogger) which is displayed overlaid on   |
|   the main one.  Avatars are squares by default; `circular` gives   |
|   a circular one if your sensibilities roll that direction.         |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

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

//  Component definition.
export default class Avatar extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    account: PropTypes.string.isRequired,
    circular: PropTypes.bool,
    comrade: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({}),
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      autoplay: PropTypes.bool,
      accountAt: PropTypes.string.isRequired,
      accountSrc: ImmutablePropTypes.map.isRequired,
      comradeAt: PropTypes.string.isRequired,
      comradeSrc: ImmutablePropTypes.map.isRequired,
    }).isRequired,
  }
  state = {
    hovering: false,
  }

  //  Starts or stops animation on hover. We don't do this if we're
  //  `autoplay`ing to prevent needless re-renders.
  handleMouseEnter = () => {
    const { autoplay } = this.props;
    if (autoplay) return;
    this.setState({ hovering: true });
  }
  handleMouseLeave = () => {
    const { autoplay } = this.props;
    if (autoplay) return;
    this.setState({ hovering: false });
  }

  //  Rendering.
  render () {
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    const {
      account,
      circular,
      comrade,
      '🛄': context,
      '💪': handler,
      '🏪': {
        autoplay,
        accountAt,
        accountSrc,
        comradeAt,
        comradeSrc,
      },
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
          src={autoplay || hovering ? accountSrc.get('original') : accountSrc.get('static')}
          alt={accountAt}
        />
        <img
          className='comrade'
          src={autoplay || hovering ? comradeSrc.get('original') : comradeSrc.get('static')}
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
          src={autoplay || hovering ? accountSrc.get('original') : accountSrc.get('static')}
          alt={accountAt}
        />
      </div>
    );
  }

}
