import classNames from 'classnames'
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages } from 'react-intl';

import SettingText from 'mastodon/components/setting_text';
import SettingToggle from 'mastodon/components/setting_toggle';
import createStream from 'mastodon/stream';

import ColumnContainer from 'glitch/components/column/container';
import CommonList from 'glitch/components/common/list';
import CommonScrollable from 'glitch/components/common/scrollable';

const messages = defineMessages({
  account:
    { id: 'column.account', defaultMessage: 'User timeline' },
  accountEmpty:
    { id: 'empty_column.account', defaultMessage: 'This account hasn\'t made any posts yet.' },
  accountWithMedia:
    { id: 'column.account_with_media', defaultMessage: 'User media' },
  accountWithMediaEmpty:
    { id: 'empty_column.account_with_media', defaultMessage: 'This account hasn\'t made any posts with media yet.' },
  advanced:
    {id: 'home.column_settings.advanced', defaultMessage: 'Advanced' },
  alert:
    {id: 'notifications.column_settings.alert', defaultMessage: 'Desktop notifications' },
  basic:
    {id: 'home.column_settings.advanced', defaultMessage: 'Basic' },
  community:
    { id: 'column.community', defaultMessage: 'Local timeline' },
  communityEmpty:
    { id: 'empty_column.community', defaultMessage: 'The local timeline is empty. Write something publicly to get the ball rolling!'},
  favourite:
    { id: 'notifications.column_settings.favourite', defaultMessage: 'Favourites:' },
  favourites:
    { id: 'column.favourites', defaultMessage: 'Favourites' },
  favouritesEmpty:
    { id: 'empty_column.favourites', defaultMessage: 'You haven\'t favourited any posts yet.' },
  filter_regex:
    { id: 'home.column_settings.filter_regex', defaultMessage: 'Filter out by regular expressions' },
  follow:
    { id: 'notifications.column_settings.follow', defaultMessage: 'New followers:' },
  hashtagEmpty:
    { id: 'empty_column.hashtag', defaultMessage: 'There is nothing in this hashtag yet.' },
  home:
    { id: 'column.home', defaultMessage: 'Home' },
  homeEmpty:
    { id: 'empty_column.home', defaultMessage: 'You aren\'t following anyone yet. Visit the public timeline or use search to get started and meet other users.' },
  loadMore:
    { id: 'status.load_more', defaultMessage: 'Load more' },
  mention:
    { id: 'notifications.column_settings.mention', defaultMessage: 'Mentions:' },
  notifications:
    { id: 'column.notifications', defaultMessage: 'Notifications' },
  notificationsEmpty:
    { id: 'empty_column.notifications', defaultMessage: 'You don\'t have any notifications yet. Interact with others to start the conversation.' },
  public:
    { id: 'column.public', defaultMessage: 'Federated timeline' },
  publicEmpty:
    { id: 'empty_column.public', defaultMessage: 'There is nothing here! Write something publicly, or manually follow users from other instances to fill it up.' },
  push:
    { id: 'notifications.column_settings.push', defaultMessage: 'Push notifications' },
  pushDevice:
    { id: 'notifications.column_settings.push_meta', defaultMessage: 'This device' },
  reblog:
    { id: 'notifications.column_settings.reblog', defaultMessage: 'Boosts:' },
  show:
    { id: 'notifications.column_settings.show', defaultMessage: 'Show in column' },
  showReblogs:
    { id: 'home.column_settings.show_reblogs', defaultMessage: 'Show boosts' },
  showReplies:
    { id: 'home.column_settings.show_replies', defaultMessage: 'Show replies' },
  sound:
    { id: 'notifications.column_settings.sound', defaultMessage: 'Play sound' },
  timeline:
    { id: 'column.timeline', defaultMessage: 'Timeline' },
  timelineEmpty:
    { id: 'empty_column.timeline', defaultMessage: 'This timeline doesn\'t have any posts.'},
});

export default class Timeline extends ImmutablePureComponent {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    className: PropTypes.string,
    columnIndex: PropTypes.number.isRequired,
    hasMore: PropTypes.bool,
    hasUnread: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    ids: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    pinned: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map,
    streamId: PropTypes.string,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    type: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  subscription = null;

  subscribe () {
    const { accessToken, streamingAPIBaseURL, type } = this.props;

    const streamId = () => {
      switch (type[0]) {
      case 'community':
        return 'public:local';
      case 'public':
        return 'public';
      case 'hashtag':
        return `hashtag&tag=${type[1]}`;
      }
    }

    if (!streamId) return;

    this.subscription = createStream(streamingAPIBaseURL, accessToken, streamId, {
      connected () {
        handler.connect();
      },
      reconnected () {
        handler.connect();
      },
      disconnected () {
        handler.disconnect();
      },
      received (data) {
        switch(data.event) {
        case 'update':
          handler.update(data.payload);
          break;
        case 'delete':
          handler.delete(data.payload);
          break;
        }
      },
    });
  }

