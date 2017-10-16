//  Imports
//  -------

//  Package imports.
import classNames from 'classnames'
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

const messages = defineMessages({
  all: {
    defaultMessage: 'Posts (with replies)',
    id: 'profile.all',
  },
  media: {
    defaultMessage: 'Media',
    id: 'profile.media',
  },
  pinned: {
    defaultMessage: 'Pinned',
    id: 'profile.pinned',
  },
  profile: {
    defaultMessage: 'Profile',
    id: 'profile.profile',
  },
  posts: {
    defaultMessage: 'Posts',
    id: 'profile.posts',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ProfileMenu extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    title: PropTypes.node,
  };

  //  Click handling.
  handleProfileClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#')
    }
  }
  handlePinnedClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#pinned')
    }
  }
  handlePostsClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#posts')
    }
  }
  handleAllClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#all')
    }
  }
  handleMediaClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#media')
    }
  }

  //  Rendering.
  render () {
    const {
      handleAllClick,
      handleMediaClick,
      handlePinnedClick,
      handlePostsClick,
      handleProfileClick,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      onSetHash,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--PROFILE--MENU', className);

    return (
      <CommonMenubar
        className={computedClass}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon='user'
          onClick={!activeRoute ? handleProfileClick : undefined}
          title={title || intl.formatMessage(messages.profile)}
        />
        <CommonButton
          active={hash === '#pinned'}
          destination={activeRoute ? '#pinned' : undefined}
          history={history}
          icon='thumb-tack'
          onClick={!activeRoute ? handlePinnedClick : undefined}
          title={intl.formatMessage(messages.pinned)}
        />
        <CommonButton
          active={hash === '#posts'}
          destination={activeRoute ? '#posts' : undefined}
          history={history}
          icon='comment'
          onClick={!activeRoute ? handleProfileClick : undefined}
          title={intl.formatMessage(messages.posts)}
        />
        <CommonButton
          active={hash === '#all'}
          destination={activeRoute ? '#all' : undefined}
          history={history}
          icon='comments'
          onClick={!activeRoute ? handleProfileClick : undefined}
          title={intl.formatMessage(messages.all)}
        />
        <CommonButton
          active={hash === '#media'}
          destination={activeRoute ? '#media' : undefined}
          history={history}
          icon='paint-brush'
          onClick={!activeRoute ? handleProfileClick : undefined}
          title={intl.formatMessage(messages.media)}
        />
      </CommonMenubar>
    );
  }

}
