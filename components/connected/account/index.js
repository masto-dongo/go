//  <ConnectedAccount>
//  ==================

//  These *aren't* user profiles—see `<ConnectedProfile>` for that.
//  `<ConnectedAccount>` provides accounts in a format suitable for
//  inclusion in a `<CommonList>`, ie for use in `<ConnectedCourier>`s
//  or `<ConnectedCatalogue>`s.  It is also used inside
//   `<ConnectedStatus>`es to render the status author.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Component imports.
import {
  CommonButton,
  CommonLink,
  CommonObserveäble,
  ConnectedAvatar,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Request imports.
import {
  authorizeRelationship,
  blockRelationship,
  fetchAccount,
  fetchRelationship,
  followRelationship,
  muteRelationship,
  rejectRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
} from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import {
  POST_TYPE,
  RELATIONSHIP,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Account extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);

    //  Fetching the account.  This only goes through if the account
    //  isn't already in our store.
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

  //  When a user clicks on the account, we navigate to the appropriate
  //  profile.
  handleClick () {
    const {
      id,
      navigable,
    } = this.props;
    if (!navigable) {
      return;
    }
    DOMEventNavigate(`/profile/${id}`);
  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      className,
      comrade,
      containerId,
      id,
      navigable,
      observer,
      small,
      type,
      ℳ,
      '🏪': {
        at,
        displayName,
        href,
        me,
        relationship,
      },
      '💪': {
        authorize,
        block,
        follow,
        mute,
        reject,
        unblock,
        unfollow,
        unmute,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--ACCOUNT', {
      navigable,
      small,
    }, className);

    //  We render our component inside of a `<CommonObserveäble>` in
    //  case it appears inside of a list.  If `observer` is `null` then
    //  this won't do anything.
    return (
      <CommonObserveäble
        article={!small}
        className={computedClass}
        id={containerId || id}
        observer={observer}
        searchText={displayName + '\n@' + at}
      >
        {
          //  We don't bother with a `<Reference>` here because we
          //  already have all of the account info and this lets us put
          //  everything in one link.
          <CommonLink
            className='info'
            href={href}
            onClick={navigable ? handleClick : null}
          >
            <ConnectedAvatar
              account={id}
              comrade={comrade}
            />
            <b>
              <ConnectedParse
                text={displayName || '———'}
                type='emoji'
              />
            </b>
            <code>@{at}</code>
          </CommonLink>
        }
        <div className='buttons'>
          {
            //  This function gets our interaction button for use with
            //  the account.  We don't show this on `small` accounts
            //  (which appear in status headers) or if we aren't provided
            //   a `type` and `relationship`.
            !small && type && isFinite(relationship) && id !== me ? function () {
              switch (type) {
              case POST_TYPE.REQUEST:
                return [
                  <CommonButton
                    icon='check'
                    key='authorize'
                    onClick={authorize}
                    title={ℳ.authorize}
                  />,
                  <CommonButton
                    icon='times'
                    key='reject'
                    onClick={reject}
                    title={ℳ.reject}
                  />,
                ];
              case POST_TYPE.BLOCK:
                return relationship & RELATIONSHIP.BLOCKED ? (
                  <CommonButton
                    icon='circle-o'
                    onClick={unblock}
                    title={ℳ.unblock}
                  />
                ) : (
                  <CommonButton
                    icon='ban'
                    onClick={block}
                    title={ℳ.block}
                  />
                );
              case POST_TYPE.MUTE:
                return relationship & RELATIONSHIP.MUTED ? (
                  <CommonButton
                    icon='volume-up'
                    onClick={unmute}
                    title={ℳ.unmute}
                  />
                ) : (
                  <CommonButton
                    icon='volume-off'
                    onClick={mute}
                    title={ℳ.mute}
                  />
                );
              default:
                if (relationship & RELATIONSHIP.REQUESTED) {
                  return (
                    <CommonButton
                      icon='hourglass'
                      onClick={unfollow}
                      title={ℳ.requested}
                    />
                  )
                }
                return relationship & RELATIONSHIP.FOLLOWED ? (
                  <CommonButton
                    icon='user-times'
                    onClick={unfollow}
                    title={ℳ.unfollow}
                  />
                ) : (
                  <CommonButton
                    icon='user-plus'
                    onClick={follow}
                    title={ℳ.follow}
                  />
                );
              }
            }() : null
          }
        </div>
      </CommonObserveäble>
    );
  }

}

