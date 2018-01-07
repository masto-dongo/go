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

//  Component imports.
import {
  CommonIcon,
  ConnectedReference,
} from 'flavours/go/components';

//  Lib imports.
import { POST_TYPE } from 'flavours/go/lib/tootledge';

//  Stylesheet imports.
import './style.scss';

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
  const {
    icon,
    message,
  } = function () {
    switch (true) {
    case (type & POST_TYPE.REBLOG) === POST_TYPE.REBLOG:
      return {
        icon: 'retweet',
        message: (
          <ℳ
            name='reblogMessage'
            values={{ comrade: (
              <ConnectedReference
                mention={comrade}
                showAt
              />
            ) }}
          />
        ),
      };
    case (type & POST_TYPE.FAVOURITE) === POST_TYPE.FAVOURITE:
      return {
        icon: 'star',
        message: (
          <ℳ
            name='favouriteMessage'
            values={{ comrade: (
              <ConnectedReference
                mention={comrade}
                showAt
              />
            ) }}
          />
        ),
      };
    case (type & POST_TYPE.MENTION) === POST_TYPE.MENTION:
      return {
        icon: 'reply',
        message: (
          <ℳ
            name='mentionMessage'
            values={{ comrade: (
              <ConnectedReference
                mention={comrade}
                showAt
              />
            ) }}
          />
        ),
      };
    case (type & POST_TYPE.REBLOGGED) === POST_TYPE.REBLOGGED:
      return {
        icon: 'retweet',
        message: (
          <ℳ
            name='rebloggedMessage'
            values={{ comrade: (
              <ConnectedReference
                mention={comrade}
                showAt
              />
            ) }}
          />
        ),
      };
    case (type & POST_TYPE.REPLY) === POST_TYPE.REPLY:
      return {
        icon: 'reply-all',
        message: (
          <ℳ
            name='replyMessage'
            values={{ comrade: (
              <ConnectedReference
                mention={comrade}
                showAt
              />
            ) }}
          />
        ),
      };
    default:
      return {};
    }
  }();

  //  Rendering.
  return message ? (
    <aside className={computedClass}>
      <CommonIcon icon={icon} />
      {' '}
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
