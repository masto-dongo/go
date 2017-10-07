//  RELATIONSHIP
//  ============

//  Upstream Mastodon stores relationships as objects tied to `id`s.
//  However, thanks to the magic of computing, we can store them as
//  plain numbers instead.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Requests.
import authorizeRelationship from './authorize';
import blockRelationship from './block';
import fetchRelationship from './fetch';
import followRelationship from './follow';
import muteRelationship from './mute';
import rejectRelationship from './reject';
import unblockRelationship from './unblock';
import unfollowRelationship from './unfollow';
import unmuteRelationship from './unmute';

//  Action types.
import { RELATIONSHIP_AUTHORIZE_SUCCESS } from 'themes/mastodon-go/redux/relationship/authorize'
import { RELATIONSHIP_BLOCK_SUCCESS } from 'themes/mastodon-go/redux/relationship/block';
import { RELATIONSHIP_FOLLOW_SUCCESS } from 'themes/mastodon-go/redux/relationship/follow';
import { RELATIONSHIP_MUTE_SUCCESS } from 'themes/mastodon-go/redux/relationship/mute';
import { RELATIONSHIP_UNBLOCK_SUCCESS } from 'themes/mastodon-go/redux/relationship/unblock';
import { RELATIONSHIP_UNFOLLOW_SUCCESS } from 'themes/mastodon-go/redux/relationship/unfollow';
import { RELATIONSHIP_UNMUTE_SUCCESS } from 'themes/mastodon-go/redux/relationship/unmute';
import { RELATIONSHIP_FETCH_SUCCESS } from 'themes/mastodon-go/redux/relationship/fetch';

//  Our imports.
import { RELATIONSHIP } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our relationships will be added
//  to this by `id`.
const initialState = ImmutableMap();

//  With `set()`, we just set the state at each `relationship`'s `id`
//  to be the appropriate `RELATIONSHIP`.
const set = (state, relationships) => state.withMutations(
  map => [].concat(relationships).forEach(
    relationship => {
      let value = RELATIONSHIP.NONE;
      if (relationship.followed_by) {
        value |= RELATIONSHIP.FOLLOWER;
      }
      if (relationship.following) {
        value |= RELATIONSHIP.FOLLOW;
      }
      if (relationship.requested) {
        value |= RELATIONSHIP.REQUESTED;
      }
      if (relationship.blocking) {
        value |= RELATIONSHIP.BLOCKED;
      }
      if (relationship.muting) {
        value |= RELATIONSHIP.MUTED;
        if (relationship.muting.notifications) {
          value |= RELATIONSHIP.NOTIFICATIONS_MUTED;
        }
      }
      map.set('' + relationship.id, value);
    }
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function relationship (state = initialState, action) {
  switch(action.type) {
  case RELATIONSHIP_AUTHORIZE_SUCCESS:
    return state.set('' + action.id, state.get('' + action.id) | RELATIONSHIP.FOLLOWER);
  case RELATIONSHIP_BLOCK_SUCCESS:
    return set(state, action.relationship);
  case RELATIONSHIP_FETCH_SUCCESS:
    return set(state, action.relationships);
  case RELATIONSHIP_FOLLOW_SUCCESS:
  case RELATIONSHIP_MUTE_SUCCESS:
  case RELATIONSHIP_UNBLOCK_SUCCESS:
  case RELATIONSHIP_UNFOLLOW_SUCCESS:
  case RELATIONSHIP_UNMUTE_SUCCESS:
    return set(state, action.relationship);
  default:
    return state;
  }
};

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  authorizeRelationship,
  blockRelationship,
  fetchRelationship,
  followRelationship,
  muteRelationship,
  rejectRelationship,
  unblockRelationship,
  unfollowRelationship,
  unmuteRelationship,
};
