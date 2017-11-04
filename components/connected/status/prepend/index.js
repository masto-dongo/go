//  <ConnectedStatusPrepend>
//  ========================

//  This component creates the "X boosted your status" prepend and
//  similar.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';

//  Component imports.
import {
  CommonIcon,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { POST_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------
export default function ConnectedStatusPrepend ({
  className,
  comrade,
  type,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--PREPEND', className);

  //  Creates our message.
  const message = function () {
    switch (true) {
    case type & POST_TYPE.REBLOG === POST_TYPE.REBLOG:
      return (
        <ℳ
          name='reblogMessage'
          values={{ comrade: <ConnectedReference mention={comrade} /> }}
        />
      );
    case type & POST_TYPE.FAVOURITE === POST_TYPE.FAVOURITE:
      return (
        <ℳ
          name='favouriteMessage'
          values={{ comrade: <ConnectedReference mention={comrade} /> }}
        />
      );
    case type & POST_TYPE.MENTION === POST_TYPE.MENTION:
      return (
        <ℳ
          name='mentionMessage'
          values={{ comrade: <ConnectedReference mention={comrade} /> }}
        />
      );
    case type & POST_TYPE.REBLOGGED === POST_TYPE.REBLOGGED:
      return (
        <ℳ
          name='rebloggedMessage'
          values={{ comrade: <ConnectedReference mention={comrade} /> }}
        />
      );
    case type & POST_TYPE.REPLY === POST_TYPE.REPLY:
      return (
        <ℳ
          name='replyMessage'
          values={{ comrade: <ConnectedReference mention={comrade} /> }}
        />
      );
    default:
      return null;
    }
  }();

  //  Rendering.
  return message ? (
    <aside className={computedClass}>
      <CommonIcon icon={type & POST_TYPE.IS_FAVOURITE ? 'star' : 'retweet'} />
      {message}
    </aside>
  ) : null;
}

//  Props.
ConnectedStatusPrepend.propTypes = {
  className: PropTypes.string,
  comrade: PropTypes.string,
  type: PropTypes.number.isRequired,
  ℳ: PropTypes.func.isRequired,
};