  unsubscribe () {
    if (typeof this.subscription !== 'undefined') {
      this.subscription.close();
      this.subscription = null;
    }
  }

  componentDidMount () {
    const { handler, streamId } = this.props;
    handler.refresh();
    this.subscribe(streamId);
  }

  componentWillReceiveProps (nextProps) {
    const { streamId, timelineId } = this.props;
    if (nextProps.streamId !== streamId || nextProps.timelineId !== timelineId) {

      handler.refresh();
      this.unsubscribe();
      this.subscribe(nextProps.streamId);
    }
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  handleLoadMore () {
    const { handler } = this.props;
    handler.expand();
  }

  render () {
    const {
      accessToken,
      className,
      columnIndex,
      data,
      hasMore,
      hasUnread,
      handler,
      ids,
      intl,
      isLoading,
      pinned,
      settings,
      streamId,
      streamingAPIBaseURL,
      type,
      ...others
    } = this.props;
    const computedClass = classNames('glitch', 'glitch__timeline', className);

    let icon = '';
    let title = intl.formatMessage(messages.timeline);
    let empty = intl.formatMessage(messages.timelineEmpty);
    let toggles = [];

    const conditionalProps = { pinned };

    const showPushSettings = pushSettings.get('browserSupport') && pushSettings.get('isSubscribed');

    const regexSetting = (
      <div
        aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_rx`}
        className='timeline\toggles timeline\regex'
        key='glitch:timeline:regex'
        role='group'
      >
        <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_home`}>
          <FormattedMessage {...messages.advanced} />
        </span>
        <SettingText
          label={intl.formatMessage(messages.filter_regex)}
          onChange={onChange}
          settings={settings}
          settingKey={['regex', 'body']}
        />
      </div>
    );
    const homeSettings = (
      <div
        aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_home`}
        className='timeline\toggles timeline\hometoggles'
        key='glitch:timeline:hometoggles'
        role='group'
      >
        <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_home`}>
          <FormattedMessage {...messages.basic} />
        </span>
        <SettingToggle
          label={<FormattedMessage {...messages.showReblogs} />}
          onChange={onChange}
          settingKey={['shows', 'reblog']}
          settings={settings}
        />
        <SettingToggle
          label={<FormattedMessage {...messages.showReplies} />}
          onChange={onChange}
          settingKey={['shows', 'reply']}
          settings={settings}
        />
      </div>
    );
    const notificationsSettings = [
      (
        <div
          aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_follow`}
          className='timeline\toggles timeline\followtoggles'
          key='glitch:timeline:follow'
          role='group'
        >
          <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_follow`}>
            <FormattedMessage {...messages.follow} />
          </span>
          <SettingToggle
            label={<FormattedMessage {...messages.alert} />}
            onChange={onChange}
            settingKey={['alerts', 'follow']}
            settings={settings}
          />
          {showPushSettings ? (
            <SettingToggle
              label={<FormattedMessage {...messages.push} />}
              meta={<FormattedMessage {...messages.pushDevice} />}
              onChange={onChange}
              settingKey={['alerts', 'follow']}
              settings={settings}
            />
          ) : null}
          <SettingToggle
            label={<FormattedMessage {...messages.show} />}
            onChange={onChange}
            settingKey={['shows', 'follow']}
            settings={settings}
          />
          <SettingToggle
            label={<FormattedMessage {...messages.sound} />}
            onChange={onChange}
            settingKey={['sounds', 'follow']}
            settings={settings}
          />
        </div>
      ), (
        <div
          aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_fav`}
          className='timeline\toggles timeline\favouritetoggles'
          key='glitch:timeline:favourite'
          role='group'
        >
          <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_fav`}>
            <FormattedMessage {...messages.favourite} />
          </span>
          <SettingToggle
            label={<FormattedMessage {...messages.alert} />}
            onChange={onChange}
            settingKey={['alerts', 'favourite']}
            settings={settings}
          />
          {showPushSettings ? (
            <SettingToggle
              label={<FormattedMessage {...messages.push} />}
              meta={<FormattedMessage {...messages.pushDevice} />}
              onChange={onChange}
              settingKey={['alerts', 'favourite']}
              settings={settings}
            />
          ) : null}
          <SettingToggle
            label={<FormattedMessage {...messages.show} />}
            onChange={onChange}
            settingKey={['shows', 'favourite']}
            settings={settings}
          />
          <SettingToggle
            label={<FormattedMessage {...messages.sound} />}
            onChange={onChange}
            settingKey={['sounds', 'favourite']}
            settings={settings}
          />
        </div>
      ), (
        <div
          aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_mentn`}
          className='timeline\toggles timeline\mentiontoggles'
          key='glitch:timeline:mention'
          role='group'
        >
          <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_mentn`}>
            <FormattedMessage {...messages.mention} />
          </span>
          <SettingToggle
            label={<FormattedMessage {...messages.alert} />}
            onChange={onChange}
            settingKey={['alerts', 'mention']}
            settings={settings}
          />
          {showPushSettings ? (
            <SettingToggle
              label={<FormattedMessage {...messages.push} />}
              meta={<FormattedMessage {...messages.pushDevice} />}
              onChange={onChange}
              settingKey={['alerts', 'mention']}
              settings={settings}
            />
          ) : null}
          <SettingToggle
            label={<FormattedMessage {...messages.show} />}
            onChange={onChange}
            settingKey={['shows', 'mention']}
            settings={settings}
          />
          <SettingToggle
            label={<FormattedMessage {...messages.sound} />}
            onChange={onChange}
            settingKey={['sounds', 'mention']}
            settings={settings}
          />
        </div>
      ), (
        <div
          aria-labelledby={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_reblg`}
          className='timeline\toggles timeline\reblogtoggles'
          key='glitch:timeline:reblog'
          role='group'
        >
          <span id={`glitch:col${+columnIndex || '?'}:${type.join('_')}:s_reblg`}>
            <FormattedMessage {...messages.reblog} />
          </span>
          <SettingToggle
            label={<FormattedMessage {...messages.alert} />}
            onChange={onChange}
            settingKey={['alerts', 'reblog']}
            settings={settings}
          />
          {showPushSettings ? (
            <SettingToggle
              label={<FormattedMessage {...messages.push} />}
              meta={<FormattedMessage {...messages.pushDevice} />}
              onChange={onChange}
              settingKey={['alerts', 'reblog']}
              settings={settings}
            />
          ) : null}
          <SettingToggle
            label={<FormattedMessage {...messages.show} />}
            onChange={onChange}
            settingKey={['shows', 'reblog']}
            settings={settings}
          />
          <SettingToggle
            label={<FormattedMessage {...messages.sound} />}
            onChange={onChange}
            settingKey={['sounds', 'reblog']}
            settings={settings}
          />
        </div>
      )
    ];

    switch (type[0]) {
    case 'account':
      if (type[2] === 'media') {
        icon = 'file-image-o'
        title = intl.formatMessage(messages.accountWithMedia);
        empty = intl.formatMessage(messages.accountWithMediaEmpty);
      } else {
        icon = 'address-card'
        title = intl.formatMessage(messages.account);
        empty = intl.formatMessage(messages.accountEmpty);
      }
      delete conditionalProps.pinned;
      break;
    case 'community':
      icon = 'user-circle'
      title = intl.formatMessage(messages.community);
      empty = intl.formatMessage(messages.communityEmpty);
      toggles.push(regexSetting);
      break;
    case 'favourites':
      icon = 'star'
      title = intl.formatMessage(messages.favourites);
      empty = intl.formatMessage(messages.favouritesEmpty);
      break;
    case 'hashtag':
      icon = 'hashtag'
      title = type[1];
      empty = intl.formatMessage(messages.hashtagEmpty);
      toggles.push(regexSetting);
      break;
    case 'home':
      icon = 'home'
      title = intl.formatMessage(messages.home);
      empty = intl.formatMessage(messages.homeEmpty);
      toggles.push(homeSettings);
      toggles.push(regexSetting);
      break;
    case 'notifications':
      icon = 'bell'
      title = intl.formatMessage(messages.notifications);
      empty = intl.formatMessage(messages.notificationsEmpty);
      toggles.concat(notificationsSettings);
      break;
    case 'public':
      icon = 'globe'
      title = intl.formatMessage(messages.public);
      empty = intl.formatMessage(messages.publicEmpty);
      toggles.push(regexSetting);
      break;
    }

    return (
      <ColumnContainer
        className={computedClass}
        icon={icon}
        index={columnIndex}
        title={title}
        toggles={toggles}
        {...conditionalProps}
        {...others}
      >
        <TimelinePrepend
          className='timeline\prepend'
          type={type}
        />
        {isLoading || ids.size > 0 ? (
          <CommonList
            className='timeline\list'
            ids={ids}
          />
        ) : (
          <TimelineEmptyMessage className='timeline\empty'>
            {empty}
          </TimelineEmptyMessage>
        )}
        <CommonButton
          className='timeline\loadmore'
          disabled={isLoading || ids.size > 0 && hasMore}
          onClick={handleLoadMore}
          showTitle
          title={intl.formatMessage(messages.loadMore)}
        />
      </ColumnContainer>
    );
  }

}
