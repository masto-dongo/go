//  <ConnectedProfile>
//  ==================

//  This component renders a user profile given an `id`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonButton,
  CommonLink,
  CommonImage,
  ConnectedAccount,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Request imports.
import { fetchAccount } from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Profile extends React.Component {  //  Impure

  //  Constructor.
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

  //  Rendering.
  render () {
    const {
      handleFollowersClick,
      handleFollowsClick,
      handlePostsClick,
    } = this;
    const {
      className,
      id,
      ℳ,
      '🏪': {
        bio,
        counts,
        header,
        href,
        local,
        rainbow,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PROFILE', className);

    //  We render the profile inside of an article.
    return (
      <article className={computedClass}>
        <header style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}>
          {header ? (
            <CommonImage
              animatedSrc={header.get('original')}
              description=''
              staticSrc={header.get('static')}
            />
          ) : null}
          <ConnectedAccount id={id} />
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
            onClick={handlePostsClick}
            role='link'
          >
            {ℳ.posts}
            <strong>{counts.get('statuses')}</strong>
          </CommonButton>
          <CommonButton
            onClick={handleFollowsClick}
            role='link'
          >
            {ℳ.follows}
            <strong>{counts.get('following')}</strong>
          </CommonButton>
          <CommonButton
            onClick={handleFollowersClick}
            role='link'
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
  className: PropTypes.string,
  id: PropTypes.string,  //  The id of the account
  rehash: PropTypes.func,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    bio: ImmutablePropTypes.map,  //  The account bio
    counts: ImmutablePropTypes.map,  //  Counts for the account
    header: ImmutablePropTypes.map,  //  The account header
    href: PropTypes.string,  //  The URL of the account static page
    local: PropTypes.bool,  //  Whether the account is local
    rainbow: ImmutablePropTypes.map,  //  The account rainbows
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component
var ConnectedProfile = connect(

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

//  Exporting.
export { ConnectedProfile as default };