//  Props.
Account.propTypes = {
  className: PropTypes.string,
  comrade: PropTypes.string,  //  The id of an associated account, for example a post reblogger
  containerId: PropTypes.string,  //  The id to use with the observer, if not the same as `id`
  id: PropTypes.string.isRequired,  //  The account `id`
  navigable: PropTypes.bool,  //  `true` if a link to the account's profile should be created
  observer: PropTypes.object,  //  An intersection observer, usually provided through `<CommonList>`
  small: PropTypes.bool,  //  `true` for a more minimal component (eg, for use in statuses)
  type: PropTypes.number,  //  A `POST_TYPE`
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    at: PropTypes.string.isRequired,  //  The @username[@instance.tld] of the account
    displayName: PropTypes.string,  //  The display name for the account
    href: PropTypes.string,  //  The external location of the account
    me: PropTypes.string,  //  The current user's id
    relationship: PropTypes.number,  //  A `RELATIONSHIP` between the user and the account
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedAccount = connect(

  //  Component.
  Account,

  //  Store.
  createStructuredSelector({
    at: (state, { id }) => state.getIn(['account', id, 'at']),
    displayName: (state, { id }) => state.getIn(['account', id, 'displayName']),
    href: (state, { id }) => state.getIn(['account', id, 'href']),
    me: state => state.getIn(['meta', 'me']),
    relationship: (state, { id }) => state.getIn(['relationship', id]),
  }),

  //  Messages.
  defineMessages({
    authorize: {
      defaultMessage: 'Authorize follow request',
      description: 'Label for the button to authorize follow requests',
      id: 'account.authorize',
    },
    block: {
      defaultMessage: 'Block',
      description: 'Label for the block button',
      id: 'account.block',
    },
    follow: {
      defaultMessage: 'Follow',
      description: 'Label for the follow button',
      id: 'account.follow',
    },
    mute: {
      defaultMessage: 'Mute',
      description: 'Label for the mute button',
      id: 'account.mute',
    },
    reject: {
      defaultMessage: 'Reject follow request',
      description: 'Label for the button to reject follow requests',
      id: 'account.reject',
    },
    requested: {
      defaultMessage: 'Follow request sent (click to cancel)',
      description: 'Label for the requested follow button',
      id: 'account.requested',
    },
    unblock: {
      defaultMessage: 'Unblock',
      description: 'Label for the unblock button',
      id: 'account.unblock',
    },
    unfollow: {
      defaultMessage: 'Unfollow',
      description: 'Label for the unfollow button',
      id: 'account.unfollow',
    },
    unmute: {
      defaultMessage: 'Unmute',
      description: 'Label for the unmute button',
      id: 'account.unmute',
    },
  }),

  //  Handlers.
  (go, store, { id }) => ({
    authorize: id => go(authorizeRelationship, id),
    block: id => go(blockRelationship, id),
    fetch: (newId = id) => {
      go(fetchAccount, newId, false);
      go(fetchRelationship, newId, false);
    },
    follow: id => go(followRelationship, id),
    mute: id => go(muteRelationship, id),
    reject: id => go(rejectRelationship, id),
    unblock: id => go(unblockRelationship, id),
    unfollow: id => go(unfollowRelationship, id),
    unmute: id => go(unmuteRelationship, id),
  })
);

//  Exporting.
export { ConnectedAccount as default };
