//  <ProfileContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Profile from '.';

//  Request imports.
import {
  fetchAccount,
  updateAccount,
  blockRelationship,
  followRelationship,
  muteRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Selector factory.
export default connect(
  createStructuredSelector({
    at: (state, { id }) => state.getIn(['account', id, 'at']),
    bio: (state, { id }) => state.getIn(['account', id, 'bio']),
    counts: (state, { id }) => state.getIn(['account', id, 'counts']),
    datetime: (state, { id }) => state.getIn(['account', id, 'datetime']),
    header: (state, { id }) => state.getIn(['account', id, 'header']),
    href: (state, { id }) => state.getIn(['account', id, 'href']),
    local: (state, { id }) => !state.getIn(['account', id, 'domain']),
    rainbow: (state, { id }) => state.getIn(['account', id, 'rainbow']),
    relationship: (state, { id }) => state.getIn(['relationship', id]),
  }),
  (go, store, id) => ({
    block: () => go(blockRelationship, id),
    fetch: (newId = id) => go(fetchAccount, newId, true),
    follow: () => go(followRelationship, id),
    mute: () => go(muteRelationship, id),
    unblock: () => go(unblockRelationship, id),
    unfollow: () => go(unfollowRelationship, id),
    unmute: () => go(unmuteRelationship, id),
    update: info => go(updateAccount, info),
  })
)(Profile);
