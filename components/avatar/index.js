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

//  Common imports.
import { CommonImage } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function Avatar ({
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
}) {
  const computedClass = classNames('MASTODON_GO--AVATAR', {
    circular: circular,
  }, className);

  //  Avatars are a straightforward div with image(s) inside.
  return comrade ? (
    <div
      className={computedClass}
      {...rest}
    >
      <CommonImage
        animatedSrc={accountSrc.get('original')}
        className='main'
        description={accountAt}
        staticSrc={accountSrc.get('static')}
      />
      <CommonImage
        animatedSrc={accountSrc.get('original')}
        className='comrade'
        description={comradeAt}
        staticSrc={accountSrc.get('static')}
      />
    </div>
  ) : (
    <div
      className={computedClass}
      {...rest}
    >
      <CommonImage
        animatedSrc={accountSrc.get('original')}
        className='solo'
        description={accountAt}
        staticSrc={accountSrc.get('static')}
      />
    </div>
  );
}

Avatar.propTypes = {
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
