import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  CommonButton,
  CommonLink,
  CommonImage,
} from 'themes/mastodon-go/components';

const messages = defineMessages({
  disclaimer: {
    defaultMessage: 'Information below may reflect the user\'s profile incompletely.',
    id: 'profile.disclaimer',
  },
  following: {
    defaultMessage: 'Following',
    id: 'profile.following',
  },
  follows: {
    defaultMessage: 'Follows',
    id: 'profile.follows',
  },
  posts: {
    defaultMessage: 'Posts',
    id: 'profile.posts',
  },
  view: {
    defaultMessage: 'View full profile',
    id: 'profile.view',
  },
});

export default class ProfileContent extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
  }

  handleFollowersClick () {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#followers');
    }
  }
  handleFollowsClick () {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#follows');
    }
  }
  handlePostsClick () {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#posts');
    }
  }

  render () {
    const {
      handleFollowersClick,
      handleFollowsClick,
      handlePostsClick,
    } = this;
    const {
      activeRoute,
      bio,
      className,
      counts,
      handler,
      header,
      history,
      href,
      id,
      local,
      me,
      onSetHash,
      rainbow,
      relationship,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--PROFILE--CONTENT', className);

    return (
      <article
        className={computedClass}
        {...rest}
      >
        <header>
          <CommonImage
            animatedSrc={header.get('original')}
            description=''
            staticSrc={header.get('static')}
          />
          {
            //  We don't give the `<AccountContainer>` our `history`
            //  because we don't *want* it to open in the web view.
            <AccountContainer id={id} />
          }
        </header>
        {
          //  If the account isn't local, then we provide a disclaimer.
          !local ? (
            <strong>
              <FormattedMessage {...messages.disclaimer} />
              <CommonLink href={href}><FormattedMessages {...messages.view} /></CommonLink>
            </strong>
          ) : null
        }
        <ParseContainer
          metadata={bio.get('metadata')}
          text={bio.get('text')}
          type='account'
        />
        <footer>
          <CommonButton
            destination={activeRoute ? '#posts' : void 0}
            history={history}
            onClick={!activeRoute ? handlePostsClick : undefined}
          >
            <FormattedMessage {...messages.posts} />
            <strong>{counts.get('statuses')}</strong>
          </CommonButton>
          <CommonButton
            destination={activeRoute ? '#follows' : void 0}
            history={history}
            onClick={!activeRoute ? handleFollowsClick : undefined}
          >
            <FormattedMessage {...messages.follows} />
            <strong>{counts.get('following')}</strong>
          </CommonButton>
          <CommonButton
            destination={activeRoute ? '#followers' : void 0}
            history={history}
            onClick={!activeRoute ? handleFollowersClick : undefined}
          >
            <FormattedMessage {...messages.followers} />
            <strong>{counts.get('followers')}</strong>
          </CommonButton>
        </footer>
      </article>
    );
  }

}
