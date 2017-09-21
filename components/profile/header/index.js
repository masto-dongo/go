//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';

import CommonAvatar from 'glitch/components/common/avatar';
import CommonButton from 'glitch/components/common/button';
import CommonLink from 'glitch/components/common/link';

const messages = defineMessages({
  blocked:
    { id: 'account.blocked', defaultMessage: 'You have blocked this account' },
  follow:
    { id: 'account.follow', defaultMessage: 'Follow' },
  follows:
    { id: 'account.follows_you', defaultMessage: 'Follows you' },
  requested:
    { id: 'account.requested', defaultMessage: 'Awaiting approval' },
});

export default class ProfileHeader extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    className: PropTypes.string,
    history: PropTypes.object,
    me: PropTypes.number.isRequired,
    onFollow: PropTypes.func.isRequired,
  }

  render () {
    const computedClass = classNames('glitch', 'glitch__profile__header', className);

    const button = (() => {
      switch (true) {
      case me === account.get('id'):
        return null;
      case !!account.getIn(['relationship', 'requested']):
        return (
          <CommonButton
            active
            disabled
            icon='hourglass'
            title={intl.formatMessage(messages.requested)}
          />
        );
      case !!account.getIn(['relationship', 'blocking']):
        return (
          <CommonButton
            disabled
            icon='ban'
            title={intl.formatMessage(messages.blocked)}
          />
        );
      case !!account.getIn(['relationship', 'following']):
        return (
          <CommonButton
            active
            icon='user-times'
            title={intl.formatMessage(messages.follow)}
          />
        );
      default:
        return (
          <CommonButton
            icon='user-plus'
            title={intl.formatMessage(messages.follow)}
          />
        );
      }
    })()
    const followedBy = !!account.getIn(['relationship', 'followed_by']);

    return (
      <header className='glitch glitch__profile__header'>
        <CommonLink
          className='header\link'
          destination={`/accounts/${account.get('id')}`}
          history={history}
          href={account.get('url')}
        >
          <CommonAvatar account={account} className='header\avatar' />
        </CommonLink>
        <b
          className='header\display-name'
          dangerouslySetInnerHTML={{
            __html: account.get('display_name_html'),
          }}
        />
        {' '}
        <code className='header\account'>
          @{account.get('acct')} {account.get('locked') ? <i className='fa fa-lock' /> : null}
        </code>
        {followedBy ? (
          <span className='header\follows'>
            <FormattedMessage {...messages.follows} />
          </span>
        ) : null}
        {button}
      </header>
    );
  }

}
