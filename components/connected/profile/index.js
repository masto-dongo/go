import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Request imports.
import { fetchAccount } from 'themes/mastodon-go/redux';

import {
  CommonButton,
  CommonLink,
  CommonImage,
  ConnectedAccount,
  ConnectedParse,
} from 'themes/mastodon-go/components';

import './style.scss';

import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

class Profile extends React.PureComponent {

  constructor (props) {
    super(props);
    const {
      rehash,
      '💪': { fetch },
    } = this.props;

    //  Function binding.
    if (rehash) {
      this.handleFollowersClick = rehash.bind(this, '#followers');
      this.handleFollowsClick = rehash.bind(this, '#follows');
      this.handlePostsClick = rehash.bind(this, '#posts');
    }

    //  Fetching.
    fetch();
  }

  //  If our `id` is about to change, we need to fetch the new account.
  componentWillReceiveProps (nextProps) {
    const {
      id,
      '💪': { fetch },
    } = this.props;
    if (id !== nextProps.id) {
      fetch(nextProps.id);
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
      className,
      history,
      id,
      rehash,
      ℳ,
      '🏪': {
        bio,
        counts,
        header,
        href,
        local,
        rainbow,
      },
      '💪': handler,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PROFILE', className);

    return (
      <article
        className={computedClass}
        {...rest}
      >
        <header style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}>
          {header ? (
            <CommonImage
              animatedSrc={header.get('original')}
              description=''
              staticSrc={header.get('static')}
            />
          ) : null}
          {
            //  We don't give the `<ConnectedAccount>` our `history`
            //  because we don't *want* it to open in the web view.
            <ConnectedAccount id={id} />
          }
        </header>
        {
          //  If the account isn't local, then we provide a disclaimer.
          !local ? (
            <strong>
              {ℳ.disclaimer}
              <CommonLink href={href}>{ℳ.view}</CommonLink>
            </strong>
          ) : null
        }
        <ConnectedParse
          metadata={bio ? bio.getIn(['ɣaml', 'metadata']) : void 0}
          text={bio ? bio.getIn(['ɣaml', 'text']) : void 0}
          type='account'
        />
        <footer>
          <CommonButton
            destination={activeRoute ? '#posts' : void 0}
            history={history}
            onClick={!activeRoute ? handlePostsClick : undefined}
          >
            {ℳ.posts}
            <strong>{counts.get('statuses')}</strong>
          </CommonButton>
          <CommonButton
            destination={activeRoute ? '#follows' : void 0}
            history={history}
            onClick={!activeRoute ? handleFollowsClick : undefined}
          >
            {ℳ.follows}
            <strong>{counts.get('following')}</strong>
          </CommonButton>
          <CommonButton
            destination={activeRoute ? '#followers' : void 0}
            history={history}
            onClick={!activeRoute ? handleFollowersClick : undefined}
          >
            {ℳ.followers}
            <strong>{counts.get('followers')}</strong>
          </CommonButton>
        </footer>
      </article>
    );
  }

}


//  Props.
Profile.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  history: PropTypes.object,
  id: PropTypes.string,
  rehash: PropTypes.func,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    bio: ImmutablePropTypes.map,
    counts: ImmutablePropTypes.map,
    header: ImmutablePropTypes.map,
    href: PropTypes.string,
    local: PropTypes.bool,
    rainbow: ImmutablePropTypes.map,
    relationship: PropTypes.number,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

var ConnectedProfile;

//  Selector factory.
moduleOnReady(function () {
  ConnectedProfile = connect(

    //  Component.
    Profile,

    //  Store.
    createStructuredSelector({
      bio: (state, { id }) => state.getIn(['account', id, 'bio']),
      counts: (state, { id }) => state.getIn(['account', id, 'counts']),
      header: (state, { id }) => state.getIn(['account', id, 'header']),
      href: (state, { id }) => state.getIn(['account', id, 'href']),
      local: (state, { id }) => !state.getIn(['account', id, 'domain']),
      rainbow: (state, { id }) => state.getIn(['account', id, 'rainbow']),
      relationship: (state, { id }) => state.getIn(['relationship', id]),
    }),

    //  Messages.
    defineMessages({
      disclaimer: {
        defaultMessage: 'Information below may reflect the user\'s profile incompletely.',
        description: 'Shown when viewing a non-local account',
        id: 'profile.disclaimer',
      },
      followers: {
        defaultMessage: 'Followers',
        description: 'Labels an account\'s followers count',
        id: 'profile.followers',
      },
      follows: {
        defaultMessage: 'Follows',
        description: 'Labels an account\'s following count',
        id: 'profile.follows',
      },
      posts: {
        defaultMessage: 'Posts',
        description: 'Labels an account\'s post count',
        id: 'profile.posts',
      },
      view: {
        defaultMessage: 'View full profile',
        description: 'Labels a link for viewing a user\'s static profile page',
        id: 'profile.view',
      },
    }),

    //  Handler.
    (go, store, { id }) => ({
      fetch: (newId = id) => go(fetchAccount, newId, true),
    })
  );
});

export { ConnectedProfile as default };
