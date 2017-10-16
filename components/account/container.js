/*********************************************************************\
|                                                                     |
|   <AccountContainer>                                                |
|   ==================                                                |
|                                                                     |
|   This is pretty simple—we just snatch the necessary account info   |
|   from the store.                                                   |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Account from '.';

//  Request imports.
import {
  authorizeRelationship,
  blockRelationship,
  followRelationship,
  muteRelationship,
  rejectRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
} from 'themes/mastodon-go/redux';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(
  createStructuredSelector({
    at: (state, { id }) => state.getIn(['account', id, 'at']),
    displayName: (state, { id }) => state.getIn(['account', id, 'displayName']),
    href: (state, { id }) => state.getIn(['account', id, 'href']),
    me: state => state.getIn(['meta', 'me']),
    rainbow: (state, { id }) => state.getIn(['account', id, 'rainbow']),
    relationship: (state, { id }) => state.getIn(['relationship', id]),
  }),
  (go, store, { id }) => ({
    authorize: () => go(authorizeRelationship, id),
    block: () => go(blockRelationship, id),
    follow: () => go(followRelationship, id),
    mute: () => go(muteRelationship, id),
    reject: () => go(rejectRelationship, id),
    unblock: () => go(unblockRelationship, id),
    unfollow: () => go(unfollowRelationship, id),
    unmute: () => go(unmuteRelationship, id),
  })
)(Account);
