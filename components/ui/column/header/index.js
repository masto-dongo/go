//  <ColumnHeader>
//  ==============

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/column/header

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Our imports.
import CommonIcon from 'glitch/components/common/icon';

//  Stylesheet imports.
import './style';


const messages = defineMessages({
  account:
    { id: 'column.account', defaultMessage: 'User' },
  blocks:
    { id: 'column.blocks', defaultMessage: 'Blocked users' },
  community:
    { id: 'column.community', defaultMessage: 'Local timeline' },
  compose:
    { id: 'column.compose', defaultMessage: 'Compose' },
  conversation:
    { id: 'column.conversation', defaultMessage: 'Conversation' },
  favourites:
    { id: 'column.favourites', defaultMessage: 'Favourites' },
  home:
    { id: 'column.home', defaultMessage: 'Home' },
  notifications:
    { id: 'column.notifications', defaultMessage: 'Notifications' },
  public:
    { id: 'column.public', defaultMessage: 'Federated timeline' },
  statusFavourites:
    { id: 'column.status_favourites', defaultMessage: 'Status favourites' },
  statusReblogs:
    { id: 'column.status_reblogs', defaultMessage: 'Status boosts' },
  timeline:
    { id: 'column.timeline', defaultMessage: 'Timeline' },
  unknown:
    { id: 'column.unknown', defaultMessage: 'Unknown column' },
});

//  * * * * * * *  //

//  The component
//  -------------

const ColumnHeader = ({
    active,
    children,
    meta,
    onClick,
    type,
    ...others
  }) => {
  const computedClass = classNames('glitch', 'glitch__column__header', {
    _active: active,
  });

  let icon;
  let title;

  switch (type) {
  case 'account':
    icon = 'user-circle';
    title = messages.account;
    break;
  case 'blocks':
    icon = 'ban';
    title = messages.blocks;
    break;
  case 'compose':
    icon = 'pencil-square-o';
    title = messages.compose;
    break;
  case 'conversation':
    icon = 'comments-o';
    title = messages.conversation;
    break;
  case 'favourites':
    icon = 'star';
    title = messages.statusFavourites;
    break;
  case 'follow_requests':
    icon = 'users';  //  TODO : THIS SHOULDN'T BE THE SAME AS LOCAL TL
    title = messages.conversation;
    break;
  case 'mutes':
    icon = 'comments-o';
    title = messages.conversation;
    break;
  case 'not_found':
    icon = 'comments-o';
    title = messages.conversation;
    break;
  case 'reblogs':
    icon = 'comments-o';
    title = messages.conversation;
    break;
  case 'timeline':
    switch ((meta || {}).name) {
    case 'favourites':
      icon = 'star';
      title = messages.favourites;
      break;
    case 'hashtag':
      icon = 'hashtag';
      title = meta.query;
      break;
    case 'home':
      icon = 'comments-o';
      title = messages.home;
      break;
    case 'notifications':
      icon = 'bell';
      title = messages.notifications;
      break;
    case 'public':
      icon = meta.onlyLocal ? 'users' : 'globe';
      title = meta.onlyLocal ? messages.community : messages.public;
      break;
    default:
      icon = 'question-circle';
      title = messages.timeline;
      break;
    }
  default:
    icon = 'question-circle';
    title = messages.unknown;
    break;
  }

  let conditionalProps = {};
  if (onClick) {
    conditionalProps.onClick = onClick;
    conditionalProps.role = 'button';
    conditionalProps.tabIndex = '0';
  }

  return (
    <header className={computedClass} {...others}>
      <h1
        className='header\title'
        {...conditionalProps}
      >
        <CommonIcon className='header\icon' name={icon} />
        {title}
      </h1>
      {children}
    </header>
  );
}

ColumnHeader.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  meta: PropTypes.object,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
};

export default ColumnHeader;
