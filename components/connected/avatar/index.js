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
import { createStructuredSelector } from 'reselect';

//  Component imports.
import { CommonImage } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import moduleOnReady from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
function Avatar ({
  account,
  className,
  circular,
  comrade,
  ℳ,
  '🏪': {
    autoplay,
    accountAt,
    accountSrc,
    comradeAt,
    comradeSrc,
  },
  '💪': handler,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--AVATAR', {
    circular: circular,
  }, className);

  //  Avatars are a straightforward div with image(s) inside.
  return comrade ? (
    <div
      className={computedClass}
      {...rest}
    >
      <CommonImage
        autoplay={autoplay}
        animatedSrc={accountSrc.get('original')}
        className='main'
        description={accountAt}
        staticSrc={accountSrc.get('static')}
      />
      <CommonImage
        autoplay={autoplay}
        animatedSrc={comradeSrc.get('original')}
        className='comrade'
        description={comradeAt}
        staticSrc={comradeSrc.get('static')}
      />
    </div>
  ) : (
    <div
      className={computedClass}
      {...rest}
    >
      <CommonImage
        autoplay={autoplay}
        animatedSrc={accountSrc.get('original')}
        className='solo'
        description={accountAt}
        staticSrc={accountSrc.get('static')}
      />
    </div>
  );
}

//  Props.
Avatar.propTypes = {
  account: PropTypes.string.isRequired,
  circular: PropTypes.bool,
  className: PropTypes.string,
  comrade: PropTypes.string,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    autoplay: PropTypes.bool,
    accountAt: PropTypes.string.isRequired,
    accountSrc: ImmutablePropTypes.map.isRequired,
    comradeAt: PropTypes.string,
    comradeSrc: ImmutablePropTypes.map,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedAvatar;

//  Building our store.
moduleOnReady(function () {
  ConnectedAvatar = connect(

    //  Component.
    Avatar,

    //  Store.
    createStructuredSelector({
      accountAt: (state, { account }) => state.getIn(['account', account, 'at']),
      accountSrc: (state, { account }) => state.getIn(['account', account, 'avatar']),
      autoplay: state => state.getIn(['meta', 'autoplay']),
      comradeAt: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'at']) : null,
      comradeSrc: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'avatar']) : null,
    })
  );
});

export { ConnectedAvatar as default };
