import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';

import DropdownMenuContainer from 'mastodon/containers/dropdown_menu_container';

import CommonLink from 'glitch/components/common/link';

const messages = defineMessages({
  block:
    { id: 'account.block', defaultMessage: 'Block @{name}' },
  blockDomain:
    { id: 'account.block_domain', defaultMessage: 'Hide everything from {domain}' },
  edit_profile:
    { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  follow:
    { id: 'account.follow', defaultMessage: 'Follow' },
  followers:
    { id: 'account.followers', defaultMessage: 'Followers' },
  follows:
    { id: 'account.follows', defaultMessage: 'Follows' },
  media:
    { id: 'account.media', defaultMessage: 'Media' },
  mention:
    { id: 'account.mention', defaultMessage: 'Mention @{name}' },
  mute:
    { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  posts:
    { id: 'account.posts', defaultMessage: 'Posts' },
  report:
    { id: 'account.report', defaultMessage: 'Report @{name}' },
  share:
    { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  unblock:
    { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unblockDomain:
    { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
  unfollow:
    { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  unmute:
    { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
});

export default class ProfileActionBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    className: PropTypes.string,
    handler: PropTypes.object.isRequired,
    history: PropTypes.object,
    me: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleFollow = () => {
    { account, handler } = this.props;
    handler.follow(account);
  }
  handleBlock = () => {
    { account, handler } = this.props;
    handler.block(account);
  }
  handleMention = () => {
    { account, handler, history } = this.props;
    if (history) handler.mention(account, history);
  }
  handleReport = () => {
    { account, handler } = this.props;
    handler.report(account);
  }
  handleMute = () => {
    { account, handler } = this.props;
    handler.mute(account);
  }
  handleBlockDomain = () => {
    { account, handler } = this.props;
    const domain = account.get('acct').split('@')[1];
    if (!domain) return;
    handler.blockDomain(domain, account.get('id'));
  }
  handleShare = () => {
    { account } = this.props;
    navigator.share({ url: account.get('url') });
  }

  render () {
    const {
      handleBlock,
      handleBlockDomain,
      handleFollow,
      handleMention,
      handleMute,
      handleReport,
      handleShare,
    } = this;
    const {
      account,
      className,
      handler,
      history,
      me,
      intl,
    } = this.props;

    const computedClass = classNames('glitch', 'glitch__profile__action-bar', className);

    //  This gets the domain of the user. It will be undefined for
    //  local users, since their accts do not include their instance.
    const domain = account.get('acct').split('@')[1];

    let menu = [];

    menu.push({
      text: intl.formatMessage(messages.mention, {
        name: account.get('username')
      }),
      action: handleMention
    });
    if ('share' in navigator) menu.push({
      text: intl.formatMessage(messages.share, {
        name: account.get('username')
      }),
      action: handleShare
    });
    menu.push(null);
    menu.push({
      text: intl.formatMessage(messages.media),
      to: `/accounts/${account.get('id')}/media`
    });
    menu.push(null);

    if (account.get('id') === me) menu.push({
      text: intl.formatMessage(messages.edit_profile),
      href: '/settings/profile'
    });
    else {
      menu.push({
        text: intl.formatMessage(
          account.getIn(['relationship', 'muting']) ? messages.unmute : messages.mute,
          { name: account.get('username') }
        ),
        action: handleMute
      });
      menu.push({
        text: intl.formatMessage(
          account.getIn(['relationship', 'blocking']) ? messages.unblock : messages.block,
          { name: account.get('username') }
        ),
        action: handleBlock
      });
      menu.push({
        text: intl.formatMessage(messages.report, {
          name: account.get('username')
        }),
        action: handleReport
      });
    }

    if (domain) {
      menu.push(null);
      menu.push({
        text: intl.formatMessage(
          account.getIn(['relationship', 'domain_blocking']) ? messages.unblockDomain : messages.blockDomain,
          { domain }
        ),
        action: handleBlockDomain
      });
    }

    return (
      <div className={computedClass}>
        <div className='action-bar\button'>
          <DropdownMenuContainer items={menu} icon='bars' size={24} direction='right' />
        </div>
        <CommonLink
          className='action-bar\link'
          destination={`/accounts/${account.get('id')}`}
          history={history}
        >
          <FormattedMessage {...messages.posts} />
          {' '}
          <b><FormattedNumber value={account.get('statuses_count')} /></b>
        </CommonLink>
        <CommonLink
          className='action-bar\link'
          destination={`/accounts/${account.get('id')}/following`}
          history={history}
        >
          <FormattedMessage {...messages.follows} />
          {' '}
          <b><FormattedNumber value={account.get('following_count')} /></b>
        </CommonLink>
        <CommonLink
          className='action-bar\link'
          destination={`/accounts/${account.get('id')}/followers`}
          history={history}
        >
          <FormattedMessage {...messages.followers} />
          {' '}
          <b><FormattedNumber value={account.get('followers_count')} /></b>
        </CommonLink>
      </div>
    );
  }

}
